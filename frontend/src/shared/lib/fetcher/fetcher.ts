interface FetcherOptions extends RequestInit {
  skipAuth?: boolean; // (추후 인증 확장용, 지금은 사용 X)
}

/**
 * 서버 API 응답 타입은 반드시 명시한다.
 * @param url - 요청 URL
 * @param options - fetch options
 * @returns 응답 데이터 (타입 안전)
 */
export async function fetcher<TResponse>(url: string, options?: FetcherOptions): Promise<TResponse> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const contentType = response.headers.get('Content-Type');

  if (!response.ok) {
    // 실패한 경우: 타입을 정해줌
    let errorBody: { message?: string } | null = null;

    if (contentType?.includes('application/json')) {
      errorBody = await response.json();
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
