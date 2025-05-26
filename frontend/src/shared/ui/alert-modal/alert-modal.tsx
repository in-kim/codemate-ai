'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/shared/lib/utils';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  copyableText?: string;
}

export function AlertModal({ isOpen, onClose, title, message, confirmText = '확인', copyableText }: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // 텍스트 복사 함수
  const handleCopy = async () => {
    if (copyableText) {
      try {
        await navigator.clipboard.writeText(copyableText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2초 후 복사 상태 초기화
      } catch (err) {
        console.error('복사 실패:', err);
      }
    }
  };

  useEffect(() => {
    setIsMounted(true);
    
    // 모달이 열릴 때 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 서버 사이드 렌더링 시 에러 방지
  if (!isMounted) return null;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div 
        className={cn(
          "bg-[#1E1E1E] rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden",
          "transform transition-all duration-300 ease-in-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-[#333]">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        
        {/* 내용 */}
        <div className="px-6 py-4">
          <p className="text-sm text-gray-300 mb-4">{message}</p>
          
          {/* 복사 가능한 텍스트가 있는 경우 입력 필드와 복사 버튼 표시 */}
          {copyableText && (
            <div className="flex items-center mt-3 bg-[#252526] rounded overflow-hidden border border-[#333]">
              <input
                type="text"
                readOnly
                value={copyableText}
                className="flex-1 bg-transparent px-3 py-2 text-sm text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className={cn(
                  "px-3 py-2 text-sm font-medium text-white bg-[#333] hover:bg-[#444] transition-colors",
                  "flex items-center justify-center"
                )}
              >
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          )}
        </div>
        
        {/* 버튼 영역 */}
        <div className="px-6 py-3 bg-[#252525] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
