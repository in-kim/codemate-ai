'use client';

import { createContext, useContext } from 'react';
import { ToastType } from './toast';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
}

export interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
