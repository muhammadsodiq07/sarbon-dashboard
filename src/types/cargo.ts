/**
 * Sarbon API real javobiga to'liq mos tiplar.
 * Envelope: { status, code, description, data: { items, total } }
 */

export type CargoStatus = 'SEARCHING_ALL' | 'SEARCHING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
export type TruckType = 'TENT' | 'BOX' | 'REF' | 'ISOTERM' | 'CONTAINER' | 'OPEN' | 'TRUCK' | 'TIPPER';
export type TrailerPlateType = 'TENTED' | 'BOX' | 'REF' | 'OPEN' | 'TANK' | 'CONTAINER';
export type LoadingType = 'SIDE' | 'REAR' | 'TOP' | 'FULL';
export type RoutePointType = 'LOAD' | 'UNLOAD';
export type WayPointType = 'TRANSIT' | 'CUSTOMS' | 'WAYPOINT';
export type PaymentMethod = 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ON_DELIVERY';
export type Currency = 'USD' | 'UZS' | 'RUB' | 'EUR' | 'KZT';

export interface CargoTypeRef {
  code: string;
  id: string;
  name_en?: string;
  name_ru?: string;
  name_tr?: string;
  name_uz?: string;
  name_zh?: string;
}

export interface RoutePoint {
  id: string;
  cargo_id: string;
  type: RoutePointType;
  point_order: number;
  city_code: string;
  city_name: string;
  country_code: string;
  address: string;
  orientir: string | null;
  comment: string | null;
  date: string | null;
  date_local: string | null;
  delivery_asap: boolean;
  is_main_load: boolean;
  is_main_unload: boolean;
  lat: number;
  lng: number;
  place_id?: string;
  region_code?: string;
  timezone: string | null;
  timezone_label?: string | null;
  ready_enabled: boolean;
  tz_offset: string | null;
}

export interface WayPoint {
  type: WayPointType;
  country_code: string;
  city_code?: string;
  address: string;
  lat: number;
  lng: number;
  comment?: string | null;
}

export interface PaymentItem {
  amount: number;
  currency: Currency;
  method: PaymentMethod;
}

export interface CargoPayment {
  cargo_id: string;
  id: string;
  is_negotiable: boolean;
  payment_note: string | null;
  payment_terms_note: string | null;
  with_prepayment: boolean;
  price_request: boolean;
  total_amount: number;
  total_currency: Currency;
  prepayment_amount: number;
  prepayment_currency: Currency;
  prepayment_type: PaymentMethod;
  prepayment_items: PaymentItem[];
  remaining_amount: number;
  remaining_currency: Currency;
  remaining_type: PaymentMethod;
  remaining_items: PaymentItem[];
}

export interface CargoDocuments {
  TIR?: boolean;
  GLONASS?: boolean;
  T1?: boolean;
  CMR?: boolean;
  Medbook?: boolean;
  Permit?: boolean;
}

export interface Cargo {
  id: string;
  name: string | null;
  comment: string | null;
  status: CargoStatus;
  cargo_type: CargoTypeRef | null;
  shipment_type: string | null;
  weight: number;
  volume: number;
  dimensions: string | null;
  packaging: string | null;
  packaging_amount: number | null;
  adr_enabled: boolean;
  adr_class: string | null;
  truck_type: TruckType;
  trailer_plate_type: TrailerPlateType | null;
  power_plate_type: string | null;
  loading_types: LoadingType[];
  unloading_types: LoadingType[];
  belts_count: number | null;
  is_two_drivers_required: boolean;
  vehicles_amount: number;
  vehicles_left: number;
  temp_min: number | null;
  temp_max: number | null;
  route_points: RoutePoint[];
  way_points: WayPoint[];
  payment: CargoPayment | null;
  contact_name: string;
  contact_phone: string;
  company_id: string | null;
  created_by_id: string;
  created_by_type: 'DISPATCHER' | 'CUSTOMER' | 'DRIVER';
  is_liked: boolean;
  documents: CargoDocuments | null;
  photos: string[];
  moderation_rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages?: number;
}

export interface SarbonResponse<T> {
  status: 'success' | 'error';
  code: number;
  description?: string;
  data: T;
}

export interface NormalizedCargoList {
  items: Cargo[];
  meta: PaginationMeta;
  totalAll?: number;
}

// FILTERS
export type CargoSort =
  | 'created_at:desc' | 'created_at:asc'
  | 'payment.total_amount:desc' | 'payment.total_amount:asc'
  | 'weight:desc' | 'weight:asc';

export interface CargoFilters {
  page: number;
  limit: number;
  sort: CargoSort;
  status: CargoStatus;
  from_city?: string;
  to_city?: string;
  truck_type?: TruckType | '';
  min_weight?: number | '';
  max_weight?: number | '';
  date_from?: string;
  // Switches
  is_liked?: boolean;
  has_offers?: boolean;
  is_refrigerator?: boolean;
  adr_enabled?: boolean;
  two_drivers?: boolean;
  search?: string;
}

export const DEFAULT_FILTERS: CargoFilters = {
  page: 1,
  limit: 20,
  sort: 'created_at:desc',
  status: 'SEARCHING_ALL',
};
