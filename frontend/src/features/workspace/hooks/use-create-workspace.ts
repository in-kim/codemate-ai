import { useModalStore } from "@/shared/store/modal-store";
import { useToastStore } from "@/shared/store/toast-store";
import { useShallow } from "zustand/react/shallow";
import { createdWorkspace } from "@/shared/lib/services/workspace.service";

export function useCreateWorkspace() {
  const { isCreateWorkspaceModalOpen, closeCreateWorkspaceModal } = useModalStore(
    useShallow((state) => ({ 
      isCreateWorkspaceModalOpen: state.isCreateWorkspaceModalOpen, 
      closeCreateWorkspaceModal: state.closeCreateWorkspaceModal 
    }))
  );
  
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );
  
  const handleCreateWorkspace = (workspaceName: string) => {
    // 여기에 방 생성 로직 추가
    try {
      const response = createdWorkspace(workspaceName);

      if (!response) {
        throw new Error(response);
      }

      addToast(`'${workspaceName}' 워크스페이스가 생성되었습니다!`, 'success');
      closeCreateWorkspaceModal();
    } catch (err) {
      console.error('워크스페이스 생성 실패:', err);
      addToast('워크스페이스 생성에 실패했습니다.', 'error');
      return;
    }
  };

  return {
    isOpen: isCreateWorkspaceModalOpen,
    onClose: closeCreateWorkspaceModal,
    onSubmit: handleCreateWorkspace,
    title: '워크스페이스 생성',
    submitButtonText: '생성',
    placeholder: '워크스페이스 이름을 입력하세요'
  };
}
