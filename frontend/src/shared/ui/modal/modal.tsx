'use client';

import { cn } from '@/shared/lib/utils';
import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {/* 모달 본체 */}
      <div className={cn('bg-[#252526] text-gray-200 rounded-md w-96 p-6')}>
        {/* 닫기 버튼 */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
