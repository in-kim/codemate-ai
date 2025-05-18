"use client";
import { JSX } from "react";
import LoginModal from "../LoginModal";
import { useUserAuth } from "@/entities/user/context/UserAuthContext";

export default function LoginChecker(): JSX.Element | null {
  const { userInfo } = useUserAuth();

  return !userInfo ? (<LoginModal />) : null;
}
