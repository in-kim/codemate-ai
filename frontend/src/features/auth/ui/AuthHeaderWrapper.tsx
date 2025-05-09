"use client";
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/auth-store';
import { Header } from '@/shared/ui/header';
import Image from 'next/image';
import Link from 'next/link';
import { useEditorStore } from '@/shared/store/editor-store';
import { useExecutionStore } from '@/shared/store/execution-store';
import { useToastStore } from '@/shared/store/toast-store';
import { useShallow } from 'zustand/shallow';
import { executeCode } from '@/shared/lib/services/execution.service';
import { Button } from '@/shared/ui/button';

export const AuthHeaderWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  const user = useAuthStore().getUser();
  const { code, language } = useEditorStore();
  const { addExecution } = useExecutionStore();
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );
  const [isExecutingFetching, setIsExecutingFetching] = useState(false);

  const handleExercuteCode = useCallback(async () => {
    const errorMessageMap = {
      'no-code': '코드를 입력해주세요.',
      'no-auth': '로그인이 필요합니다.',
    }

    const errorValidateArr = [
      {
        condition: !code.trim(),
        message: errorMessageMap['no-code'],
      },
      {
        condition: !useAuthStore.getState().getIsLogin(),
        message: errorMessageMap['no-auth'],
      } 
    ]

    const isError = errorValidateArr.some(({ condition, message }) => {
      if (condition) addToast(message, 'error');
      
      return condition;
    });

    if (isError) return;
    
    
    try {
      setIsExecutingFetching(true);
      const result = await executeCode(code, language);
      
      // 실행 결과 저장
      addExecution({
        code,
        language,
        stdout: result.stdout,
        stderr: result.stderr,
        exitCode: result.exitCode
      });
    } catch (error) {
      console.error('코드 실행 오류:', error);
    } finally {
      setIsExecutingFetching(false);
    }
  }, [code, addToast, language, addExecution]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Header 
      rightSlot={
        <div className="flex items-center gap-2">

          <Button
              variant="ghost"
              className="hover:bg-[#1177bb] text-white px-2 py-1 text-sm"
              onClick={handleExercuteCode}
              disabled={isExecutingFetching}
            >
              ▶ Run
            </Button>
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
        </div>
      }
    />
  );
};

