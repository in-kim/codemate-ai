import { useAuthStore } from "@/shared/store/auth-store";
import { checkAuth } from "./check-auth";

/**
 * 사용자 정보를 서버에서 가져와 스토어에 저장하는 함수
 * 새로고침 시 호출하여 사용자 인증 상태를 유지합니다.
 */
export async function refreshUserInfo() {
  try {
    const userData = await checkAuth();
    
    if (userData) {
      console.log('userData : ', userData);
      useAuthStore.getState().setUser({
        id: userData.userId || "",
        username: userData.username || "",
        avatarUrl: userData.avatarUrl || ""
      });
      return true;
    } else {
      useAuthStore.getState().clearUser();
      return false;
    }
  } catch (error) {
    console.error('사용자 정보 새로고침 실패:', error);
    return false;
  }
} 