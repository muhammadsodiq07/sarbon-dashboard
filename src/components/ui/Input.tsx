import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30',
        invalid
          ? 'border-red-400 focus:border-red-500'
          : 'border-slate-200 focus:border-brand-500',
        'disabled:cursor-not-allowed disabled:bg-slate-50',
        className
      )}
      {...rest}
    />
  )
);
Input.displayName = 'Input';
