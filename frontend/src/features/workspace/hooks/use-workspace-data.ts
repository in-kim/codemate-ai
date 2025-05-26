import { deleteWorkspace, getJoinMyWorkspace, IWorkspace, leaveWorkspace } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { useLoadingStore } from "@/shared/store/loading-store";
import { useToastStore } from "@/shared/store/toast-store";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { User } from "@/shared/types/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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

/**
 * 워크스페이스 데이터 훅
 * @returns 워크스페이스 데이터
 */
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

  /**
   * 워크스페이스 목록 가져오기
   */
  const fetchWorkspaces = useCallback(async () => {
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
  }, [userId, addWorkspace, selectWorkspace, startLoading, stopLoading]);

  /**
   * 워크스페이스 삭제 핸들러
   * @param workspaceId 삭제할 워크스페이스 ID
   * @param workspaceName 삭제할 워크스페이스 이름
   */
  const handleDeleteWorkspace = useCallback(async (workspaceId: string, workspaceName: string) => {
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
  }, [fetchWorkspaces, startLoading, stopLoading, addToast]);

  /**
   * 워크스페이스 퇴장 핸들러
   * @param workspaceId 퇴장할 워크스페이스 ID
   * @param workspaceName 퇴장할 워크스페이스 이름
   */
  const handleLeaveWorkspace = useCallback(async (workspaceId: string, workspaceName: string) => {
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
  }, [fetchWorkspaces, startLoading, stopLoading, addToast, userInfo]);

  /**
   * 워크스페이스 선택 핸들러
   * @param workspaceId 선택된 워크스페이스 ID
   */
  const handleSelectWorkspace = useCallback((workspaceId: string) => {
    console.log('????? : ', workspaceId);
    selectWorkspace(workspaceId);
    router.push(`/workspace/${workspaceId}`);
  }, [selectWorkspace, router]);
  


  useEffect(() => {
    // 워크스페이스가 없으면 가져오기
    if (userId && workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [userId, fetchWorkspaces, workspaces]);

  useEffect(() => {
    console.log(selectedWorkspaceId);
  }, [selectedWorkspaceId]);

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