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
}

export const useToastStore = create<ToastState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          toasts: [],
          addToast: (message, type = 'default') => {
            const id = Date.now().toString();
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
    }
  )
)
