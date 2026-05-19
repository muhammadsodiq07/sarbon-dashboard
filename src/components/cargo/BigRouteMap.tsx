'use client';
import { Map } from 'lucide-react';
import { getRouteInfo, isRefrigerator, projectLatLng } from '@/lib/utils';
import { useT } from '@/hooks/useT';
import type { Cargo } from '@/types/cargo';

interface Props { items: Cargo[]; }

export function BigRouteMap({ items }: Props) {
  const t = useT();
  const W = 280, H = 220;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
          <Map className="h-3.5 w-3.5 text-emerald-600" />
          {t('map.title')}
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
          {items.length} {t('map.cargo_count')}
        </span>
      </div>
      <div className="relative h-[220px] bg-sky-50">
        <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
          {/* Continents */}
          <path d={`M0 50 Q 60 30, 140 50 T ${W} 40 L ${W} 130 Q 200 120, 140 130 T 0 125 Z`} fill="#dbeafe" opacity="0.5"/>
          <path d={`M0 130 Q 70 150, 160 135 T ${W} 140 L ${W} ${H} L 0 ${H} Z`} fill="#bfdbfe" opacity="0.4"/>
          {/* Country shapes (decorative) */}
          <path d="M30 60 L 80 40 L 130 65 L 100 110 Z" stroke="#94a3b8" strokeWidth="0.5" fill="#dbeafe" opacity="0.3"/>
          <path d="M130 65 L 200 50 L 240 90 L 180 130 L 100 110 Z" stroke="#94a3b8" strokeWidth="0.5" fill="#e0e7ff" opacity="0.3"/>
          <path d="M180 130 L 240 90 L 270 140 L 220 180 Z" stroke="#94a3b8" strokeWidth="0.5" fill="#fef3c7" opacity="0.3"/>

          {/* Routes for each cargo */}
          {items.map((cargo) => {
            const r = getRouteInfo(cargo);
            if (!r.origin || !r.destination || !r.origin.lat) return null;
            const a = projectLatLng(r.origin.lat, r.origin.lng, W, H);
            const b = projectLatLng(r.destination.lat, r.destination.lng, W, H);
            const isAdr = cargo.adr_enabled;
            const isNew = (Date.now() - new Date(cargo.created_at).getTime()) < 24 * 3600 * 1000;
            const color = isAdr ? '#d97706' : isNew ? '#10b981' : '#475569';

            return (
              <g key={cargo.id}>
                <path
                  d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 15}, ${b.x} ${b.y}`}
                  stroke={color}
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 3"
                  opacity="0.85"
                />
                <circle cx={a.x} cy={a.y} r="6" fill="white" stroke={color} strokeWidth="2.5"/>
                <circle cx={a.x} cy={a.y} r="2.5" fill={color}/>
                <circle cx={b.x} cy={b.y} r="6" fill={color}/>
                <circle cx={b.x} cy={b.y} r="2.5" fill="white"/>
                <text x={a.x + 9} y={a.y + 3} fontSize="9" fill={color} fontWeight="600">
                  {r.origin.country_code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[9px]">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-2 rounded bg-emerald-500"/>
            <span>{t('map.legend_new')}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-0.5 w-2 rounded bg-amber-500"/>
            <span>{t('map.legend_adr')}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-0.5 w-2 rounded bg-slate-500"/>
            <span>{t('map.legend_normal')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
