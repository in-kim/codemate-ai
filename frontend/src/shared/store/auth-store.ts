import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface User {
  id: string;
  username: string;
  avatarUrl: string;
}

interface AuthState {
  userInfo: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  isHydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    devtools(
      immer(
        (set, get) => ({
          userInfo: null,
          setUser: (user: User) => set({ userInfo: user }),
          getUser: () => get().userInfo,
          isHydrated: false, // ✅ 여기까지는 상태 정의
          setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
        }),
      )
    ),
    {
      name: 'AuthStore',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => persistedState,
      onRehydrateStorage: () => (state) => {
        if (state) {
          useAuthStore.getState().setHydrated(true);
        }
      },
    }
  )
)
