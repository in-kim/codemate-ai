'use server';

import { getMyInfo } from "@/shared/lib/services/auth.service";
import { getJoinMyWorkspace, IWorkspace, joinWorkspace, verifyInviteToken } from "@/shared/lib/services/workspace.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { WorkspaceDataResult } from "@/shared/types/workspace";
import { IStatus } from "@/shared/types/common";

export async function getWorkspaceData(workspaceId: string, joinToken?: string): Promise<WorkspaceDataResult> {
  if (!workspaceId) {
    return { 
      status: IStatus.NOT_FOUND, 
      message: '워크스페이스 ID가 필요합니다.' 
    };
  }

  /**
   * 사용자가 참여한 워크스페이스 목록을 가져옵니다.
   * @param userId 사용자 ID
   * @returns 사용자가 참여한 워크스페이스 목록
   */
  const getWorkspaces = async (userId: string): Promise<IWorkspace[]> => {
    try {
      const responseWorkSpaceData = await getJoinMyWorkspace(userId);

      if (!isHttpResponseSuccess(responseWorkSpaceData)) {
        return [];
      }

      return responseWorkSpaceData.data;
    } catch(err) {
      console.error(err);
      throw new Error('워크스페이스 조회에 실패했습니다.');
    }
  }

  try {
    const userInfo = await getMyInfo();
    
    if (!isHttpResponseSuccess(userInfo)) {
      return { 
        status: IStatus.UNAUTHORIZED, 
        message: '사용자 인증에 실패했습니다.' 
      };
    }

    // workspace 초대받았을때 처리 (joinToken)
    if (joinToken) {
      const verifyToken = await verifyInviteToken(workspaceId, joinToken);

      if (!isHttpResponseSuccess(verifyToken)) {
        return { 
          status: IStatus.FORBIDDEN, 
          message: '초대 링크 검증에 실패했습니다.' 
        };
      }

      const joinWorkspaceResponse = await joinWorkspace(workspaceId, userInfo.data.userId);

      if (!isHttpResponseSuccess(joinWorkspaceResponse)) {
        return { 
          status: IStatus.FORBIDDEN, 
          message: '워크스페이스 참여에 실패했습니다.' 
        };
      }

      return {
        status: IStatus.SUCCESS,
        userInfo: userInfo.data,
        workspaces: await getWorkspaces(userInfo.data.userId),
        workspaceId: workspaceId,
        isRedirect: true
      }
    }
    // 워크스페이스 접근 권한 검증
    const workspaces = await getWorkspaces(userInfo.data.userId);
    const hasAccess = workspaces.some(ws => ws.workSpaceId === workspaceId);
    
    // 접근 권한이 없는 경우 워크스페이스 생성 페이지로 리다이렉트
    if (!hasAccess) {
      return { 
        status: IStatus.FORBIDDEN, 
        message: '해당 워크스페이스에 접근 권한이 없습니다.',
        userInfo: userInfo.data
      };
    }
    
    // 접근 권한이 없을경우 참여중인 워크스페이스[0] 로 접근
    return { 
      status: IStatus.SUCCESS, 
      userInfo: userInfo.data, 
      workspaces,
      workspaceId: workspaces[0].workSpaceId
    };
  } catch (err) {
    console.error(err);
    return { 
      status: IStatus.ERROR, 
      message: '데이터를 불러오는 중 오류가 발생했습니다.' 
    };
  }
}