import { useAuthStore } from "@/shared/store/auth-store";
import { useToastStore } from "@/shared/store/toast-store";
import { logError } from "../utils/errorLogger";

interface FetcherOptions extends RequestInit {
  skipAuth?: boolean; // (추후 인증 확장용, 지금은 사용 X)
}

/**
 * 서버 API 응답 타입은 반드시 명시한다.
 * @param url - 요청 URL
 * @param options - fetch options
 * @returns 응답 데이터 
 */
export async function fetcher<TResponse>(url: string, options?: FetcherOptions): Promise<TResponse | Error> {
  const isServer = typeof window === 'undefined';
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  }
  
  // 서버 컴포넌트에서만 실행되는 코드
  if (isServer) {
    // 동적 임포트를 사용하여 서버 전용 모듈이 클라이언트 번들에 포함되지 않도록 함
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    const refreshToken = cookieStore.get('refreshToken');

    const cookieHeader = [];
    if (accessToken) cookieHeader.push(`accessToken=${accessToken.value}`);
    if (refreshToken) cookieHeader.push(`refreshToken=${refreshToken.value}`);

    headers['Cookie'] = cookieHeader.join('; ');
  }
  
  const response = await fetch(isServer ? `${process.env.BACKEND_API_URL}${url}` : url, {
    ...options,
    credentials: 'include',
    headers: headers,
  });

  const contentType = response.headers.get('Content-Type');

  if (!response.ok) {
    // 실패한 경우: 타입을 정해줌
    let errorBody: { message?: string } | null = null;

    if (contentType?.includes('application/json')) {
      errorBody = await response.json();
    }

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        useToastStore.getState().addToast('로그인이 필요합니다.', 'error');
        useAuthStore.getState().clearUser();
      }

      logError("Unauthorized");

      // 401은 에러바운더리에 걸리지 않게 하기 위해 에러로 응답
      return {
        message: 'Unauthorized',
        status: 'fail',
        data: null
      } as TResponse;
    }

    const errorMessage = errorBody?.message || response.statusText || 'API Error';
    throw new Error(errorMessage);
  }

  if (contentType?.includes('application/json')) {
    return (await response.json()) as TResponse;
  } else {
    throw new Error('Invalid response format. Expected JSON.');
  }
}
