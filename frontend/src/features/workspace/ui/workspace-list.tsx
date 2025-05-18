import { cn } from '@/shared/lib/utils';
import useWorkspaceData from '../hooks/use-workspace-data';
import { useUserAuth } from '@/entities/user/context/UserAuthContext';

export interface Workspace {
  id: string;
  name: string;
}

export interface WorkspaceListProps {
  workspaces: Workspace[];
}

export function WorkspaceList() {
  const { userInfo } = useUserAuth();
  const { workspaces } = useWorkspaceData(userInfo?.userId || '');
  
  return (
    <div className="flex flex-col space-y-2 py-2 px-3">
      {workspaces.length > 0 ? (
        workspaces.map((workspace) => (
          <div
            key={workspace.roomId}
            className={cn(
              'flex items-center justify-between p-3 rounded-md bg-[#252526] hover:bg-[#333]',
            )}
          >
            <span className="text-sm">{workspace.roomName}</span>
          </div>
        ))
      ) : (
        <div className="text-sm text-gray-500">워크스페이스가 없습니다.</div>
      )}
    </div>
  );
}