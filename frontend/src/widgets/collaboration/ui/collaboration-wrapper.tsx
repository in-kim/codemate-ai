import { CollaboratorList } from "../../../features/collaboration/ui/collaborator-list";
import { IconButton } from "@/shared/ui/iconButon/iconButton";
import { useShallow } from "zustand/shallow";
import { useWorkspaceStore } from "@/shared/store/workspace-store";
import { makeInviteLink } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useState } from "react";
import { AlertModal } from "@/shared/ui/alert-modal";

export function CollaborationWrapper() {
  const { selectedWorkspaceId, getParticipants } = useWorkspaceStore(
    useShallow((state) => ({
      selectedWorkspaceId: state.selectedWorkspaceId,
      getParticipants: state.getParticipants,
    }))
  )
  
  // 알림 모달 상태 관리
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  
  const getInviteUrl = async () => {
    try {
      const response = await makeInviteLink(selectedWorkspaceId!);
      if (isHttpResponseSuccess(response)) {
        // 초대 링크를 클립보드에 복사
        await navigator.clipboard.writeText(response.data.url);
        // 초대 링크를 상태에 저장하고 모달 열기
        setInviteUrl(response.data.url);
        setIsAlertOpen(true);
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
      
      {/* 초대 링크 알림 모달 */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="초대 링크 생성 완료"
        message={`아래 초대 링크는 1시간 동안만 유효합니다.\n 링크를 받은 사람은 로그인 후 자동 입장되며, \n 이 워크스페이스에서 실시간 협업이 가능합니다.`}
        confirmText="확인"
        copyableText={inviteUrl}
      />
    </div>
  )
}