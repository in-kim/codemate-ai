import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Collaborator {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

interface CollaboratorState {
  collaborators: Collaborator[];
  addCollaborator: (name: string) => void;
  isHydrated?: boolean;
}

export const useCollaboratorStore = create<CollaboratorState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          collaborators: [
            { id: '1', name: 'Alice', status: 'online' },
            { id: '2', name: 'Bob', status: 'offline' },
          ],
          addCollaborator: (name) =>
            set((state) => ({
              collaborators: [
                ...state.collaborators,
                { id: Date.now().toString(), name, status: 'online' },
              ],
            })),
        }),
      )
    ),
    { 
      name: 'CollaboratorStore',
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
