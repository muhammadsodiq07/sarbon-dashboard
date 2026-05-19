import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Cargo, Currency, RoutePoint } from '@/types/cargo';

type Language = 'uz' | 'ru' | 'en';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$', UZS: 'so\'m', RUB: '₽', EUR: '€', KZT: '₸',
};

export function formatPrice(amount: number | undefined | null, currency: Currency = 'USD'): string {
  if (amount === undefined || amount === null) return '—';
  const sym = CURRENCY_SYMBOLS[currency] ?? currency;
  if (currency === 'USD' || currency === 'EUR') {
    return `${sym}${amount.toLocaleString('en-US')}`;
  }
  if (currency === 'UZS') {
    // Compact form for UZS
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${sym}`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}k ${sym}`;
    return `${amount.toLocaleString('uz-UZ')} ${sym}`;
  }
  return `${amount.toLocaleString()} ${sym}`;
}

export function formatDate(iso: string | undefined | null, locale = 'uz-UZ'): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(iso));
  } catch { return iso; }
}

export function formatRelativeTime(iso: string | undefined, locale = 'uz'): string {
  if (!iso) return '—';
  try {
    const diff = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    const abs = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    if (abs < 60) return rtf.format(diff, 'second');
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    return rtf.format(Math.round(diff / 86400), 'day');
  } catch { return iso; }
}

export function countryFlag(code?: string): string {
  if (!code) return '🌐';
  return code.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

// ---- ROUTE HELPERS ----
export interface RouteInfo {
  origin: RoutePoint | null;
  destination: RoutePoint | null;
  waypoints: RoutePoint[];
  distanceKm: number;
}

export function getRouteInfo(cargo: Cargo): RouteInfo {
  const points = [...(cargo.route_points ?? [])].sort((a, b) => a.point_order - b.point_order);
  const origin = points.find(p => p.type === 'LOAD') ?? points[0] ?? null;
  const destination = [...points].reverse().find(p => p.type === 'UNLOAD') ?? points[points.length - 1] ?? null;
  const waypoints = points.filter(p => p !== origin && p !== destination);

  let distanceKm = 0;
  if (origin && destination) {
    distanceKm = haversineKm(origin.lat, origin.lng, destination.lat, destination.lng);
  }
  return { origin, destination, waypoints, distanceKm };
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export function estimateHours(distanceKm: number): string {
  const avgKmh = 55;
  const hours = distanceKm / avgKmh;
  if (hours < 1) return `~${Math.round(hours * 60)} min`;
  if (hours < 24) return `~${Math.round(hours)} soat`;
  return `~${Math.round(hours / 24)} kun`;
}

export function getCargoTypeName(cargo: Cargo, lang: Language): string {
  const ct = cargo.cargo_type;
  if (!ct) return cargo.name ?? '—';
  if (lang === 'uz') return ct.name_uz ?? ct.name_en ?? ct.code;
  if (lang === 'ru') return ct.name_ru ?? ct.name_en ?? ct.code;
  return ct.name_en ?? ct.code;
}

export function getTotalPrice(cargo: Cargo): { amount: number; currency: Currency } {
  return {
    amount: cargo.payment?.total_amount ?? 0,
    currency: (cargo.payment?.total_currency ?? 'USD') as Currency,
  };
}

export function isRefrigerator(cargo: Cargo): boolean {
  return cargo.truck_type === 'REF' || cargo.truck_type === 'ISOTERM' ||
         cargo.temp_min !== null || cargo.temp_max !== null;
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function isNewCargo(iso: string, hours = 24): boolean {
  const ageMs = Date.now() - new Date(iso).getTime();
  return ageMs < hours * 3600 * 1000;
}

// Latitude/Longitude -> map viewBox projection
// For mini-maps (95x70) and big map (280x220)
const REGION_BOUNDS = {
  minLat: 25, maxLat: 60,  // South to North
  minLng: 25, maxLng: 85,  // West to East
};

export function projectLatLng(lat: number, lng: number, width: number, height: number) {
  const { minLat, maxLat, minLng, maxLng } = REGION_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
  return {
    x: Math.max(5, Math.min(width - 5, x)),
    y: Math.max(5, Math.min(height - 5, y)),
  };
}
