
import { cn } from '@/shared/lib/utils';
import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full rounded-md bg-[#1e1e1e] border border-[#3c3c3c] text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0e639c]',
          error ? 'border-red-500 focus:ring-red-500' : '',
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400">{error}</span>
      )}
    </div>
  );
}
