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
  isHydrated: boolean;
  setUser: (user: User) => void;
  getUser: () => User | null;
  getIsLogin: () => boolean;
  clearUser: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const initialState = {
  userInfo: null as User | null,
  isHydrated: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,
        setUser: (user: User) => set({ userInfo: user }),
        getUser: () => get().userInfo,
        getIsLogin: () => get().userInfo !== null,
        clearUser: () => set({ userInfo: null }),
        setHydrated: (hydrated: boolean) => set({ isHydrated: hydrated }),
      })),
      {
        name: 'AuthStore',
        storage: createJSONStorage(() => localStorage),
        version: 1,
        onRehydrateStorage: () => (state) => {
          if (state) {
            useAuthStore.getState().setHydrated(true);
          }
        },
      }
    )
  )
);
