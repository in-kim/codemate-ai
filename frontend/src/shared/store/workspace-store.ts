import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { getJoinMyWorkspaceResponse } from '../lib/services/workspace.service';

export interface WorkspaceListProps {
  workspaces: (getJoinMyWorkspaceResponse & { selected?: boolean })[];
  selectedWorkspaceId: string | null;
  addWorkspace: (workspaces: (getJoinMyWorkspaceResponse & { selected?: boolean })[]) => void;
  selectWorkspace: (workspaceId: string) => void;
  isHydrated?: boolean;
}

export const useWorkspaceStore = create<WorkspaceListProps>()(
  persist(
    devtools(
      immer(
        (set) => ({
          workspaces: [],
          selectedWorkspaceId: null,
          addWorkspace: ( workspaces: (getJoinMyWorkspaceResponse & { selected?: boolean })[]) =>
            set(() => ({
              workspaces: workspaces,
            })),
          selectWorkspace: (workspaceId: string) =>
            set((state) => ({
              workspaces: state.workspaces.map((workspace) =>
                workspace.workSpaceId === workspaceId ? { ...workspace, selected: true } : { ...workspace, selected: false }
              ),
            })),
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
