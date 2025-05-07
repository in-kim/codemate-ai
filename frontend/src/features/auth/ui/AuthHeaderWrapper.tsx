"use client";
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/auth-store';
import { checkAuth } from '@/shared/lib/utils/check-auth';
import { Header } from '@/shared/ui/header';
import Image from 'next/image';
import Link from 'next/link';

export const AuthHeaderWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore().getUser();

  useEffect(() => {
    async function fetchAuth() {
      await checkAuth();
    }
    if (!user) {
      fetchAuth();
    }
  }, [user]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Header 
      rightSlot={
        <div className='overflow-hidden rounded-full border-1 border-transparent'>
          {
            isMounted && user ? (
              <Image src={user.avatarUrl} alt={user.username} width={24} height={24} />
            ) : (
              <Link href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI}`} title="GitHub 로그인">
                <Image src="/github-mark-white.svg" alt="GitHub" width={24} height={24} />
              </Link>
            )
          }
        </div>
        
      }
    />
  );
};
