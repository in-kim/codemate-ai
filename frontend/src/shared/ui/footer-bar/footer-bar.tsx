'use client';

import { cn } from '@/shared/lib/utils';
import { useEditorStore } from '@/shared/store/editor-store';
import { useShallow } from 'zustand/react/shallow';

export function FooterBar() {
  const { line, column, language } = useEditorStore(
    useShallow((state) => ({ line: state.line, column: state.column, language: state.language }))
  );

  return (
    <footer className={cn('flex items-center justify-between h-8 px-4 bg-[#007acc] text-white text-xs')}>
      <div className="flex items-center space-x-4">
        <div>Ln {line}, Col {column}</div>
      </div>
      <div className="flex items-center space-x-2">
        <div>{language.toUpperCase()}</div>
      </div>
    </footer>
  );
}
