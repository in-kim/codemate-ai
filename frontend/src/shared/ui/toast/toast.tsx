'use client';

import { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ToastProps {
  id?: string;
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'default';

export function Toast({ message, type = 'default',  onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const typeClass = {
    success: 'border-green-600 bg-[#252526] text-white',
    error: 'border-red-600 bg-[#252526] text-white',
    warning: 'border-yellow-500 bg-[#252526] text-white',
    default: 'border-[#252526] bg-[#252526] text-white',
  };

  const typeIcon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    default: 'ℹ️',
  };

  return (
    <div className={cn(
      'flex items-center space-x-2 text-sm px-4 py-2 rounded shadow-lg animate-fade-in border-1',
      typeClass[type],
    )}>
      {/* 아이콘 표시 */}
      <span className="text-lg">{typeIcon[type]}</span>

      {/* 메시지 */}
      <span>{message}</span>
    </div>
  );
}