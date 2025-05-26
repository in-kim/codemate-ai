'use client';

import { IWorkspace } from '@/shared/lib/services/workspace.service';
import { cn } from '@/shared/lib/utils';
import { IconButton } from '@/shared/ui/iconButon/iconButton';
import useWorkspaceData from '../hooks/use-workspace-data';
import { useEffect, useState } from 'react';

function WorkspaceDeleteButton({ workspace }: { workspace: IWorkspace }) {
  const { isLoading, handleDeleteWorkspace, handleLeaveWorkspace, userInfo } = useWorkspaceData();

  return userInfo?.userId === workspace.owner ? (
    <IconButton onClick={() => handleDeleteWorkspace(workspace.workSpaceId, workspace.workSpaceName as string)} icon="trash" disabled={isLoading} />
  ) : (
    <IconButton onClick={() => handleLeaveWorkspace(workspace.workSpaceId, workspace.workSpaceName as string)} icon="leave" disabled={isLoading} />
  );
}

export interface WorkspaceListClientProps {
  workspaces: IWorkspace[];
  selectedWorkspaceId: string | null;
  onSelectWorkspace: (workspaceId: string) => void;
}

export function WorkspaceListClient({ workspaces, selectedWorkspaceId, onSelectWorkspace }: WorkspaceListClientProps) {
  // 클라이언트 사이드 렌더링을 위한 상태
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 서버 사이드 렌더링 시에는 아무것도 렌더링하지 않음
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
      {workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <div
            key={workspace.workSpaceId}
            className={cn(
              'flex items-center justify-between p-3 rounded-md hover:bg-[#333]',
              selectedWorkspaceId === workspace.workSpaceId ? 'bg-[#333]' : 'bg-[#252526]'
            )}
            onClick={() => onSelectWorkspace(workspace.workSpaceId)}
          >
            <span className="text-sm">{workspace.workSpaceName}</span>
            <WorkspaceDeleteButton workspace={workspace} />
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500 p-3 rounded-md bg-[#252526]">워크스페이스가 없습니다.</div>
      )}
    </div>
  );
}
