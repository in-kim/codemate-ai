import { HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { LoggerService } from 'src/shared/logger/logger.service';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
import { ProgrammingLanguage } from 'src/shared/enums/language.enum';

const asyncExec = promisify(exec);

@Injectable()
export class ExecutionService {
  constructor(private readonly logger: LoggerService) {}

  async run(language: string, code: string): Promise<any> {
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
      const fileName =
        programmingLanguage === ProgrammingLanguage.PYTHON
          ? `${id}.py`
          : `${id}.js`;
      const filePath = path.join('/tmp', fileName);

      // 코드를 파일에 저장
      await fs.writeFile(filePath, code);
      this.logger.log(`파일 저장 완료: ${filePath}`, 'ExecutionService');

      // 언어별 Docker 이미지 및 실행 명령 정의
      let image = '';
      let execCmd = '';
      if (programmingLanguage === ProgrammingLanguage.PYTHON) {
        image = 'python:3.12-slim-bookworm';
        execCmd = `python /app/${fileName}`; // 컨테이너 내에서 실행할 명령
      } else if (programmingLanguage === ProgrammingLanguage.JAVASCRIPT) {
        image = 'node:18';
        execCmd = `node /app/${fileName}`;
      }

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
          timeout: 5000,
        });

        this.logger.log(
          `도커 실행 결과 - stdout: ${stdout}, stderr: ${stderr}`,
          'ExecutionService',
        );

        return { stdout, stderr, exitCode: 0 };
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
