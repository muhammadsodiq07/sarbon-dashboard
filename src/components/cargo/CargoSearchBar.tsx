'use client';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';

interface Props {
  search?: string;
  onSearchChange: (value: string) => void;
  onToggleFilter: () => void;
  filterOpen: boolean;
  activeFilterCount: number;
}

export function CargoSearchBar({
  search, onSearchChange, onToggleFilter, filterOpen, activeFilterCount,
}: Props) {
  const t = useT();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 transition-all">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <Input
            placeholder={t('filter.search_placeholder')}
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn('!h-9 pl-9 text-sm', search && 'pr-9')}
          />
        </div>
        <button
          type="button"
          onClick={onToggleFilter}
          className={cn(
            'relative inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-all lg:hidden',
            filterOpen
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          )}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Filtr</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
