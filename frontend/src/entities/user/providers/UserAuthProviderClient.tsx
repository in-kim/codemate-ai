"use client";

import { User } from "@/shared/types/user";
import { useState } from "react";
import { UserAuthContext } from "../context/UserAuthContext";

interface UserAuthProviderClientProps {
  children: React.ReactNode;
  initialUserInfo: User | null;
}

export default function UserAuthProviderClient({ 
  children, 
  initialUserInfo 
}: UserAuthProviderClientProps) {
  // 서버에서 받은 초기 사용자 정보로 상태 초기화
  const [userInfo, setUserInfo] = useState<User | null>(initialUserInfo);

  // Context 값 설정
  const contextValue = {
    userInfo,
    setUserInfo,
  };

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}
