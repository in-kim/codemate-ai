import OnboardingClient from "./client";
import { getJoinMyWorkspace, IWorkspace } from "@/shared/lib/services/workspace.service";
import { getMyInfo } from "@/shared/lib/services/auth.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { redirect } from "next/navigation";

export default async function OnboardingPage(): Promise<React.ReactNode> {
  const userInfo = await getMyInfo();
  let workspace = null;

  if(isHttpResponseSuccess(userInfo)) {
    workspace = await getJoinMyWorkspace(userInfo.data.userId);
  }

  if(isHttpResponseSuccess(workspace)) {
    const workspaceList = workspace.data as IWorkspace[];
    if(workspaceList.length > 0) {
      redirect(`/workspace/${workspaceList[0].workSpaceId}`)
    }
  }
  return <OnboardingClient userInfo={userInfo} />
}