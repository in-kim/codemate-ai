import { useCollaboratorStore } from "@/shared/store/collaborator-store";
import { useModalStore } from "@/shared/store/modal-store";
import { CollaboratorList } from "../../../features/collaboration/ui/collaborator-list";
import { IconButton } from "@/shared/ui/iconButon/iconButton";
import { useShallow } from "zustand/shallow";

export function CollaborationWrapper() {
  const { collaborators } = useCollaboratorStore(
    useShallow((state) => ({ collaborators: state.collaborators }))
  );
  const { openInviteModal } = useModalStore(
    useShallow((state) => ({ openInviteModal: state.openInviteModal}))
  );
  return (
    <div className="flex-6">
      <div className="flex items-center justify-between py-2 px-3 bg-[#454545] font-bold text-sm">
        <span>협업자 관리</span>
        <IconButton onClick={openInviteModal} icon="user-plus"/>
      </div>
      <CollaboratorList
        collaborators={collaborators}
      />
    </div>
  )
}