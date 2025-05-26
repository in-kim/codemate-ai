import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IWorkspace } from '../lib/services/workspace.service';
import { User } from '../types/user';

export interface WorkspaceListProps {
  workspaces: (IWorkspace & { selected?: boolean })[];
  selectedWorkspaceId: string | null;
  addWorkspace: (workspaces: (IWorkspace & { selected?: boolean })[]) => void;
  selectWorkspace: (workspaceId: string) => void;
  getParticipants: () => User[];
  isHydrated?: boolean;
}

export const useWorkspaceStore = create<WorkspaceListProps>()(
  persist(
    devtools(
      immer(
        (set, get) => ({
          workspaces: [],
          selectedWorkspaceId: null,
          addWorkspace: ( workspaces: (IWorkspace & { selected?: boolean })[]) =>
            set(() => ({
              workspaces: workspaces,
            })),
          selectWorkspace: (workspaceId: string) =>
            set(() => ({
              selectedWorkspaceId: workspaceId,
            })),
          getParticipants: () =>
            get().workspaces.find((workspace) => workspace.workSpaceId === get().selectedWorkspaceId)?.participants || [],
        }),
      )
    ),
    { 
      name: 'WorkspaceStore',
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
