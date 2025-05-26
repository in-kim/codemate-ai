'use client';
import { CreateWorkspaceModal } from "@/features/workspace/ui/create-workspace-modal";
import { useModalStore } from "@/shared/store/modal-store";
import { useEffect } from "react";
import { IWorkspace } from "@/shared/lib/services/workspace.service";
import { useToastStore } from "@/shared/store/toast-store";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import { HttpResponse } from "@/shared/types/response";
import { User } from "@/shared/types/user";

interface OnboardingClientProps {
  userInfo: HttpResponse<User> | Error;
}

export default function OnboardingClient({ userInfo }: OnboardingClientProps) {
  const { openCreateWorkspaceModal, closeCreateWorkspaceModal } = useModalStore();
  const { addToast } = useToastStore(
    useShallow((state) => ({ addToast: state.addToast }))
  );
  const router = useRouter();

  const callbackSubmit = (workspaceInfo: IWorkspace) => {
    router.push(`/workspace/${workspaceInfo.workSpaceId}`)
  }

  const callbackCloseModal = () => {
    addToast("워크스페이스를 생성해주세요.", "default")
  }

  useEffect(() => {
    console.log('userInfo :', userInfo);
    if (userInfo) {
      openCreateWorkspaceModal();
      return;
    }

    return (() => {
      closeCreateWorkspaceModal();
    })
  }, [router, userInfo]);
  

  return <CreateWorkspaceModal callbackCloseModal={callbackCloseModal} callbackSubmit={callbackSubmit} />;
}