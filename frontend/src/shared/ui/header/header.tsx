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
    <header className={cn('flex items-center justify-between p-3 bg-[#1e1e1e] border-b border-[#333]')}>
      <div className="text-lg font-semibold text-gray-200">codeMate.AI</div>
      <Button
        variant="primary"
        className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 text-sm"
        onClick={onRunClick}
      >
        ▶ Run
      </Button>
      {
        rightSlot
      }
    </header>
  );
}
