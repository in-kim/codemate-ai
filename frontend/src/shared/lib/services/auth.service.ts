import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher';
import { User } from '@/shared/types/user';
import { cookies } from 'next/headers';
/**
 * 로그인한 사용자 정보 조회
 * @returns 사용자 정보
 */
export async function getMyInfo(): Promise<HttpResponse<User> | null> {
  try {
    const isServer = typeof window === 'undefined';
    // 서버컴포넌트에서 실행시
    if (isServer) {
      const cookieStore = await cookies();
      const accessToken = cookieStore.get('accessToken');
      const refreshToken = cookieStore.get('refreshToken');

      const cookieHeader = [];
      if (accessToken) cookieHeader.push(`accessToken=${accessToken.value}`);
      if (refreshToken) cookieHeader.push(`refreshToken=${refreshToken.value}`);

      return await fetcher<HttpResponse<User>>(`${process.env.BACKEND_API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader.join('; ')
        }
      });
    } else {
      return await fetcher<HttpResponse<User>>(`/api/auth/me`, {
        method: 'GET',
      });
    }
  } catch (error) {
    console.error('로그인한 사용자 정보 조회 실패:', error);
    return null;
  }
}