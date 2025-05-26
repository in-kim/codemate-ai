import { getMyInfo } from "@/shared/lib/services/auth.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { useLoadingStore } from "@/shared/store/loading-store";
import { User } from "@/shared/types/user";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

interface IuseAuthInitializer {
  userInfo: User | null;
  isAuthChecking: boolean;
}

export default function useAuthInitializer(): IuseAuthInitializer {
  const setUser = useAuthStore(
    useShallow((state) => state.setUser)
  );
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const { startLoading, stopLoading } = useLoadingStore(
    useShallow((state) => ({
      startLoading: state.startLoading,
      stopLoading: state.stopLoading
    }))
  );

  useEffect(() => {
    const getUserInfo = async () => {
      setIsAuthChecking(true);
      startLoading();
      try{
        const response = await getMyInfo();
        if(isHttpResponseSuccess(response)) {
          setUser(response.data as User);
          setUserInfo(response.data as User);
        }
      } catch(err) {
        console.error(err);
      } finally {
        setIsAuthChecking(false);
        stopLoading();
      }
    };
    getUserInfo();
  }, [setUser, startLoading, stopLoading]);

  return {
    userInfo,
    isAuthChecking
  };
}
