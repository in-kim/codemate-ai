import { fetcher } from "../fetcher";
import { User } from "@/shared/types/user";

export async function checkAuth(): Promise<User | null> {
  try {
    const res = await fetcher('/api/auth/me', {
      credentials: 'include',
    });

    return res as User;
  } catch (error) {
    console.error('Authentication check failed:', error);
    return null;
  }
}