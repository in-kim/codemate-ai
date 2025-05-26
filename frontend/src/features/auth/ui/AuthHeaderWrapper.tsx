"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/auth-store';
import { Header } from '@/shared/ui/header';
import Image from 'next/image';
import Link from 'next/link';
import { useShallow } from 'zustand/shallow';

export const AuthHeaderWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { userInfo } = useAuthStore(useShallow((state) => ({ userInfo: state.userInfo })));



  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Header 
      rightSlot={
        <div className="flex items-center gap-2">
          <div className='overflow-hidden rounded-full border-1 border-transparent'>
            {
              isMounted && userInfo ? (
                <Image src={userInfo.avatarUrl} alt={userInfo.username} width={24} height={24} />
              ) : (
                <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}`} title="GitHub 로그인">
                  <Image src="/github-mark-white.svg" alt="GitHub" width={24} height={24} />
                </Link>
              )
            }
          </div>
        </div>
      }
    />
  );
};

