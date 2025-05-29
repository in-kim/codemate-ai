import { TCodeResponse } from '@/shared/types/code';
import { fetcher } from '../fetcher';
import { handleApiError } from '../utils/utils';
/**
 * 워크스페이스의 코드 조회
 * @returns 코드 정보
 */
export async function getCode(workSpaceId: string): Promise<TCodeResponse> {
  try {
    const response = await fetcher<TCodeResponse>(`/api/code/${workSpaceId}`, {
      method: 'GET',
    });

    console.log('response : ', response);
    return response as TCodeResponse;
  } catch (err) {
    handleApiError(err, '워크스페이스의 코드 조회 실패')
  }
}