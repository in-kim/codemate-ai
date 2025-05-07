'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import { Loading } from '@/shared/ui/loading';
const AuthCallback = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const userEncoded = searchParams?.get('user');
    if (typeof userEncoded === 'string') {
      try {
        const decoded = JSON.parse(atob(userEncoded));
        setUser(decoded);
        router.replace('/'); // 인증 후 페이지 이동
      } catch (err) {
        console.error('유저 디코딩 실패:', err);
      }
    }
  }, [router, searchParams, setUser]);

  return <Loading />;
};

export default AuthCallback;
