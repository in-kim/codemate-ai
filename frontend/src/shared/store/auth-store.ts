import { create } from 'zustand';
import {  devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from '../types/user';

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
      version: 1,
    }
  )
);
