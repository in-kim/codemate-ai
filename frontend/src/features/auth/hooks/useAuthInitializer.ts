import { getMyInfo } from "@/shared/lib/services/auth.service";
import { isHttpResponseSuccess } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth-store";
import { User } from "@/shared/types/user";
import { useEffect } from "react";

export default function useAuthInitializer() {
  const setUser = useAuthStore(state => state.setUser);

  useEffect(() => {
    const getUserInfo = async () => {
      const response = await getMyInfo();
      if(isHttpResponseSuccess(response)) {
        setUser(response.data as User);
      }
    };
    getUserInfo();
  }, []);
}
