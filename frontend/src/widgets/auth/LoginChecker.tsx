'use client';
import useAuthInitializer from "@/features/auth/hooks/useAuthInitializer";
import LoginModal from "@/features/auth/ui/LoginModal";
import { useAuthStore } from "@/shared/store/auth-store";
import { JSX } from "react";
import { useShallow } from "zustand/shallow";

export default function LoginChecker(): JSX.Element | null {
  const userInfo = useAuthStore(useShallow(state => state.userInfo));
  useAuthInitializer();
    
  // 로그인되지 않은 상태: 모달 표시
  return userInfo ? null : <LoginModal />;
}