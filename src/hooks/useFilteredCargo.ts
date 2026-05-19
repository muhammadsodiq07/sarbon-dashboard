import { useMemo } from 'react';
import type { Cargo, CargoFilters, PaginationMeta } from '@/types/cargo';

interface Args {
  items: Cargo[];
  totalAll: number;
  filters: CargoFilters;
}

interface Result {
  items: Cargo[];
  meta: PaginationMeta;
  totalAll: number;
}

export function useFilteredCargo({ items, totalAll, filters }: Args): Result {
  return useMemo(() => {
    let result = [...items];

    // Qayerdan
    if (filters.from_city?.trim()) {
      const q = filters.from_city.trim().toLowerCase();
      result = result.filter(c => {
        const p = c.route_points?.find(rp => rp.type === 'LOAD');
        if (!p) return false;
        return (
          p.city_name?.toLowerCase().includes(q) ||
          p.country_code?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
        );
      });
    }

    // Qayerga
    if (filters.to_city?.trim()) {
      const q = filters.to_city.trim().toLowerCase();
      result = result.filter(c => {
        const p = [...(c.route_points ?? [])].reverse().find(rp => rp.type === 'UNLOAD');
        if (!p) return false;
        return (
          p.city_name?.toLowerCase().includes(q) ||
          p.country_code?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q)
        );
      });
    }

    // Transport
    if (filters.truck_type) {
      result = result.filter(c => c.truck_type === filters.truck_type);
    }

    // Og'irlik min
    if (filters.min_weight !== '' && filters.min_weight !== undefined) {
      const min = Number(filters.min_weight);
      if (!isNaN(min)) result = result.filter(c => c.weight >= min);
    }
    // Og'irlik max
    if (filters.max_weight !== '' && filters.max_weight !== undefined) {
      const max = Number(filters.max_weight);
      if (!isNaN(max)) result = result.filter(c => c.weight <= max);
    }

    // Sana
    if (filters.date_from) {
      const fromTs = new Date(filters.date_from).getTime();
      if (!isNaN(fromTs)) {
        result = result.filter(c => {
          const p = c.route_points?.find(rp => rp.type === 'LOAD');
          if (!p?.date) return false;
          return new Date(p.date).getTime() >= fromTs;
        });
      }
    }

    // Switch'lar
    if (filters.is_liked) result = result.filter(c => c.is_liked);
    if (filters.is_refrigerator) {
      result = result.filter(c =>
        c.truck_type === 'REF' || c.truck_type === 'ISOTERM' ||
        c.temp_min !== null || c.temp_max !== null
      );
    }
    if (filters.adr_enabled) result = result.filter(c => c.adr_enabled);
    if (filters.two_drivers) result = result.filter(c => c.is_two_drivers_required);
    if (filters.has_offers) result = result.filter(c => c.payment?.is_negotiable === false);

    // Global search
    if (filters.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(c =>
        c.cargo_type?.name_uz?.toLowerCase().includes(q) ||
        c.cargo_type?.name_ru?.toLowerCase().includes(q) ||
        c.cargo_type?.name_en?.toLowerCase().includes(q) ||
        c.cargo_type?.code?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        c.contact_name?.toLowerCase().includes(q) ||
        c.contact_phone?.includes(q) ||
        c.truck_type?.toLowerCase().includes(q) ||
        c.route_points?.some(p =>
          p.city_name?.toLowerCase().includes(q) ||
          p.address?.toLowerCase().includes(q) ||
          p.country_code?.toLowerCase().includes(q)
        )
      );
    }

    // Saralash (client-side ham bajaramiz, isonchli bo'lsin)
    switch (filters.sort) {
      case 'created_at:desc':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      case 'created_at:asc':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); break;
      case 'payment.total_amount:desc':
        result.sort((a, b) => (b.payment?.total_amount ?? 0) - (a.payment?.total_amount ?? 0)); break;
      case 'payment.total_amount:asc':
        result.sort((a, b) => (a.payment?.total_amount ?? 0) - (b.payment?.total_amount ?? 0)); break;
      case 'weight:desc': result.sort((a, b) => b.weight - a.weight); break;
      case 'weight:asc': result.sort((a, b) => a.weight - b.weight); break;
    }

    // Client-side pagination
    const totalFiltered = result.length;
    const totalPages = Math.max(1, Math.ceil(totalFiltered / filters.limit));
    const safePage = Math.min(filters.page, totalPages);
    const startIdx = (safePage - 1) * filters.limit;
    const paginated = result.slice(startIdx, startIdx + filters.limit);

    const meta: PaginationMeta = {
      page: safePage,
      limit: filters.limit,
      total: totalFiltered,
      total_pages: totalPages,
    };

    return { items: paginated, meta, totalAll };
  }, [items, totalAll, filters]);
}
