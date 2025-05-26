import { deleteWorkspace, getJoinMyWorkspace, IWorkspace, leaveWorkspace } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { useLoadingStore } from "@/shared/store/loading-store";
import { useToastStore } from "@/shared/store/toast-store";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { User } from "@/shared/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface UseWorkspaceDataReturn {
  workspaces: IWorkspace[];
  selectedWorkspaceId: string | null;
  handleSelectWorkspace: (workspaceId: string) => void;
  error: Error | null;
  refetch: () => Promise<void>;
  handleDeleteWorkspace: (workspaceId: string, workspaceName: string) => Promise<void>;
  handleLeaveWorkspace: (workspaceId: string, workspaceName: string) => Promise<void>;
  isLoading: boolean;
  userInfo: User | null;
}

export default function useWorkspaceData(): UseWorkspaceDataReturn {
  const { workspaces, addWorkspace, selectedWorkspaceId, selectWorkspace } = useWorkspaceStore(
    useShallow((state) => ({
      workspaces: state.workspaces,
      addWorkspace: state.addWorkspace,
      selectedWorkspaceId: state.selectedWorkspaceId,
      selectWorkspace: state.selectWorkspace,
    }))
  );
  const { userInfo } = useAuthStore(
    useShallow((state) => ({
      userInfo: state.userInfo
    }))
  )
  const [error, setError] = useState<Error | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoadingStore(
    useShallow((state) => ({ isLoading: state.isLoading, startLoading: state.startLoading, stopLoading: state.stopLoading }))
  );
  const { addToast } = useToastStore(
    useShallow((state) => ({
      addToast: state.addToast
    }))
  );

  const router = useRouter();

  const userId = userInfo?.userId;

  const fetchWorkspaces = async () => {
    setError(null);
    startLoading();
    
    try {
      const response = await getJoinMyWorkspace(userId as string);
      
      if (isHttpResponseSuccess(response)) {
        addWorkspace(response.data as IWorkspace[]);
        selectWorkspace(response.data[0].workSpaceId);
      } else {
        throw new Error(typeof response === 'string' ? response : '응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
    } finally {
      stopLoading();
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string, workspaceName: string) => {
    try {
      startLoading();
      const response = await deleteWorkspace(workspaceId);

      if(isHttpResponseSuccess(response)) {
        addToast(`'${workspaceName}' 워크스페이스가 삭제되었습니다!`, 'success');
        fetchWorkspaces();
        return;
      }
      if (response !== null) addToast((response as Error).message, 'error');
    } catch(err) {
      console.error(err);
    } finally {
      stopLoading();
    }
  }

  const handleLeaveWorkspace = async (workspaceId: string, workspaceName: string) => {
    try {
      startLoading();
      const response = await leaveWorkspace(workspaceId, userInfo?.userId as string);

      if(isHttpResponseSuccess(response)) {
        addToast(`'${workspaceName}' 워크스페이스에서 퇴장하였습니다!`, 'success');
        fetchWorkspaces();
        return;
      }
      if (response !== null) addToast((response as Error).message, 'error');
    } catch(err) {
      console.error(err);
    } finally {
      stopLoading();
    }
  }

  const handleSelectWorkspace = (workspaceId: string) => {
    selectWorkspace(workspaceId);
    router.replace(`/workspace/${workspaceId}`);
  }



  useEffect(() => {
    if (userId) {
      fetchWorkspaces();
    }
  }, [userId]);

  return {
    workspaces,
    selectedWorkspaceId,
    handleSelectWorkspace,
    error,
    refetch: fetchWorkspaces,
    handleDeleteWorkspace,
    handleLeaveWorkspace,
    isLoading,
    userInfo
  };
}