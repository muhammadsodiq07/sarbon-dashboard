import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'success' | 'warning' | 'info' | 'danger';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  success: 'bg-brand-50 text-brand-700 ring-brand-100',
  warning: 'bg-amber-50 text-amber-700 ring-amber-100',
  info: 'bg-sky-50 text-sky-700 ring-sky-100',
  danger: 'bg-red-50 text-red-700 ring-red-100',
};

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        toneClasses[tone],
        className
      )}
      {...rest}
    />
  );
}
