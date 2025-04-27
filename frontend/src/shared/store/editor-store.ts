import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface EditorState {
  code: string;
  setCode: (code: string) => void;
  line: number;
  column: number;
  language: string;
  setCursorPosition: (line: number, column: number) => void;
  setLanguage: (language: string) => void;
  isHydrated?: boolean;
}

export type { EditorState };

export const useEditorStore = create<EditorState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          code: '// Start coding...',
          line: 1,
          column: 1,
          language: 'typescript',
          setCode: (code) => set({ code }),
          setCursorPosition: (line, column) => set({ line, column }),
          setLanguage: (language) => set({ language }),
        }),
      ),
      { name: 'EditorStore', enabled: process.env.NODE_ENV === 'development' }
    ),
    {
      name: 'editor-storage',
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
