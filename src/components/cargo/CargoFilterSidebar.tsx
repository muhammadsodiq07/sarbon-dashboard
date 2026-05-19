'use client';
import {
  AlertTriangle, Heart, MessageCircle, Snowflake, Users, ChevronDown, X,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { useT } from '@/hooks/useT';
import type { CargoFilters, CargoSort, TruckType } from '@/types/cargo';

interface Props {
  filters: CargoFilters;
  onChange: (next: Partial<CargoFilters>) => void;
  onReset: () => void;
  counts?: {
    favorites?: number;
    has_offers?: number;
    refrigerator?: number;
    adr?: number;
    two_drivers?: number;
  };
}

const TRANSPORTS: TruckType[] = ['TENT', 'BOX', 'REF', 'ISOTERM', 'CONTAINER', 'OPEN', 'TRUCK', 'TIPPER'];

export function CargoFilterSidebar({ filters, onChange, onReset, counts = {} }: Props) {
  const t = useT();

  const sortOptions: { value: CargoSort; label: string }[] = [
    { value: 'created_at:desc', label: t('sort.newest') },
    { value: 'created_at:asc', label: t('sort.oldest') },
    { value: 'payment.total_amount:desc', label: t('sort.price_high') },
    { value: 'payment.total_amount:asc', label: t('sort.price_low') },
    { value: 'weight:desc', label: t('sort.weight_heavy') },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-900">{t('filter.title')}</span>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-600"
        >
          <X className="h-3 w-3" />
          {t('filter.clear')}
        </button>
      </div>

      {/* From */}
      <FilterField label={t('filter.from')}>
        <Input
          placeholder={t('filter.any_city')}
          value={filters.from_city ?? ''}
          onChange={(e) => onChange({ from_city: e.target.value || undefined })}
          className="!h-9 text-xs"
        />
      </FilterField>

      {/* To */}
      <FilterField label={t('filter.to')}>
        <Input
          placeholder={t('filter.any_city')}
          value={filters.to_city ?? ''}
          onChange={(e) => onChange({ to_city: e.target.value || undefined })}
          className="!h-9 text-xs"
        />
      </FilterField>

      {/* Transport */}
      <FilterField label={t('filter.transport')}>
        <div className="relative">
          <select
            value={filters.truck_type ?? ''}
            onChange={(e) => onChange({ truck_type: (e.target.value as TruckType) || '' })}
            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">{t('filter.any_transport')}</option>
            {TRANSPORTS.map(tp => <option key={tp} value={tp}>{tp}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>

      {/* Weight */}
      <FilterField label={t('filter.weight')}>
        <div className="flex gap-1.5">
          <Input
            type="number"
            min={0}
            placeholder={t('filter.min')}
            value={filters.min_weight ?? ''}
            onChange={(e) => onChange({ min_weight: e.target.value === '' ? '' : Number(e.target.value) })}
            className="!h-9 text-xs"
          />
          <Input
            type="number"
            min={0}
            placeholder={t('filter.max')}
            value={filters.max_weight ?? ''}
            onChange={(e) => onChange({ max_weight: e.target.value === '' ? '' : Number(e.target.value) })}
            className="!h-9 text-xs"
          />
        </div>
      </FilterField>

      {/* Date */}
      <FilterField label={t('filter.date')}>
        <Input
          type="date"
          value={filters.date_from ?? ''}
          onChange={(e) => onChange({ date_from: e.target.value || undefined })}
          className="!h-9 text-xs"
        />
      </FilterField>

      {/* Sort */}
      <FilterField label={t('filter.sort')}>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as CargoSort })}
            className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </FilterField>

      {/* Toggles */}
      <div className="space-y-2.5 border-t border-slate-100 pt-3.5">
        <ToggleRow
          label={t('filter.favorites')}
          icon={<Heart className="h-3 w-3" fill="currentColor" />}
          iconBg="bg-red-50 text-red-600"
          count={counts.favorites}
          checked={!!filters.is_liked}
          onChange={(v) => onChange({ is_liked: v })}
        />
        <ToggleRow
          label={t('filter.has_offers')}
          icon={<MessageCircle className="h-3 w-3" />}
          iconBg="bg-blue-50 text-blue-600"
          count={counts.has_offers}
          checked={!!filters.has_offers}
          onChange={(v) => onChange({ has_offers: v })}
        />
        <ToggleRow
          label={t('filter.refrigerator')}
          icon={<Snowflake className="h-3 w-3" />}
          iconBg="bg-sky-50 text-sky-600"
          count={counts.refrigerator}
          checked={!!filters.is_refrigerator}
          onChange={(v) => onChange({ is_refrigerator: v })}
        />
        <ToggleRow
          label={t('filter.adr')}
          icon={<AlertTriangle className="h-3 w-3" />}
          iconBg="bg-amber-50 text-amber-700"
          count={counts.adr}
          checked={!!filters.adr_enabled}
          onChange={(v) => onChange({ adr_enabled: v })}
        />
        <ToggleRow
          label={t('filter.two_drivers')}
          icon={<Users className="h-3 w-3" />}
          iconBg="bg-violet-50 text-violet-600"
          count={counts.two_drivers}
          checked={!!filters.two_drivers}
          onChange={(v) => onChange({ two_drivers: v })}
        />
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, icon, iconBg, count, checked, onChange }: {
  label: string; icon: React.ReactNode; iconBg: string; count?: number;
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2">
      <span className="flex items-center gap-2 text-xs font-medium text-slate-800">
        <span className={`flex h-5 w-5 items-center justify-center rounded ${iconBg}`}>
          {icon}
        </span>
        {label}
      </span>
      {count !== undefined && count > 0 && (
        <span className="ml-auto mr-1.5 text-[10px] font-medium text-slate-400">{count}</span>
      )}
      <Switch checked={checked} onChange={onChange} aria-label={label} />
    </label>
  );
}
