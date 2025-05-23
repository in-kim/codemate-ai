import { getMyInfo } from "@/shared/lib/services/auth.service";
import Client from "./client";
import { getJoinMyWorkspace, getJoinMyWorkspaceResponse } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { redirect } from "next/navigation";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  }
}
export default async function WorkspacePage({ params }: WorkspacePageProps) {
  // 파라미터를 함수 시작 부분에서 추출
  const workspaceId = params.workspaceId;

  if (!workspaceId) redirect('/onboarding')

  const userInfo = await getMyInfo();
  
  let workspaces:getJoinMyWorkspaceResponse[] = [];
  
  if(isHttpResponseSuccess(userInfo) && workspaceId) {
    const responseWorkSpaceData = await getJoinMyWorkspace(userInfo.data.userId);
    if(isHttpResponseSuccess(responseWorkSpaceData)) {
      workspaces = responseWorkSpaceData.data as getJoinMyWorkspaceResponse[];
    }
  }

  return (<Client workspaces={workspaces} selectedWorkspaceId={workspaceId} userInfo={userInfo?.data || null} />);
}
