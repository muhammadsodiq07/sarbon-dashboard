'use client';
import Link from 'next/link';
import { ChevronRight, Home, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { BigRouteMap } from '@/components/cargo/BigRouteMap';
import { CargoCard } from '@/components/cargo/CargoCard';
import { CargoEmpty } from '@/components/cargo/CargoEmpty';
import { CargoError } from '@/components/cargo/CargoError';
import { CargoFilterSidebar } from '@/components/cargo/CargoFilterSidebar';
import { CargoPagination } from '@/components/cargo/CargoPagination';
import { CargoSearchBar } from '@/components/cargo/CargoSearchBar';
import { CargoStats } from '@/components/cargo/CargoStats';
import { CargoTableSkeleton } from '@/components/cargo/CargoTableSkeleton';
import { useCargoFilters } from '@/hooks/useCargoFilters';
import { useCargoList } from '@/hooks/useCargoList';
import { useFilteredCargo } from '@/hooks/useFilteredCargo';
import { useT } from '@/hooks/useT';
import { cn, isRefrigerator } from '@/lib/utils';

export function CargoPageContent() {
  const t = useT();
  const { filters, setFilters, resetFilters } = useCargoFilters();
  const { data: rawData, isLoading, isError, error, isFetching, refetch } = useCargoList(filters);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Client-side filtering — har bir filter o'zgarganda darrov ishlaydi
  const filtered = useFilteredCargo({
    items: rawData?.items ?? [],
    totalAll: rawData?.total ?? 0,
    filters,
  });

  const handleFilterChange = useCallback(
    (partial: Parameters<typeof setFilters>[0]) => setFilters(partial, { resetPage: true }),
    [setFilters]
  );

  const handlePageChange = useCallback((page: number) => setFilters({ page }), [setFilters]);
  const handleLimitChange = useCallback((limit: number) => setFilters({ limit }, { resetPage: true }), [setFilters]);

  // Body scroll lock when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileFilterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileFilterOpen]);

  const hasData = !isLoading && !isError && filtered.items.length > 0;
  const isEmpty = !isLoading && !isError && filtered.items.length === 0 && (rawData?.items.length ?? 0) > 0;
  const hasNoData = !isLoading && !isError && (rawData?.items.length ?? 0) === 0;

  // Active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.from_city) count++;
    if (filters.to_city) count++;
    if (filters.truck_type) count++;
    if (filters.min_weight !== '' && filters.min_weight !== undefined) count++;
    if (filters.max_weight !== '' && filters.max_weight !== undefined) count++;
    if (filters.date_from) count++;
    if (filters.is_liked) count++;
    if (filters.has_offers) count++;
    if (filters.is_refrigerator) count++;
    if (filters.adr_enabled) count++;
    if (filters.two_drivers) count++;
    return count;
  }, [filters]);

  // Counts for switch badges — barcha raw items'dan
  const counts = useMemo(() => {
    const items = rawData?.items ?? [];
    return {
      favorites: items.filter(c => c.is_liked).length,
      has_offers: items.filter(c => c.payment?.is_negotiable === false).length,
      refrigerator: items.filter(isRefrigerator).length,
      adr: items.filter(c => c.adr_enabled).length,
      two_drivers: items.filter(c => c.is_two_drivers_required).length,
    };
  }, [rawData]);

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-400" aria-label="Breadcrumb">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-700">
          <Home className="h-3 w-3"/>{t('page.breadcrumb_home')}
        </Link>
        <ChevronRight className="h-3 w-3"/>
        <span className="font-medium text-slate-600">{t('page.breadcrumb_cargo')}</span>
      </nav>

      {/* Title */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {t('page.title')}
          </h1>
          <p className="mt-1 text-xs text-slate-500">{t('page.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {filtered.totalAll} {t('page.live')}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={cn('h-4 w-4 transition-transform', isFetching && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4">
        <CargoStats data={{ items: rawData?.items ?? [], meta: filtered.meta }} isLoading={isLoading} />
      </div>

      {/* Main grid */}
      <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">

        {/* DESKTOP SIDEBAR — sticky, scroll YO'Q */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <div className="space-y-3">
            {(rawData?.items?.length ?? 0) > 0 && <BigRouteMap items={rawData!.items}/>}
            <CargoFilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={resetFilters}
              counts={counts}
            />
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        <div
          className={cn(
            'fixed inset-0 z-50 lg:hidden',
            mobileFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          aria-hidden={!mobileFilterOpen}
        >
          <div
            className={cn(
              'absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300',
              mobileFilterOpen ? 'opacity-100' : 'opacity-0'
            )}
            onClick={() => setMobileFilterOpen(false)}
          />
          <div
            className={cn(
              'absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-slate-50 shadow-2xl transition-transform duration-300 ease-out',
              mobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Filtr va xarita</h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            <div className="space-y-3 p-3">
              {(rawData?.items?.length ?? 0) > 0 && <BigRouteMap items={rawData!.items}/>}
              <CargoFilterSidebar
                filters={filters}
                onChange={handleFilterChange}
                onReset={resetFilters}
                counts={counts}
              />
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="min-w-0">
          {/* Search bar — sticky! header (64px) dan keyin */}
          {/* Search bar — mobile'da sticky (top-16, header'dan keyin), desktop'da oddiy */}
          <div className="sticky top-16 z-30 -mx-4 mb-3 bg-slate-50 px-4 py-2 sm:-mx-6 sm:px-6 lg:static lg:-mx-0 lg:bg-transparent lg:px-0 lg:py-0">
            <CargoSearchBar
              search={filters.search}
              onSearchChange={(v) => handleFilterChange({ search: v || undefined })}
              onToggleFilter={() => setMobileFilterOpen(true)}
              filterOpen={mobileFilterOpen}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Content */}
          {isLoading && <CargoTableSkeleton rows={filters.limit > 10 ? 6 : 4} />}
          {isError && <CargoError message={error?.message} onRetry={() => refetch()} />}
          {hasNoData && <CargoEmpty onReset={resetFilters} />}
          {isEmpty && <CargoEmpty onReset={resetFilters} />}

          {hasData && (
            <>
              <div className="space-y-2.5 animate-fade-in">
                {filtered.items.map((cargo) => (
                  <CargoCard key={cargo.id} cargo={cargo} />
                ))}
              </div>
              <div className="mt-3">
                <CargoPagination
                  meta={filtered.meta}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function CargoPageFallback() {
  return (
    <>
      <div className="mb-3 h-3 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mb-4 h-8 w-64 animate-pulse rounded bg-slate-200" />
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="h-[100px] animate-pulse rounded-xl border border-slate-200 bg-white" />)}
      </div>
      <div className="grid gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="hidden space-y-3 lg:block">
          <div className="h-[260px] animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="h-[400px] animate-pulse rounded-xl border border-slate-200 bg-white" />
        </div>
        <CargoTableSkeleton rows={4} />
      </div>
    </>
  );
}
