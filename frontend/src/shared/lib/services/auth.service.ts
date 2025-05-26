import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher';
import { User } from '@/shared/types/user';
import { handleApiError } from '../utils/utils';
/**
 * 로그인한 사용자 정보 조회
 * @returns 사용자 정보
 */
export async function getMyInfo(): Promise<HttpResponse<User>> {
  try {
    const response = await fetcher<HttpResponse<User>>(`/api/auth/me`, {
      method: 'GET',
    });
    return response as HttpResponse<User>;
  } catch (err) {
    handleApiError(err, '로그인한 사용자 정보 조회 실패')
  }
}