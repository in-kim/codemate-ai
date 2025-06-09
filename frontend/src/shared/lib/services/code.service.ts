import { TCodeResponse, TExecuteHistoryResponse } from '@/shared/types/code';
import { fetcher } from '../fetcher';
import { handleApiError } from '../utils/utils';
/**
 * 코드 조회
 * @param workSpaceId 워크스페이스 ID
 * @returns 코드 정보
 */
export async function getCode(workSpaceId: string): Promise<TCodeResponse> {
  try {
    const response = await fetcher<TCodeResponse>(`/api/code/${workSpaceId}`, {
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
    const response = await fetcher<TExecuteHistoryResponse>(`/api/code/history/${codeId}`, {
      method: 'GET',
    });

    // console.log('response : ', response);
    return response as TExecuteHistoryResponse;
  } catch (err) {
    handleApiError(err, '코드 실행 이력 조회 실패')
  } 
}
  