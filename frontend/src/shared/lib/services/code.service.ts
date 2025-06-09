import { TCodeResponse, TExecuteHistoryResponse, TExecutionResponse, TReviewResponse } from '@/shared/types/code';
import { fetcher } from '../fetcher';
import { handleApiError } from '../utils/utils';
/**
 * 코드 조회
 * @param workSpaceId 워크스페이스 ID
 * @returns 코드 정보
 */
export async function getCode(workSpaceId: string): Promise<TCodeResponse> {
  try {
    const response = await fetcher<TCodeResponse>(`/api/code/execute/${workSpaceId}`, {
      method: 'GET',
    });

    // console.log('response : ', response);
    return response as TCodeResponse;
  } catch (err) {
    handleApiError(err, '코드 조회 실패')
  }
}

/**
 * 코드 실행 이력 조회
 * @param codeId 코드 ID
 * @returns 코드 실행 이력
 */
export async function getExecuteHistory(codeId: string): Promise<TExecuteHistoryResponse> {
  try {
    const response = await fetcher<TExecuteHistoryResponse>(`/api/code/execute/history/${codeId}`, {
      method: 'GET',
    });

    // console.log('response : ', response);
    return response as TExecuteHistoryResponse;
  } catch (err) {
    handleApiError(err, '코드 실행 이력 조회 실패')
  } 
}

/**
 * 코드를 백엔드에 전송하여 실행합니다.
 * @param code 실행할 코드
 * @param language 코드 언어 (python, javascript)
 * @returns 실행 결과
 */
export async function executeCode(code: string, language: string, userId: string, workSpaceId: string): Promise<TExecutionResponse> {
  try {
    // 백엔드 API 호출
    const response = await fetcher<TExecutionResponse>('/api/code/execute', {
      method: 'POST',
      body: JSON.stringify({ code, language, userId, workSpaceId }),
    });

    return response as TExecutionResponse;
  } catch (error) {
    handleApiError(error, '코드 실행 실패')
  }
}
  
/**
 * 리뷰 요청
 * @param code 코드
 * @param language 언어
 * @param userId 사용자 ID
 * @param codeId 코드 ID
 * @returns 리뷰 응답
 */
export async function requestReview(code: string, language: string, userId: string, codeId: string): Promise<TReviewResponse> {
  try {
    const response = await fetcher<TReviewResponse>(`/api/review`, {
      method: 'POST',
      body: JSON.stringify({ code, language, userId, codeId }),
    });

    return response as TReviewResponse;
  } catch (err) {
    handleApiError(err, '리뷰 요청 실패')
  }
}