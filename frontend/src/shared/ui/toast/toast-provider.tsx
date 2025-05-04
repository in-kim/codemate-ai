'use client';

import { useState, useCallback } from 'react';
import { ToastContext } from './toast-context';
import { Toast, ToastType } from './toast';

export interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<{ id: string; message: string; type?: ToastType }[]>([]);

  const addToast = useCallback((message: string, type?: ToastType) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000); // 3초 후 제거
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast 모음 */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
