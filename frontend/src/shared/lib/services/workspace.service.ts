import { HttpResponse } from '@/shared/types/response';
import { fetcher } from '../fetcher'
import { useAuthStore } from '@/shared/store/auth-store';

export interface CreateWorkspaceResponse {
  workSpaceId: string;
  workSpaceName: string;
  createdAt: Date;
}

export interface JoinWorkspaceResponse {
  workSpaceId: string;
  participants: string[];
}

export interface getJoinMyWorkspaceResponse {
  workSpaceId: string;
  workSpaceName: string | undefined;
  createdAt: Date;
  participants: string[];
  owner: string;
}

export interface LeaveWorkspaceResponse {
  workSpaceId: string;
  participants: string[];
}

export interface DeleteWorkspaceResponse {
  workSpaceId: string;
}

export interface InviteLinkResponse {
  url: string;
}

export interface InviteTokenResponse {
  workSpaceId: string;
  invitedBy: string;
}

/** 
 * 새로운 워크스페이스를 생성합니다.
 * @param workSpaceName 워크스페이스 이름
 * @returns 생성된 워크스페이스 정보
*/
export async function createdWorkspace(workSpaceName: string, userId: string): Promise<HttpResponse<CreateWorkspaceResponse> | unknown> {
    const payload = {
      workSpaceName,
      userId,
    }
    const response = await fetcher('/api/workspace', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response as HttpResponse<CreateWorkspaceResponse>;
}

/**
 * 사용자가 참여한 워크스페이스 목록을 가져옵니다.
 * @returns 사용자가 참여한 워크스페이스 목록
*/
export async function getJoinMyWorkspace(userId: string): Promise<HttpResponse<getJoinMyWorkspaceResponse[]> | null> {
    try {
      const response = await fetcher(`/api/workspace/my/${userId}`, {
        method: 'GET',
      });

      return response as HttpResponse<getJoinMyWorkspaceResponse[]>;
    } catch (err) {
      console.error('워크스페이스 조회 실패:', err);
      return null;
    }
}

/**
 * 워크스페이스에 참여합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 참여한 워크스페이스 정보
*/
export async function joinWorkspace(workSpaceId: string): Promise<HttpResponse<JoinWorkspaceResponse> | null> {
  try {
    const payload = {
      userId: useAuthStore.getState().userInfo,
    }
    const response = await fetcher(`/${workSpaceId}/join`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response as HttpResponse<JoinWorkspaceResponse>;
  } catch (err) {
    console.error('워크스페이스 참여 실패:', err);
    return null;
  }
}

/**
 * 워크스페이스에서 퇴장합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 퇴장한 워크스페이스 정보
*/
export async function leaveWorkspace(workSpaceId: string): Promise<HttpResponse<LeaveWorkspaceResponse> | null> {
  try {
    const payload = {
      userId: useAuthStore.getState().userInfo,
    }
    const response = await fetcher(`/api/workspace/${workSpaceId}/leave`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return response as HttpResponse<LeaveWorkspaceResponse>;
  } catch (err) {
    console.error('워크스페이스 탈퇴 실패:', err);
    return null;
  }
}

/**
 * 워크스페이스를 삭제합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 삭제된 워크스페이스 정보
*/
export async function deleteWorkspace(workSpaceId: string): Promise<HttpResponse<DeleteWorkspaceResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/${workSpaceId}`, {
      method: 'DELETE',
      body: JSON.stringify({
        userId: useAuthStore.getState().userInfo?.userId,
      }),
    });

    return response as HttpResponse<DeleteWorkspaceResponse>;
  } catch (err) {
    console.error('워크스페이스 삭제 실패:', err);
    return null;
  }
}

/**
 * 워크스페이스 초대 링크를 생성합니다.
 * @param workSpaceId 워크스페이스 ID
 * @returns 생성된 초대 링크
*/
export async function makeInviteLink(workSpaceId: string): Promise<HttpResponse<InviteLinkResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/${workSpaceId}/create-invite-link`, {
      method: 'POST',
    });

    return response as HttpResponse<InviteLinkResponse>;
  } catch (err) {
    console.error('초대 링크 생성 실패:', err);
    return null;
  }
}

/**
 * 초대 링크를 검증합니다.
 * @param token 초대 링크 토큰
 * @returns 초대 링크 토큰이 포함하는 정보 (방 ID, 초대한 사람의 ID)
*/
export async function inviteToken(token: string): Promise<HttpResponse<InviteTokenResponse> | null> {
  try {
    const response = await fetcher(`/api/workspace/invite-token?token=${token}`, {
      method: 'GET',
    });

    return response as HttpResponse<InviteTokenResponse>;
  } catch (err) {
    console.error('초대 링크 검증 실패:', err);
    return null;
  }
}