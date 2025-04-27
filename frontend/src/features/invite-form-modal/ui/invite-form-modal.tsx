import { useCollaboratorStore } from "@/shared/store/collaborator-store";
import { useModalStore } from "@/shared/store/modal-store";
import { useToastStore } from "@/shared/store/toast-store";
import { InviteForm } from "@/shared/ui/invite-form";
import { Modal } from "@/shared/ui/modal";
import { useShallow } from "zustand/react/shallow";

export function InviteFormModal() {
  const { isInviteModalOpen, closeInviteModal } = useModalStore(
    useShallow((state) => ({ isInviteModalOpen: state.isInviteModalOpen, closeInviteModal: state.closeInviteModal }))
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
    closeInviteModal()
  };

  return (
    <Modal isOpen={isInviteModalOpen} onClose={closeInviteModal}>
      <InviteForm onInvite={handleInviteUser} onCancel={closeInviteModal} />
    </Modal>
  )
}