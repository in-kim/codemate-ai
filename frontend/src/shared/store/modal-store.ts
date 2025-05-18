import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ModalState {
  isInviteModalOpen: boolean;
  openInviteModal: () => void;
  closeInviteModal: () => void;
  isCreateWorkspaceModalOpen: boolean;
  openCreateWorkspaceModal: () => void;
  closeCreateWorkspaceModal: () => void;
  isHydrated?: boolean;
}

export const useModalStore = create<ModalState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          isInviteModalOpen: false,
          openInviteModal: () => set({ isInviteModalOpen: true }),
          closeInviteModal: () => set({ isInviteModalOpen: false }),
          isCreateWorkspaceModalOpen: false,
          openCreateWorkspaceModal: () => set({ isCreateWorkspaceModalOpen: true }),
          closeCreateWorkspaceModal: () => set({ isCreateWorkspaceModalOpen: false }),
        }),
      )
    ),
    { 
      name: 'ModalStore',
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
);