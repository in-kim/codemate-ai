import { Suspense } from 'react';
import { WorkspaceListClient } from './workspace-list-client';
import useWorkspaceData from '../hooks/use-workspace-data';

// 인터페이스는 클라이언트 컴포넌트로 이동

// WorkspaceDeleteButton 컴포넌트는 클라이언트 컴포넌트로 이동

export function WorkspaceList() {
  const { workspaces, selectedWorkspaceId, handleSelectWorkspace } = useWorkspaceData();

  return (
    <div className="flex flex-col space-y-2 py-2 px-3">
      <Suspense fallback={
        <div className="flex flex-col space-y-2">
          <div className="rounded-md bg-[#252526]">
            <div className="h-[44px] w-full bg-[#333] animate-pulse rounded"></div>
          </div>
        </div>
      }>
        <WorkspaceListClient 
          workspaces={workspaces} 
          selectedWorkspaceId={selectedWorkspaceId} 
          onSelectWorkspace={handleSelectWorkspace} 
        />
      </Suspense>
    </div>
  );
}