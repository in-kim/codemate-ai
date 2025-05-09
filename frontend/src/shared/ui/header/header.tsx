import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

export interface HeaderProps {
  onRunClick?: () => void;
  rightSlot?: ReactNode;
}

export function Header({
  onRunClick,
  rightSlot
}: HeaderProps) {
  return (
    <header className={cn('flex items-center justify-between p-3 bg-[#252526] border-b border-[#333]')}>
      <div className="text-lg font-semibold text-gray-200">codeMate.AI</div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="hover:bg-[#1177bb] text-white px-2 py-1 text-sm"
          onClick={onRunClick}
        >
          ▶ Run
        </Button>
        {
          rightSlot
        }
      </div>
    </header>
  );
}
