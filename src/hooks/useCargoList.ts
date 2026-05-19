import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { useI18nStore } from '@/store/i18n.store';
import type { Cargo, CargoFilters } from '@/types/cargo';
import type { ApiError } from '@/lib/api-client';

interface RawCargoData {
  items: Cargo[];
  total: number;
}

/**
 * Server'dan barcha cargolarni olib kelish.
 * QueryKey faqat language + sort + status bilan — boshqa filterlar
 * o'zgarganda qayta fetch BO'LMAYDI (instant client-side filtering).
 */
export function useCargoList(filters: CargoFilters) {
  const language = useI18nStore((s) => s.language);

  return useQuery<RawCargoData, ApiError>({
    queryKey: ['cargo-list', language, filters.sort, filters.status],
    queryFn: async ({ signal }) => {
      const { data } = await api.get('/dispatchers/cargo/all', {
        params: { page: 1, limit: 100, sort: filters.sort, status: filters.status },
        signal,
      });
      const root = data?.data ?? {};
      return {
        items: Array.isArray(root?.items) ? root.items : [],
        total: root?.total ?? 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      if (error.status === 401 || error.status === 403) return false;
      return failureCount < 2;
    },
  });
}
