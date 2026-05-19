'use client';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/hooks/useT';

export function CargoError({ message, onRetry }: { message?: string; onRetry: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/30 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-7 w-7"/>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{t('state.error_title')}</h3>
      <p className="mt-1.5 max-w-md text-sm text-slate-600">{message || t('state.error_message')}</p>
      <Button variant="primary" onClick={onRetry} className="mt-5">
        <RefreshCw className="h-4 w-4"/>
        {t('state.retry')}
      </Button>
    </div>
  );
}
