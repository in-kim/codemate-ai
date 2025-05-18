'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/auth-store';
import { Loading } from '@/shared/ui/loading';
import { useToastStore } from '@/shared/store/toast-store';

const AuthCallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    const userEncoded = searchParams?.get('user');
    if (typeof userEncoded === 'string') {
      try {
        const decoded = JSON.parse(atob(userEncoded));
        setUser(decoded);
        addToast('로그인 성공', 'success');
        router.replace('/');
      } catch (err) {
        addToast('로그인 실패', 'error');
        console.error('유저 디코딩 실패:', err);
      }
    }
  }, [addToast, router, searchParams, setUser]);

  return <div className='hidden'></div>;
};

const AuthCallback = () => {

  return (
    <Suspense fallback={<Loading />}>
      <AuthCallbackContent />
    </Suspense>
  )
};

export default AuthCallback;
