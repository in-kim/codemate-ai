import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

export interface HeaderProps {
  rightSlot?: ReactNode;
}

export function Header({
  rightSlot
}: HeaderProps) {
  return (
    <header className={cn('flex items-center justify-between p-3 bg-[#252526] border-b border-[#333]')}>
      <div className="text-lg font-semibold text-gray-200">codeMate.AI</div>
      {
        rightSlot
      }
    </header>
  );
}
