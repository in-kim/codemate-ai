// src/modules/execution/execution.service.ts
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';

const asyncExec = promisify(exec);

@Injectable()
export class ExecutionService {
  async run(language: string, code: string): Promise<any> {
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
    const dockerCommend = [
      'docker run --rm', // 실행 후 컨테이너 삭제
      '--network none', // 외부 접속 차단 (보안 강화)
      '--memory 100m', // 메모리 제한
      '--cpus 0.5', // CPU 제한
      `-v /tmp:/app`, // 호스트 파일을 컨테이너로 마운트
      image, // 사용할 이미지
      execCmd, // 컨테이너 내 실행 명령
    ].join(' ');

    try {
      const { stdout, stderr } = await asyncExec(dockerCommend, {
        timeout: 5000,
      });
      return { stdout, stderr, exitCode: 0 };
    } catch (err: any) {
      return {
        stdout: err.stdout,
        stderr: err.stderr || err.message,
        exitCode: err.code || 1,
      };
    } finally {
      await fs.unlink(filePath).catch(() => {});
    }
  }
}
