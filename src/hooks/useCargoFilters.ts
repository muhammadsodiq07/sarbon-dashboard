'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { DEFAULT_FILTERS, type CargoFilters, type CargoSort, type CargoStatus, type TruckType } from '@/types/cargo';

function parseFilters(p: URLSearchParams): CargoFilters {
  const page = Number(p.get('page')) || DEFAULT_FILTERS.page;
  const limit = Number(p.get('limit')) || DEFAULT_FILTERS.limit;
  return {
    page,
    limit: [10, 20, 50].includes(limit) ? limit : 20,
    sort: (p.get('sort') as CargoSort) || DEFAULT_FILTERS.sort,
    status: (p.get('status') as CargoStatus) || DEFAULT_FILTERS.status,
    from_city: p.get('from_city') || undefined,
    to_city: p.get('to_city') || undefined,
    truck_type: (p.get('truck_type') as TruckType) || '',
    min_weight: p.get('min_weight') ? Number(p.get('min_weight')) : '',
    max_weight: p.get('max_weight') ? Number(p.get('max_weight')) : '',
    date_from: p.get('date_from') || undefined,
    is_liked: p.get('is_liked') === 'true',
    has_offers: p.get('has_offers') === 'true',
    is_refrigerator: p.get('is_refrigerator') === 'true',
    adr_enabled: p.get('adr_enabled') === 'true',
    two_drivers: p.get('two_drivers') === 'true',
    search: p.get('search') || undefined,
  };
}

function serialize(f: CargoFilters): URLSearchParams {
  const p = new URLSearchParams();
  p.set('page', String(f.page));
  p.set('limit', String(f.limit));
  p.set('sort', f.sort);
  p.set('status', f.status);
  if (f.from_city) p.set('from_city', f.from_city);
  if (f.to_city) p.set('to_city', f.to_city);
  if (f.truck_type) p.set('truck_type', f.truck_type);
  if (f.min_weight !== '' && f.min_weight !== undefined) p.set('min_weight', String(f.min_weight));
  if (f.max_weight !== '' && f.max_weight !== undefined) p.set('max_weight', String(f.max_weight));
  if (f.date_from) p.set('date_from', f.date_from);
  if (f.is_liked) p.set('is_liked', 'true');
  if (f.has_offers) p.set('has_offers', 'true');
  if (f.is_refrigerator) p.set('is_refrigerator', 'true');
  if (f.adr_enabled) p.set('adr_enabled', 'true');
  if (f.two_drivers) p.set('two_drivers', 'true');
  if (f.search) p.set('search', f.search);
  return p;
}

export function useCargoFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseFilters(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const setFilters = useCallback(
    (next: Partial<CargoFilters>, options: { resetPage?: boolean } = {}) => {
      const merged: CargoFilters = {
        ...filters,
        ...next,
        page: options.resetPage ? 1 : (next.page ?? filters.page),
      };
      router.replace(`?${serialize(merged).toString()}`, { scroll: false });
    },
    [filters, router]
  );

  const resetFilters = useCallback(() => router.replace('?', { scroll: false }), [router]);
  return { filters, setFilters, resetFilters };
}
