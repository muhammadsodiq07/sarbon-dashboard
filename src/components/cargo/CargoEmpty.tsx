'use client';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/hooks/useT';

export function CargoEmpty({ onReset }: { onReset: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-20 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-emerald-50 blur-2xl"/>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
          <Inbox className="h-8 w-8"/>
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{t('state.empty_title')}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-600">{t('state.empty_message')}</p>
      <Button variant="outline" onClick={onReset} className="mt-5">{t('state.empty_reset')}</Button>
    </div>
  );
}
