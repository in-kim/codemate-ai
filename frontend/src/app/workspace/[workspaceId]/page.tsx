// /app/workspace/[workspaceId]/page.tsx
import Client from "./client";
import { getWorkspaceData } from "./actions";
import { redirect } from "next/navigation";
import { IStatus } from "@/shared/types/common";
import { getCookie, setCookie } from "@/shared/lib/utils/utils";

interface IWorkspacePageProps {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WorkspacePage({
  params,
  searchParams,
}: IWorkspacePageProps): Promise<React.ReactNode> {
  // params와 searchParams 모두 Promise이므로 await로 값을 가져옴
  const { workspaceId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token as string | undefined;
  // 쿠키 설정 - 토큰만 저장하고 워크스페이스 ID는 URL에서 직접 사용
  if (token) setCookie('joinToken', token);
  
  // URL의 워크스페이스 ID를 우선적으로 사용
  const result = await getWorkspaceData(workspaceId, getCookie('joinToken') || token);

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