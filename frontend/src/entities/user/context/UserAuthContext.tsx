"use client";

import { User } from "@/shared/types/user";
import { createContext, useContext } from "react";

// 사용자 인증 정보를 위한 Context 생성
export const UserAuthContext = createContext<{
  userInfo: User | null;
  setUserInfo?: (user: User | null) => void;
}>({ userInfo: null });

// Context를 사용하기 위한 훅
export const useUserAuth = () => useContext(UserAuthContext);
