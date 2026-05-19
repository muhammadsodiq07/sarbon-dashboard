'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/cargo';

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMITS = [10, 20, 50];

function buildPages(cur: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'gap')[] = [];
  pages.push(1);
  if (cur - 1 > 2) pages.push('gap');
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
  if (cur + 1 < total - 1) pages.push('gap');
  pages.push(total);
  return pages;
}

export function CargoPagination({ meta, onPageChange, onLimitChange }: Props) {
  const t = useT();
  const totalPages = meta.total_pages ?? 1;
  const pages = useMemo(() => buildPages(meta.page, totalPages), [meta.page, totalPages]);
  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row">
      <div className="text-xs text-slate-600">
        {t('pagination.showing', {
          from: meta.total === 0 ? 0 : from,
          to: meta.total === 0 ? 0 : to,
          total: meta.total,
        })}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline" size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          aria-label={t('pagination.prev')}
        >
          <ChevronLeft className="h-3.5 w-3.5"/>
          <span className="hidden sm:inline">{t('pagination.prev')}</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === 'gap' ? (
              <span key={`g-${i}`} className="px-1 text-xs text-slate-400">…</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === meta.page ? 'page' : undefined}
                className={cn(
                  'inline-flex h-7 min-w-[28px] items-center justify-center rounded-md px-1.5 text-xs font-medium',
                  p === meta.page
                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <Button
          variant="outline" size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= totalPages}
          aria-label={t('pagination.next')}
        >
          <span className="hidden sm:inline">{t('pagination.next')}</span>
          <ChevronRight className="h-3.5 w-3.5"/>
        </Button>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span>{t('pagination.per_page')}</span>
        <select
          value={meta.limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-xs focus:border-emerald-500 focus:outline-none"
        >
          {LIMITS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
    </div>
  );
}
