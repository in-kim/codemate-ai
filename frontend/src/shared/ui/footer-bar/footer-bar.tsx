'use client';

import { cn } from '@/shared/lib/utils';

export interface FooterBarProps {
  line: number;
  column: number;
  language: string;
}

export function FooterBar({ line = 1, column = 1, language = "plaintext" }: FooterBarProps) {
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
