import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICodeHistory } from 'src/models/code-history.model';
import { ICode } from 'src/models/code.model';
import { LoggerService } from 'src/shared/logger/logger.service';
import { EventService } from 'src/shared/events/event.service';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
import { CodeExecutedEvent } from 'src/shared/events/code-executed.event';
import {
  ProgrammingLanguage,
  LanguageExtensions,
} from 'src/shared/enums/language.enum';

import { promisify } from 'util';
import { exec } from 'child_process';

const asyncExec = promisify(exec);

@Injectable()
export class CodeService {
  constructor(
    @InjectModel('Code') private codeModel: Model<any>,
    @InjectModel('CodeHistory') private codeHistoryModel: Model<any>,
    private readonly logger: LoggerService,
    private readonly eventService: EventService,
  ) {}

  /**
   * 워크스페이스 ID로 코드를 조회합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보
   */
  async getCode(workSpaceId: string): Promise<ICode> {
    const code = await this.codeModel.findOne({ workSpaceId }).exec();

    if (!code) {
      throw new NotFoundException(
        `워크스페이스 ID ${workSpaceId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    return code as ICode;
  }

  /**
   * 워크스페이스 ID로 코드를 조회하고 최신 히스토리를 함께 반환합니다.
   * @param workSpaceId 워크스페이스 ID
   * @returns 코드 정보와 최신 히스토리
   */
  async getCodeWithHistory(workSpaceId: string) {
    const code = await this.codeModel.findOne({ workSpaceId }).exec();

    if (!code) {
      throw new NotFoundException(
        `워크스페이스 ID ${workSpaceId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    // 가상 필드를 사용하여 최신 히스토리 가져오기
    const codeWithHistory = await this.codeModel
      .findOne({ workSpaceId })
      .populate('latestHistory')
      .exec();

    return {
      status: 'success',
      message: 'Request completed successfully',
      data: codeWithHistory,
    };
  }

  /**
   * 코드 ID로 코드 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @param limit 가져올 히스토리 개수 (기본값: 10)
   * @returns 코드 히스토리 목록
   */
  async getCodeHistory(codeId: string, limit = 10): Promise<ICodeHistory[]> {
    const codeHistories = await this.codeHistoryModel
      .find({ codeId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return codeHistories as ICodeHistory[];
  }

  /**
   * 코드 ID로 최신 코드 히스토리를 조회합니다.
   * @param codeId 코드 ID
   * @returns 최신 코드 히스토리
   */
  async getLatestCodeHistory(codeId: string): Promise<ICodeHistory> {
    // 정적 메서드 대신 직접 쿼리 사용
    const latestHistory = await this.codeHistoryModel
      .findOne({ codeId })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestHistory) {
      throw new NotFoundException(
        `코드 ID ${codeId}에 해당하는 히스토리를 찾을 수 없습니다.`,
      );
    }

    return latestHistory as ICodeHistory;
  }

  /**
   * 코드 ID로 코드를 조회하고 최신 히스토리의 코드 내용을 포함하여 반환합니다.
   * @param codeId 코드 ID
   * @returns 최신 히스토리의 코드 내용이 포함된 코드 정보
   */
  async getCodeWithLatestHistory(codeId: string) {
    // 정적 메서드 대신 직접 구현
    const code = await this.codeModel.findById(codeId).exec();

    if (!code) {
      throw new NotFoundException(
        `코드 ID ${codeId}에 해당하는 코드를 찾을 수 없습니다.`,
      );
    }

    const latestHistory = await this.codeHistoryModel
      .findOne({ codeId })
      .sort({ createdAt: -1 })
      .exec();

    if (latestHistory) {
      code.content = latestHistory.code;
    }

    return {
      status: 'success',
      message: 'Request completed successfully',
      data: code,
    };
  }

  async runCode(
    language: string,
    code: string,
    userId?: string,
    workSpaceId?: string,
  ): Promise<any> {
    this.logger.log(`실행 요청 - 언어: ${language}`, 'ExecutionService');

    try {
      // 지원하는 언어인지 확인
      if (
        !Object.values(ProgrammingLanguage).includes(
          language as ProgrammingLanguage,
        )
      ) {
        throw new AppHttpException(
          ErrorCodes.UNSUPPORTED_LANGUAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const id = randomUUID();
      const programmingLanguage = language as ProgrammingLanguage;

      // 언어별 Docker 이미지 및 실행 명령 정의
      let image = '';
      let execCmd = '';

      switch (programmingLanguage) {
        case ProgrammingLanguage.PYTHON:
          image = 'python:3.12-slim-bookworm';
          execCmd = `python /app/${id}.py`;
          break;
        case ProgrammingLanguage.JAVASCRIPT:
          image = 'node:18';
          execCmd = `node /app/${id}.js`;
          break;
        case ProgrammingLanguage.TYPESCRIPT:
          image = 'node:18';
          // TypeScript는 먼저 컴파일 후 실행
          execCmd = `npx -y typescript@latest --outFile /app/${id}.js /app/${id}.ts && node /app/${id}.js`;
          break;
        case ProgrammingLanguage.JAVA:
          image = 'openjdk:17-slim';
          // Java 파일 이름은 Main.java로 고정
          execCmd = `echo "${code}" > /app/${id}.java && javac /app/${id}.java && java -cp /app ${id}`;
          break;
        case ProgrammingLanguage.GO:
          image = 'golang:1.20-alpine';
          execCmd = `echo "${code}" > /app/${id}.go && go run /app/${id}.go`;
          break;
        case ProgrammingLanguage.PLAINTEXT:
          image = 'alpine:latest';
          execCmd = `echo "일반 텍스트는 코드로 실행할 수 없습니다."`;
          break;
        default:
          throw new AppHttpException(
            ErrorCodes.UNSUPPORTED_LANGUAGE,
            HttpStatus.BAD_REQUEST,
          );
      }

      // 파일 이름 생성 로직 수정
      const fileExtension = LanguageExtensions[programmingLanguage];
      const fileName = `${id}.${fileExtension}`;
      const filePath = path.join('/tmp', fileName);

      // 코드를 파일에 저장
      await fs.writeFile(filePath, code);
      this.logger.log(`파일 저장 완료: ${filePath}`, 'ExecutionService');

      // Docker 실행 명령어 조립
      const dockerCommand = [
        'docker run --rm', // 실행 후 컨테이너 삭제
        '--network none', // 외부 접속 차단 (보안 강화)
        '--memory 256m', // 메모리 제한
        '--cpus 1', // CPU 제한
        `-v ${path.dirname(filePath)}:/app`, // 호스트 파일을 컨테이너로 마운트
        '-i', // 상호작용 모드 활성화
        image, // 사용할 이미지
        `sh -c "${execCmd} 2>&1"`, // 컨테이너 내 실행 명령, 표준 오류를 표준 출력으로 리다이렉트
      ].join(' ');

      this.logger.log(`도커 실행 명령: ${dockerCommand}`, 'ExecutionService');

      try {
        const { stdout, stderr } = await asyncExec(dockerCommand, {
          timeout: 10000,
        });

        this.logger.log(
          `도커 실행 결과 - stdout: ${stdout}, stderr: ${stderr}`,
          'ExecutionService',
        );

        const result = { stdout, stderr, exitCode: 0 };

        // 코드 실행 이벤트 발생 (userId와 workSpaceId가 제공된 경우에만)
        if (userId && workSpaceId) {
          this.eventService.emit('code.executed', {
            _id: id,
            userId,
            workSpaceId,
            code,
            language,
            result,
            timestamp: new Date(),
          } as CodeExecutedEvent);

          this.logger.log(
            `코드 실행 이벤트 발생 - 워크스페이스: ${workSpaceId}`,
            'ExecutionService',
          );
        }

        return result;
      } catch (err: any) {
        this.logger.error(
          `도커 실행 오류: ${err.message} \n ${err.stderr}`,
          err.stack,
          'ExecutionService',
        );
        return {
          stdout: err.stdout || '',
          stderr: err.stderr || err.message,
          exitCode: err.code || 1,
        };
      } finally {
        // 임시 파일 삭제
        try {
          await fs.unlink(filePath);
          this.logger.log(
            `임시 파일 삭제 완료: ${filePath}`,
            'ExecutionService',
          );
        } catch (error) {
          this.logger.error(
            `임시 파일 삭제 실패: ${error.message}`,
            error.stack,
            'ExecutionService',
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `코드 실행 실패: ${error.message}`,
        error.stack,
        'ExecutionService',
      );

      // 에러가 AppHttpException이 아니면 내부 에러로 처리
      if (!(error instanceof AppHttpException)) {
        throw new AppHttpException(
          ErrorCodes.INTERNAL_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 이미 AppHttpException이면 그대로 던지기
      throw error;
    }
  }
}
