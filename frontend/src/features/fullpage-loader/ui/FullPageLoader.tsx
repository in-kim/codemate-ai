'use client';
import { Loading } from "@/shared/ui/loading";
import useFullpageLoader from "../hook/useFullpageLoader";
import { JSX } from "react";

export default function FullPageLoader(): JSX.Element | null {
  const isLoading = useFullpageLoader();
  return isLoading ? <Loading /> : null;
}