import { IconButton } from "@/shared/ui/iconButon/iconButton";
import { useModalStore } from "@/shared/store/modal-store";
import { useShallow } from "zustand/shallow";
import { WorkspaceList } from "@/features/workspace/ui/workspace-list";
export default function WorkspaceWrapper() {
  const { openCreateWorkspaceModal } = useModalStore(
    useShallow((state) => ({ openCreateWorkspaceModal: state.openCreateWorkspaceModal }))
  );

  return (
    <div className="flex-6">
      <div className="flex items-center justify-between py-2 px-3 bg-[#454545] font-bold text-sm">
        <span>방 관리</span>
        <IconButton onClick={openCreateWorkspaceModal} icon="folder-plus"/>
      </div>
      <WorkspaceList />
    </div>
  )
}