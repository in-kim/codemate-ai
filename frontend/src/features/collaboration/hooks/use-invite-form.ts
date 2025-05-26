import { useCollaboratorStore } from "@/shared/store/collaborator-store";
import { useModalStore } from "@/shared/store/modal-store";
import { useToastStore } from "@/shared/store/toast-store";
import { useShallow } from "zustand/react/shallow";

export function useInviteForm() {
  const { isInviteModalOpen, closeInviteModal } = useModalStore(
    useShallow((state) => ({ 
      isInviteModalOpen: state.isInviteModalOpen, 
      closeInviteModal: state.closeInviteModal 
    }))
  );
  
  const { addCollaborator } = useCollaboratorStore(
    useShallow((state) => ({ addCollaborator: state.addCollaborator }))
  );
  
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );
  
  const handleInviteUser = (userName: string) => {
    addCollaborator(userName);
    addToast(`'${userName}' 님을 초대했습니다!`, 'success');
    closeInviteModal();
  };

  return {
    isOpen: isInviteModalOpen,
    onClose: closeInviteModal,
    onSubmit: handleInviteUser,
    title: '초대하기',
    submitButtonText: '초대',
    placeholder: '사용자 이름을 입력하세요'
  };
}
