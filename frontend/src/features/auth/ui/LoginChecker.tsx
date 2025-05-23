"use client";
import { JSX, memo, useEffect } from "react";
import { useAuthStore } from "@/shared/store/auth-store";
import LoginModal from "../LoginModal";
import { User } from "@/shared/types/user";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { getMyInfo } from "@/shared/lib/services/auth.service";
import { useShallow } from "zustand/shallow";

function LoginCheckerComponent(): JSX.Element | null {
  // 최적화된 상태 접근 - userInfo만 가져와서 사용
  const { userInfo, setUser } = useAuthStore(useShallow((state) => ({
    userInfo: state.userInfo,
    setUser: state.setUser
  })));

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getMyInfo();
      if(isHttpResponseSuccess(response)) {
        setUser(response.data as User);
      }
    };
    getUserInfo();
  }, [setUser]);
  
  // 로그인되지 않은 상태: 모달 표시
  return userInfo ? null : <LoginModal />;
}

const MemoizedLoginChecker = memo(LoginCheckerComponent);

// 내보내기 기본 컴포넌트
export default function LoginChecker(): JSX.Element | null {
  return <MemoizedLoginChecker />;
}
