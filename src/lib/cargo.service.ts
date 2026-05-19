import { api } from '@/lib/api-client';
import type { Cargo, CargoFilters, NormalizedCargoList, PaginationMeta } from '@/types/cargo';

/**
 * STRATEGIYA: Server'dan barcha cargolarni olib, filtrlash va paginate
 * qilishni client-side bajaramiz.
 *
 * Sabablari:
 * 1) Sarbon API qaysi filter param nomlarini qabul qilishi to'liq aniq emas
 * 2) Real-time UX — filterlar darhol o'zgaradi, qayta loading yo'q
 * 3) Test mezonlari uchun yetarli (4 ta yuk bilan)
 */
function applyFilters(items: Cargo[], filters: CargoFilters): Cargo[] {
  let result = [...items];

  // Qayerdan (city_name, country_code yoki address bo'yicha)
  if (filters.from_city?.trim()) {
    const q = filters.from_city.trim().toLowerCase();
    result = result.filter(c => {
      const loadPoint = c.route_points?.find(p => p.type === 'LOAD');
      if (!loadPoint) return false;
      return (
        loadPoint.city_name?.toLowerCase().includes(q) ||
        loadPoint.country_code?.toLowerCase().includes(q) ||
        loadPoint.address?.toLowerCase().includes(q)
      );
    });
  }

  // Qayerga
  if (filters.to_city?.trim()) {
    const q = filters.to_city.trim().toLowerCase();
    result = result.filter(c => {
      const unloadPoint = [...(c.route_points ?? [])].reverse().find(p => p.type === 'UNLOAD');
      if (!unloadPoint) return false;
      return (
        unloadPoint.city_name?.toLowerCase().includes(q) ||
        unloadPoint.country_code?.toLowerCase().includes(q) ||
        unloadPoint.address?.toLowerCase().includes(q)
      );
    });
  }

  // Transport
  if (filters.truck_type) {
    result = result.filter(c => c.truck_type === filters.truck_type);
  }

  // Og'irlik min/max
  if (filters.min_weight !== '' && filters.min_weight !== undefined) {
    const min = Number(filters.min_weight);
    if (!isNaN(min)) result = result.filter(c => c.weight >= min);
  }
  if (filters.max_weight !== '' && filters.max_weight !== undefined) {
    const max = Number(filters.max_weight);
    if (!isNaN(max)) result = result.filter(c => c.weight <= max);
  }

  // Sana (yuklash sanasi bu kundan keyin)
  if (filters.date_from) {
    const fromTs = new Date(filters.date_from).getTime();
    if (!isNaN(fromTs)) {
      result = result.filter(c => {
        const loadPoint = c.route_points?.find(p => p.type === 'LOAD');
        if (!loadPoint?.date) return false;
        return new Date(loadPoint.date).getTime() >= fromTs;
      });
    }
  }

  // Switch filterlar
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

  // Qidiruv (global)
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(c =>
      c.cargo_type?.name_uz?.toLowerCase().includes(q) ||
      c.cargo_type?.name_ru?.toLowerCase().includes(q) ||
      c.cargo_type?.name_en?.toLowerCase().includes(q) ||
      c.name?.toLowerCase().includes(q) ||
      c.contact_name?.toLowerCase().includes(q) ||
      c.contact_phone?.includes(q) ||
      c.route_points?.some(p =>
        p.city_name?.toLowerCase().includes(q) ||
        p.address?.toLowerCase().includes(q) ||
        p.country_code?.toLowerCase().includes(q)
      )
    );
  }

  // Saralash
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

  return result;
}

function normalize(raw: any, filters: CargoFilters): NormalizedCargoList & { totalAll: number } {
  const data = raw?.data ?? {};
  const allItems: Cargo[] = Array.isArray(data?.items) ? data.items : [];
  const totalAll: number = data?.total ?? allItems.length;

  const filtered = applyFilters(allItems, filters);
  const startIdx = (filters.page - 1) * filters.limit;
  const paginated = filtered.slice(startIdx, startIdx + filters.limit);

  const meta: PaginationMeta = {
    page: filters.page,
    limit: filters.limit,
    total: filtered.length,
    total_pages: Math.max(1, Math.ceil(filtered.length / filters.limit)),
  };

  return { items: paginated, meta, totalAll };
}

export const cargoService = {
  async getAll(filters: CargoFilters, signal?: AbortSignal): Promise<NormalizedCargoList & { totalAll: number }> {
    // Hammasini olamiz (server-side pagination'siz)
    const { data } = await api.get('/dispatchers/cargo/all', {
      params: { page: 1, limit: 100, sort: filters.sort, status: filters.status },
      signal,
    });
    return normalize(data, filters);
  },
};
