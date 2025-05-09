import { create } from 'zustand';
import { ToastType } from '@/shared/ui/toast';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  isHydrated?: boolean;
}

export const useToastStore = create<ToastState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          toasts: [],
          addToast: (message, type = 'default') => {
            const id = crypto.randomUUID();
            set((state) => ({
              toasts: [...state.toasts, { id, message, type }],
            }));
      
            setTimeout(() => {
              set((state) => ({
                toasts: state.toasts.filter((toast: ToastItem) => toast.id !== id),
              }));
            }, 3000);
          },
          removeToast: (id) => {
            set((state) => ({
              toasts: state.toasts.filter((toast: ToastItem) => toast.id !== id),
            }));
          },
        }),
      ),
    ),
    { 
      name: 'ToastStore',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
      migrate: (persistedState) => persistedState,
    }
  )
)
