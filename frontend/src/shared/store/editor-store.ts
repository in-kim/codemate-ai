import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface EditorState {
  code: string;
  setCode: (code: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    devtools(
      immer(
        (set) => ({
          code: '// Start coding...',
          setCode: (code) => set({ code }),
        }),
      ),
      { name: 'EditorStore', enabled: process.env.NODE_ENV === 'development' }
    ),
    {
      name: 'editor-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
