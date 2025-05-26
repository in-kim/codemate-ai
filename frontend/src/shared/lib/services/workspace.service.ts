import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher'
import { useAuthStore } from '@/shared/store/auth-store';
import { User } from '@/shared/types/user';
import { handleApiError } from '../utils/utils';

export interface ICreateWorkspaceResponse {
  workSpaceId: string;
  workSpaceName: string;
  createdAt: Date;
}

export interface IJoinWorkspaceResponse {
  workSpaceId: string;
  participants: User[];
}

export interface IWorkspace {
  workSpaceId: string;
  workSpaceName: string | undefined;
  createdAt: Date;
  participants: User[];
  owner: string;
}

export interface ILeaveWorkspaceResponse {
  workSpaceId: string;
  participants: User[];
}

export interface IDeleteWorkspaceResponse {
  workSpaceId: string;
}

export interface IInviteLinkResponse {
  url: string;
}

export interface IVerifyInviteTokenResponse {
  workSpaceId: string;
  invitedBy: string;
}

/** 
 * 새로운 워크스페이스를 생성합니다.
 * @param workSpaceName 워크스페이스 이름
 * @returns 생성된 워크스페이스 정보
*/
export async function createdWorkspace(workSpaceName: string, userId: string): Promise<HttpResponse<ICreateWorkspaceResponse> | unknown> {
    const payload = {
      workSpaceName,
      userId,
    }
    try {
      const response = await fetcher('/api/workspace', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
  
      return response as HttpResponse<ICreateWorkspaceResponse>;
    } catch(err){
      handleApiError(err, '워크스페이스 생성 실패')
    }
}

/**
 * 사용자가 참여한 워크스페이스 목록을 가져옵니다.
 * @returns 사용자가 참여한 워크스페이스 목록
*/
export async function getJoinMyWorkspace(userId: string): Promise<HttpResponse<IWorkspace[]>> {
    try {
      const response = await fetcher(`/api/workspace/my/${userId}`, {
        method: 'GET',
      });

      return response as HttpResponse<IWorkspace[]>;
    } catch (err: unknown) {
      handleApiError(err, '워크스페이스 조회 실패')
    }
}

/**
 * 워크스페이스에 참여합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 참여한 워크스페이스 정보
*/
export async function joinWorkspace(workSpaceId: string, userId: string): Promise<HttpResponse<IJoinWorkspaceResponse> | null> {
  try {
    if (!workSpaceId || !userId) {
      throw new Error('워크스페이스 ID와 사용자 ID가 필요합니다.');
    }

    const payload = {
      userId: userId,
    }
    console.log('joinWorkspace : ', payload, workSpaceId)
    const response = await fetcher(`/api/workspace/${workSpaceId}/join`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response as HttpResponse<IJoinWorkspaceResponse>;
  } catch (err) {
    handleApiError(err, '워크스페이스 참여 실패')
  }
}

/**
 * 워크스페이스에서 퇴장합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 퇴장한 워크스페이스 정보
*/
export async function leaveWorkspace(workSpaceId: string, userId: string): Promise<HttpResponse<ILeaveWorkspaceResponse> | null> {
  try {
    const payload = {
      userId: userId,
    }
    const response = await fetcher(`/api/workspace/${workSpaceId}/leave`, {
      method: 'DELETE',
      body: JSON.stringify(payload),
    });

    return response as HttpResponse<ILeaveWorkspaceResponse>;
  } catch (err) {
    handleApiError(err, '워크스페이스 탈퇴 실패')
  }
}

/**
 * 워크스페이스를 삭제합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 삭제된 워크스페이스 정보
*/
export async function deleteWorkspace(workSpaceId: string): Promise<HttpResponse<IDeleteWorkspaceResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/${workSpaceId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        userId: useAuthStore.getState().userInfo?.userId,
      }),
    });

    return response as HttpResponse<IDeleteWorkspaceResponse>;
  } catch (err) {
    handleApiError(err, '워크스페이스 삭제 실패')
  }
}

/**
 * 워크스페이스 초대 링크를 생성합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 생성된 초대 링크
*/
export async function makeInviteLink(workSpaceId: string): Promise<HttpResponse<IInviteLinkResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/${workSpaceId}/create-invite-link`, {
      method: 'POST',
    });

    return response as HttpResponse<IInviteLinkResponse>;
  } catch (err) {
    handleApiError(err, '초대 링크 생성 실패')
  }
}

/**
 * 초대 링크를 검증합니다.
 * @param token 초대 링크 토큰
 * @returns 초대 링크 토큰이 포함하는 정보 (방 ID, 초대한 사람의 ID)
*/
export async function verifyInviteToken(workspaceId: string, token: string): Promise<HttpResponse<IVerifyInviteTokenResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/${workspaceId}/invite-token?token=${token}`, {
      method: 'GET',
    });

    return response as HttpResponse<IVerifyInviteTokenResponse>;
  } catch (err) {
    handleApiError(err, '초대 링크 검증 실패')
  }
}