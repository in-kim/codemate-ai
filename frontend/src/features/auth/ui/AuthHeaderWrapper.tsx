"use client";
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/auth-store';
import { Header } from '@/shared/ui/header';
import Image from 'next/image';
import Link from 'next/link';
import { useEditorStore } from '@/shared/store/editor-store';
import { fetcher } from '@/shared/lib/fetcher';

export const AuthHeaderWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore().getUser();
  const { code, language } = useEditorStore();

  const runCode = useCallback(async () => {
    try{
      const res = await fetcher('/api/execute', {
        method: 'POST',
        body: JSON.stringify({
          code: code,
          language: language,
        }),
      });
      console.log(res);
    } catch(err) {
      console.error(err);
    }
  }, [code, language]);

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
      onRunClick={runCode}
    />
  );
};
