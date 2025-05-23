import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher';
import { User } from '@/shared/types/user';
/**
 * 로그인한 사용자 정보 조회
 * @returns 사용자 정보
 */
export async function getMyInfo(): Promise<HttpResponse<User> | null> {
  try {
    return await fetcher<HttpResponse<User>>(`/api/auth/me`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('로그인한 사용자 정보 조회 실패:', error);
    return null;
  }
}