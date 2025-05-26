// /app/workspace/[workspaceId]/error.tsx
'use client';

import { Button } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';

export default function WorkspaceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">오류가 발생했습니다</h2>
      <p className="mb-6">{error.message}</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>다시 시도</Button>
        <Button onClick={() => router.push('/onboarding')}>워크스페이스 생성으로 이동</Button>
      </div>
    </div>
  );
}