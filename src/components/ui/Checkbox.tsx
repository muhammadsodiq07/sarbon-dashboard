import { forwardRef, type InputHTMLAttributes } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...rest }, ref) => (
    <label className="inline-flex cursor-pointer select-none items-center gap-2">
      <span className="relative inline-flex h-4 w-4 items-center justify-center">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-300 bg-white',
            'transition-colors checked:border-brand-500 checked:bg-brand-500',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30',
            className
          )}
          {...rest}
        />
        <Check
          className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
          strokeWidth={3}
          aria-hidden
        />
      </span>
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  )
);
Checkbox.displayName = 'Checkbox';
