'use client';
import { CreateWorkspaceModal } from "@/features/workspace/ui/create-workspace-modal";
import { useModalStore } from "@/shared/store/modal-store";
import { useEffect } from "react";
import { getJoinMyWorkspace, getJoinMyWorkspaceResponse } from "@/shared/lib/services/workspace.service";
import { useToastStore } from "@/shared/store/toast-store";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/auth-store";
import { isHttpResponseSuccess } from "@/shared/lib/utils";

export default function OnboardingPage() {
  const { openCreateWorkspaceModal } = useModalStore();
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );
  const { userInfo } = useAuthStore(
    useShallow((state) => ({ userInfo: state.userInfo }))
  );
  const router = useRouter();

  const callbackSubmit = (workspaceInfo: getJoinMyWorkspaceResponse) => {
    router.push(`/workspace/${workspaceInfo.workSpaceId}`)
  }

  const callbackCloseModal = () => {
    addToast("워크스페이스를 생성해주세요.", "default")
  }

  useEffect(() => {
    if (!userInfo) {
      openCreateWorkspaceModal();
      return;
    }
    
    const fetchWorkspace = async () => {
      const workspace = await getJoinMyWorkspace(userInfo.userId);
      
      if(!workspace || !isHttpResponseSuccess(workspace) || workspace.data.length === 0) {
        openCreateWorkspaceModal();
        return;
      }

      const workspaceList = workspace.data as getJoinMyWorkspaceResponse[];
      router.push(`/workspace/${workspaceList[0].workSpaceId}`);
    };
    
    fetchWorkspace();
  }, [openCreateWorkspaceModal, router, userInfo]);
  

  return <CreateWorkspaceModal callbackCloseModal={callbackCloseModal} callbackSubmit={callbackSubmit} />;
}