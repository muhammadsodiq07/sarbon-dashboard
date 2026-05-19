'use client';
import { AlertTriangle, ArrowRight, Heart, Phone, Snowflake, Truck, Users } from 'lucide-react';
import { MiniMap } from '@/components/cargo/MiniMap';
import { useI18nStore } from '@/store/i18n.store';
import { useT } from '@/hooks/useT';
import {
  cn, countryFlag, estimateHours, formatDate, formatPrice,
  getCargoTypeName, getInitials, getRouteInfo, getTotalPrice,
  isNewCargo, isRefrigerator,
} from '@/lib/utils';
import type { Cargo } from '@/types/cargo';

interface Props { cargo: Cargo; }

function getLocale(lang: 'uz' | 'ru' | 'en') {
  return lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
}

export function CargoCard({ cargo }: Props) {
  const t = useT();
  const language = useI18nStore((s) => s.language);
  const locale = getLocale(language);

  const route = getRouteInfo(cargo);
  const price = getTotalPrice(cargo);
  const isAdr = cargo.adr_enabled;
  const isNew = isNewCargo(cargo.created_at);
  const isRef = isRefrigerator(cargo);
  const cargoTypeName = getCargoTypeName(cargo, language);
  const customerInitials = getInitials(cargo.contact_name);

  const variant = isAdr ? 'adr' : isNew ? 'hot' : 'normal';
  const accent =
    isAdr ? 'border-l-amber-500'
    : isNew ? 'border-l-emerald-500'
    : '';

  // Documents
  const docs = cargo.documents
    ? Object.entries(cargo.documents).filter(([_, v]) => v === true).map(([k]) => k)
    : [];

  return (
    <article
      className={cn(
        'group relative grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-150',
        'hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-[0_4px_12px_rgba(16,185,129,0.08)]',
        'lg:grid-cols-[95px_minmax(0,1.3fr)_1fr_130px_125px_auto] lg:items-center lg:gap-3',
        accent && `border-l-[3px] ${accent}`
      )}
    >
      {/* Badges */}
      <div className="absolute -top-2 left-3 flex gap-1.5 z-10">
        {isNew && !isAdr && (
          <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
            {t('cargo.new_badge')}
          </span>
        )}
        {isAdr && (
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-white">
            {t('cargo.adr_badge')} · {t('cargo.adr_class')} {cargo.adr_class ?? ''}
          </span>
        )}
      </div>

      {/* MINI MAP */}
      <div className="hidden lg:block">
        <MiniMap
          origin={route.origin}
          destination={route.destination}
          distanceKm={route.distanceKm}
          variant={variant}
        />
      </div>

      {/* ROUTE */}
      <div className="flex flex-col gap-1 min-w-0">
        {route.origin && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{countryFlag(route.origin.country_code)}</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                {route.origin.country_code}
              </span>
              <span className="truncate text-sm font-semibold text-slate-900">
                {route.origin.city_name}
              </span>
            </div>
            <div className="ml-6 text-[11px] text-slate-500 truncate">
              {route.origin.orientir || (route.origin.date ? formatDate(route.origin.date, locale) : '\u00A0')}
            </div>
          </>
        )}

        {/* Route middle */}
        <div className="ml-6 flex items-center gap-2">
          <svg width="32" height="10" viewBox="0 0 32 10" className={cn(
            'flex-shrink-0',
            variant === 'hot' && 'text-emerald-500',
            variant === 'adr' && 'text-amber-500',
            variant === 'normal' && 'text-slate-400'
          )}>
            <line x1="1" y1="5" x2="26" y2="5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2"/>
            {route.waypoints.length > 0 && <circle cx="13" cy="5" r="1.5" fill="currentColor"/>}
            <path d="M26 2 L 31 5 L 26 8 Z" fill="currentColor"/>
          </svg>
          <span className={cn(
            'text-[10px] font-medium',
            variant === 'hot' && 'text-emerald-600',
            variant === 'adr' && 'text-amber-600',
            variant === 'normal' && 'text-slate-500'
          )}>
            {estimateHours(route.distanceKm)}
          </span>
        </div>

        {route.destination && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{countryFlag(route.destination.country_code)}</span>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                {route.destination.country_code}
              </span>
              <span className="truncate text-sm font-semibold text-slate-900">
                {route.destination.city_name}
              </span>
            </div>
            <div className="ml-6 text-[11px] truncate">
              {route.destination.delivery_asap ? (
                <span className="font-medium text-amber-700">{t('cargo.asap')}</span>
              ) : (
                <span className="text-slate-500">
                  {route.destination.date ? formatDate(route.destination.date, locale) : '\u00A0'}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* SPECS */}
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="text-xs font-semibold text-slate-900 truncate">
          {cargoTypeName}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 flex-wrap">
          <span className="font-bold text-slate-900">{cargo.weight}</span>
          <span>{t('cargo.tons')}</span>
          <span className="text-slate-300">·</span>
          <span className="font-bold text-slate-900">{cargo.volume}</span>
          <span>{t('cargo.cubic')}</span>
          {(cargo.temp_min !== null || cargo.temp_max !== null) && (
            <>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-slate-900">
                {cargo.temp_max !== null ? `≤${cargo.temp_max}°C` : `≥${cargo.temp_min}°C`}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={cn(
            'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-medium',
            isRef ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'
          )}>
            {isRef ? <Snowflake className="h-2.5 w-2.5"/> : <Truck className="h-2.5 w-2.5"/>}
            {cargo.truck_type}{cargo.trailer_plate_type ? ` · ${cargo.trailer_plate_type}` : ''}
          </span>
        </div>

        {(docs.length > 0 || cargo.vehicles_amount > 1 || cargo.is_two_drivers_required) && (
          <div className="flex items-center gap-1 flex-wrap">
            {docs.slice(0, 3).map(d => (
              <span key={d} className="rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-bold text-green-700">
                {d}
              </span>
            ))}
            {cargo.vehicles_amount > 1 && (
              <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-800">
                {cargo.vehicles_amount} {t('cargo.vehicles')}
              </span>
            )}
            {cargo.is_two_drivers_required && (
              <span className="inline-flex items-center gap-0.5 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
                <Users className="h-2 w-2"/>
                {t('cargo.two_drivers_required')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* PRICE */}
      <div className="flex flex-col items-start lg:items-end">
        <div className="text-lg font-bold text-emerald-700">
          {formatPrice(price.amount, price.currency)}
        </div>
        {cargo.payment?.with_prepayment && (
          <div className="mt-0.5 flex flex-col items-start lg:items-end text-[10px] text-slate-600">
            <span className="text-amber-700 font-medium">
              {t('cargo.prepayment')}: {formatPrice(cargo.payment.prepayment_amount, cargo.payment.prepayment_currency)}
            </span>
            <span>
              {t('cargo.remaining')}: {formatPrice(cargo.payment.remaining_amount, cargo.payment.remaining_currency)}
            </span>
          </div>
        )}
        {cargo.payment && (
          <span className="mt-1 inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
            {cargo.payment.prepayment_type === 'CASH' ? 'Naqd' :
             cargo.payment.prepayment_type === 'CARD' ? 'Karta' :
             cargo.payment.prepayment_type === 'BANK_TRANSFER' ? 'O\'tkazma' : cargo.payment.prepayment_type}
          </span>
        )}
      </div>

      {/* CUSTOMER */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-[10px] font-bold text-slate-600">
          {customerInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-slate-900">
            {cargo.contact_name}
          </div>
          <div className="truncate text-[10px] text-slate-500">
            {cargo.contact_phone}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={t('common.favorite')}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50',
            cargo.is_liked && 'border-red-200 bg-red-50 text-red-500'
          )}
        >
          <Heart className="h-3.5 w-3.5" fill={cargo.is_liked ? 'currentColor' : 'none'} />
        </button>
        <button
          type="button"
          aria-label={t('common.call')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <Phone className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label={t('common.offer')}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white transition-colors hover:from-emerald-600 hover:to-emerald-700"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
