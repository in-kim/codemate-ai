import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { detectLanguage } from '../lib/detectLanguage';

interface EditorState {
  codeId: string;
  code: string;
  setCode: (code: string) => void;
  line: number;
  column: number;
  language: string;
  setCursorPosition: (line: number, column: number) => void;
  setLanguage: (language: string) => void;
  setCodeId: (codeId: string) => void;
  detectAndSetLanguage: (codeInput: string) => void;
  isHydrated?: boolean;
}

export type { EditorState };

export const useEditorStore = create<EditorState>()(
  persist(
    devtools(
      immer(
        (set, get) => ({
          codeId: '',
          code: '// Start coding...',
          line: 1,
          column: 1,
          language: 'plaintext',
          setCode: (code) => set({ code }),
          setCursorPosition: (line, column) => set({ line, column }),
          setLanguage: (language) => set({ language }),
          setCodeId: (codeId) => set({ codeId }),
          detectAndSetLanguage: (codeInput: string) => {
            const code = codeInput ?? get().code;
            const detected = detectLanguage(code);
            if (detected){
              set((state: EditorState) => {
                state.language = detected;
              })
            }
          }
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
