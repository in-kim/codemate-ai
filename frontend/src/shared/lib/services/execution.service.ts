// shared/api/execution.ts
import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher';
import { handleApiError } from '../utils/utils';

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
export async function executeCode(code: string, language: string): Promise<HttpResponse<ExecutionResponse>> {
  try {
    // 백엔드 API 호출
    const response = await fetcher<HttpResponse<ExecutionResponse>>('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });

    return response as HttpResponse<ExecutionResponse>;
  } catch (error) {
    handleApiError(error, '코드 실행 실패')
  }
}