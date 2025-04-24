// src/modules/execution/execution.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { LoggerService } from 'src/shared/logger/logger.service';
import { AppHttpException } from 'src/shared/exceptions/http.exception';
import { ErrorCodes } from 'src/shared/exceptions/error-codes';
const asyncExec = promisify(exec);

@Injectable()
export class ExecutionService {
  constructor(private readonly logger: LoggerService) {}

  async run(language: string, code: string): Promise<any> {
    this.logger.log(`실행 요청 - 언어: ${language}`, 'ExecutionService');

    try {
      if (!['python', 'javascript'].includes(language)) {
        throw new AppHttpException(
          ErrorCodes.UNSUPPORTED_LANGUAGE,
          HttpStatus.BAD_REQUEST,
        );
      }

      const id = randomUUID();
      const fileName = language === 'python' ? `${id}.py` : `${id}.js`;
      const filePath = path.join('/tmp', fileName);

      await fs.writeFile(filePath, code);

      // 언어별 Docker 이미지 및 실행 명령 정의
      let image = '';
      let execCmd = '';
      if (language === 'python') {
        image = 'python:3.11';
        execCmd = `python /app/${fileName}`; // 컨테이너 내에서 실행할 명령
      } else if (language === 'javascript') {
        image = 'node:18';
        execCmd = `node /app/${fileName}`;
      }

      // Docker 실행 명령어 조립
      const dockerCommand = [
        'docker run --rm', // 실행 후 컨테이너 삭제
        '--network none', // 외부 접속 차단 (보안 강화)
        '--memory 100m', // 메모리 제한
        '--cpus 0.5', // CPU 제한
        `-v /tmp:/app`, // 호스트 파일을 컨테이너로 마운트
        image, // 사용할 이미지
        execCmd, // 컨테이너 내 실행 명령
      ].join(' ');

      try {
        const { stdout, stderr } = await asyncExec(dockerCommand, {
          timeout: 5000,
        });
        this.logger.log(
          `도커 실행 - 컨테이너 ID: ${stdout}`,
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
          stdout: err.stdout,
          stderr: err.stderr || err.message,
          exitCode: err.code || 1,
        };
      } finally {
        await fs.unlink(filePath).catch(() => {});
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
