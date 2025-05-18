// shared/api/execution.ts
import { fetcher } from '../fetcher';

interface ExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * 코드를 백엔드에 전송하여 실행합니다.
 * @param code 실행할 코드
 * @param language 코드 언어 (python, javascript)
 * @returns 실행 결과
 */
export async function executeCode(code: string, language: string): Promise<ExecutionResponse> {
  try {
    // 백엔드 API 호출
    const response = await fetcher<ExecutionResponse>('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });

    return response;
  } catch (error) {
    console.error('코드 실행 실패:', error);
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : '코드 실행 중 오류가 발생했습니다.',
      exitCode: 1,
    };
  }
}