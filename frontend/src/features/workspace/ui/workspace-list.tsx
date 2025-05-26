'use client';
import { IWorkspace } from '@/shared/lib/services/workspace.service';
import { cn } from '@/shared/lib/utils';
import { IconButton } from '@/shared/ui/iconButon/iconButton';
import useWorkspaceData from '../hooks/use-workspace-data';

export interface Workspace {
  id: string;
  name: string;
}

export interface WorkspaceListProps {
  workspaces: Workspace[];
}

function WorkspaceDeleteButton({ workspace }: { workspace: IWorkspace }) {
  const { isLoading, handleDeleteWorkspace, handleLeaveWorkspace, userInfo } = useWorkspaceData();

  return userInfo?.userId === workspace.owner ?(
    <IconButton onClick={() => handleDeleteWorkspace(workspace.workSpaceId, workspace.workSpaceName as string)} icon="trash" disabled={isLoading}/>
  ) : <IconButton onClick={() => handleLeaveWorkspace(workspace.workSpaceId, workspace.workSpaceName as string)} icon="leave" disabled={isLoading}/>
}

export function WorkspaceList() {
  const { workspaces, selectedWorkspaceId, handleSelectWorkspace } = useWorkspaceData();

  return (
    <div className="flex flex-col space-y-2 py-2 px-3">
      {workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <div
            key={workspace.workSpaceId}
            className={cn(
              'flex items-center justify-between p-3 rounded-md hover:bg-[#333]',
              selectedWorkspaceId === workspace.workSpaceId ? 'bg-[#333]' : 'bg-[#252526]'
            )}
            onClick={() => handleSelectWorkspace(workspace.workSpaceId)}
          >
            <span className="text-sm">{workspace.workSpaceName}</span>
            <WorkspaceDeleteButton workspace={workspace} />
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500">워크스페이스가 없습니다.</div>
      )}
    </div>
  );
}