import { CollaboratorList } from "../../../features/collaboration/ui/collaborator-list";
import { IconButton } from "@/shared/ui/iconButon/iconButton";
import { useShallow } from "zustand/shallow";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { makeInviteLink } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useToastStore } from "@/shared/store/toast-store";

export function CollaborationWrapper() {
  const { selectedWorkspaceId, getParticipants } = useWorkspaceStore(
    useShallow((state) => ({
      selectedWorkspaceId: state.selectedWorkspaceId,
      getParticipants: state.getParticipants,
    }))
  )
  const { addToast } = useToastStore(
    useShallow((state) => ({
      addToast: state.addToast,
    }))
  )
  const getInviteUrl = async () => {
    try {
      const response = await makeInviteLink(selectedWorkspaceId!);
      if (isHttpResponseSuccess(response)) {
        await navigator.clipboard.writeText(response.data.url);
        addToast('초대 링크가 복사되었습니다.', 'success');
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <div className="flex-6">
      <div className="flex items-center justify-between py-2 px-3 bg-[#454545] font-bold text-sm">
        <span>협업자 관리</span>
        <IconButton onClick={getInviteUrl} icon="user-plus"/>
      </div>
      <CollaboratorList
        collaborators={getParticipants()}
      />
    </div>
  )
}