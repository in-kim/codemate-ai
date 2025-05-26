'use client';
import useAuthInitializer from "@/features/auth/hooks/useAuthInitializer";
import LoginModal from "@/features/auth/ui/LoginModal";
import { JSX } from "react";

export default function LoginChecker(): JSX.Element | null {
  const {userInfo, isAuthChecking} = useAuthInitializer();
  
  // 인증 확인 중일 때는 아무것도 표시하지 않음
  if (isAuthChecking) {
    return null;
  }
  
  // 로그인되지 않은 상태일 때만 모달 표시
  return userInfo ? null : <LoginModal />;
}