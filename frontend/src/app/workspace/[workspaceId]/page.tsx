// /app/workspace/[workspaceId]/page.tsx
import Client from "./client";
import { getWorkspaceData } from "./actions";
import { redirect } from "next/navigation";
import { IStatus } from "@/shared/types/common";
import { getCookie, setCookie } from "@/shared/lib/utils/utils";

interface WorkspacePageProps {
  params: {
    workspaceId: string;
  }
  searchParams: {
    [key: string]: string | undefined
  }
}

export default async function WorkspacePage({ params, searchParams }: WorkspacePageProps) {
  const { workspaceId } = await params;
  const { token } = await searchParams;
  // 쿠키 설정
  if (workspaceId) setCookie('workspaceId', workspaceId);
  if (token) setCookie('joinToken', token);
  
  const result = await getWorkspaceData(getCookie('workspaceId') || workspaceId, getCookie('joinToken') || token);

  // 에러 처리
  switch (result.status) {
    case IStatus.NOT_FOUND:
    case IStatus.UNAUTHORIZED:
    case IStatus.FORBIDDEN:
      redirect('/onboarding');
      break;
    case IStatus.ERROR:
      throw new Error(result.message || '오류가 발생했습니다.');
  }

  return (
    <Client 
      workspaces={result.workspaces || []} 
      selectedWorkspaceId={result.workspaceId as string} 
      userInfo={result.userInfo || null} 
      isRedirect={result.isRedirect}
    />
  );
}