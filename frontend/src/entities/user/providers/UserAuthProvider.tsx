import { getMyInfo } from "@/shared/lib/services/auth.service";
import UserAuthProviderClient from "./UserAuthProviderClient";

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export default async function UserAuthProvider({ children }: UserAuthProviderProps) {
  const response = await getMyInfo();
  const userInfo = response?.data || null;

  return (
    <UserAuthProviderClient initialUserInfo={userInfo}>
      {children}
    </UserAuthProviderClient>
  );
}