'use client';

import { refreshUserInfo } from "@/shared/lib/utils/user-refresh";
import { useEffect } from "react";

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export default function UserAuthProvider({ children }: UserAuthProviderProps) {
  useEffect(() => {
    // 페이지 로드 시 사용자 정보 새로고침
    refreshUserInfo();
  }, []);

  return <>{children}</>;
} 