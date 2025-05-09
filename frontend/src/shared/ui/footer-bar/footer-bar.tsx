'use client';

import { LanguageSelector } from '@/features/language-selector';
import { cn } from '@/shared/lib/utils';
import { useEditorStore } from '@/shared/store/editor-store';
import { useShallow } from 'zustand/react/shallow';

export function FooterBar() {
  const { line, column } = useEditorStore(
    useShallow((state) => ({ line: state.line, column: state.column, language: state.language }))
  );

  return (
    <footer className={cn('flex items-center justify-between h-8 px-4 bg-[#007acc] text-white text-xs')}>
      <div className="flex items-center space-x-4">
        <div>Ln {line}, Col {column}</div>
      </div>
      <div className="flex items-center space-x-2">
        <LanguageSelector />
      </div>
    </footer>
  );
}
