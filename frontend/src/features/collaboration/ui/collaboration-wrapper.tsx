import { useCollaboratorStore } from "@/shared/store/collaborator-store";
import { useModalStore } from "@/shared/store/modal-store";
import { CollaboratorList } from "@/shared/ui/collaborator-list";
import { useShallow } from "zustand/shallow";

export function CollaborationWrapper() {
  const { collaborators } = useCollaboratorStore(
    useShallow((state) => ({ collaborators: state.collaborators }))
  );
  const { openInviteModal } = useModalStore(
    useShallow((state) => ({ openInviteModal: state.openInviteModal }))
  );
  const handleInviteClick = () => openInviteModal();
  return (
    <CollaboratorList
      collaborators={collaborators}
      onInviteClick={handleInviteClick}
    />
  )
}