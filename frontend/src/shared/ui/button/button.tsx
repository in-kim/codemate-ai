import { cn } from '@/shared/lib/utils'; // 클래스 합치는 유틸 (아직 없으면 utils.ts에 같이 만들자)
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import { Loading } from '../loading';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

export function Button({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none',
        variant === 'primary' && 'bg-[#0e639c] hover:bg-[#1177bb] text-white',
        variant === 'secondary' && 'bg-[#3c3c3c] hover:bg-[#555] text-gray-200',
        variant === 'danger' && 'bg-red-600 hover:bg-red-700 text-white',
        variant === 'ghost' && 'bg-transparent text-gray-400 hover:bg-[#333]',
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loading /> : children}
    </button>
  );
}
