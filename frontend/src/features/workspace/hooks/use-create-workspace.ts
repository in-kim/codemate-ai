import { useModalStore } from "@/shared/store/modal-store";
import { useToastStore } from "@/shared/store/toast-store";
import { useShallow } from "zustand/react/shallow";
import { createdWorkspace, getJoinMyWorkspaceResponse } from "@/shared/lib/services/workspace.service";
import useWorkspaceData from "./use-workspace-data";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { useLoadingStore } from "@/shared/store/loading-store";

export interface CreateWorkspaceModalProps {
  callbackSubmit?: (workspaceInfo: getJoinMyWorkspaceResponse) => void;
  callbackCloseModal?: () => void;
}

export function useCreateWorkspace({ callbackSubmit, callbackCloseModal }: CreateWorkspaceModalProps) {
  const { isCreateWorkspaceModalOpen, closeCreateWorkspaceModal } = useModalStore(
    useShallow((state) => ({ 
      isCreateWorkspaceModalOpen: state.isCreateWorkspaceModalOpen, 
      closeCreateWorkspaceModal: state.closeCreateWorkspaceModal 
    }))
  );
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );

  const { userInfo } = useAuthStore(
    useShallow((state) => ({ userInfo: state.userInfo }))
  );
  const { refetch: refetchWorkspaceData } = useWorkspaceData();

  const { startLoading, stopLoading } = useLoadingStore(
    useShallow((state) => ({ startLoading: state.startLoading, stopLoading: state.stopLoading }))
  );

  const handleCreateWorkspace = async (workspaceName: string) => {
    // 여기에 방 생성 로직 추가
    try {
      startLoading();
      const response = await createdWorkspace(workspaceName, userInfo?.userId || '');

      if(isHttpResponseSuccess(response)) {
        addToast(`'${workspaceName}' 워크스페이스가 생성되었습니다!`, 'success');
        refetchWorkspaceData(); // 재조회
        if(callbackSubmit) callbackSubmit(response.data as getJoinMyWorkspaceResponse);
      }
    } catch (err) {
      console.error('워크스페이스 생성 실패:', err);
      addToast('워크스페이스 생성에 실패했습니다.', 'error');
    } finally {
      stopLoading();
      closeCreateWorkspaceModal();
    }
  };

  const handleModalClose = () => {
    if (callbackCloseModal) callbackCloseModal();
    else closeCreateWorkspaceModal();
  };

  return {
    isOpen: isCreateWorkspaceModalOpen,
    onClose: handleModalClose,
    onSubmit: handleCreateWorkspace,
    title: '워크스페이스 생성',
    submitButtonText: '생성',
    placeholder: '워크스페이스 이름을 입력하세요'
  };
}
