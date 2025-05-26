'use client';

import { cn } from '@/shared/lib/utils';
import { User } from '@/shared/types/user';
import { useEffect, useState } from 'react';

export interface CollaboratorListClientProps {
  collaborators: User[];
}

export function CollaboratorListClient({ collaborators }: CollaboratorListClientProps) {
  // 클라이언트 사이드 렌더링을 위한 상태
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 서버 사이드 렌더링 시에는 스켈레톤 UI 표시
  if (!mounted) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="p-3 rounded-md bg-[#252526]">
          <div className="h-5 w-24 bg-[#333] animate-pulse rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-2">
      {collaborators.length > 0 ? (
        collaborators.map((collaborator) => (
          <div
            key={collaborator.userId}
            className={cn(
              'flex items-center justify-between p-3 rounded-md bg-[#252526] hover:bg-[#333]',
            )}
          >
            <span className="text-sm">{collaborator.username}</span>
          </div>
        ))
      ) : (
        <div
          className={cn(
            'flex items-center justify-between p-3 rounded-md bg-[#252526] hover:bg-[#333]',
          )}
        >
          <span className="text-sm">협업자가 없습니다.</span>
        </div>
      )}
    </div>
  );
}
