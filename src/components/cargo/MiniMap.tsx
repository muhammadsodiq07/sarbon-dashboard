'use client';
import { projectLatLng } from '@/lib/utils';
import type { RoutePoint, WayPoint } from '@/types/cargo';

interface Props {
  origin?: RoutePoint | null;
  destination?: RoutePoint | null;
  waypoints?: WayPoint[];
  distanceKm: number;
  variant?: 'normal' | 'hot' | 'adr';
}

const VARIANTS = {
  normal: { stroke: '#475569', land: '#fde68a', sea: '#fef3c7', label: '#475569' },
  hot:    { stroke: '#059669', land: '#bbf7d0', sea: '#86efac', label: '#047857' },
  adr:    { stroke: '#d97706', land: '#fde68a', sea: '#fef3c7', label: '#b45309' },
};

export function MiniMap({ origin, destination, waypoints = [], distanceKm, variant = 'normal' }: Props) {
  const W = 95, H = 70;
  const v = VARIANTS[variant];

  // Fallback positions when no lat/lng
  let a = { x: 18, y: 22 }, b = { x: 78, y: 50 };
  if (origin && destination && origin.lat && destination.lat) {
    a = projectLatLng(origin.lat, origin.lng, W, H);
    b = projectLatLng(destination.lat, destination.lng, W, H);
  }

  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - 6;

  return (
    <div className="relative h-[70px] w-[95px] overflow-hidden rounded-md border border-blue-100 bg-blue-50">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* Land patches */}
        <path d={`M0 22 Q 25 18, 50 22 T ${W} 24 L ${W} 50 Q 75 48, 50 50 T 0 50 Z`} fill={v.land} opacity="0.5"/>
        <path d={`M0 50 L ${W} 54 L ${W} ${H} L 0 ${H} Z`} fill={v.sea} opacity="0.4"/>

        {/* Route */}
        <path
          d={`M ${a.x} ${a.y} Q ${mx} ${my}, ${b.x} ${b.y}`}
          stroke={v.stroke}
          strokeWidth="2"
          fill="none"
          strokeDasharray="3 2"
        />

        {/* Waypoints */}
        {waypoints.map((wp, i) => {
          if (!wp.lat) return null;
          const p = projectLatLng(wp.lat, wp.lng, W, H);
          return (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke={v.stroke} strokeWidth="1.5"/>
          );
        })}

        {/* Origin */}
        <circle cx={a.x} cy={a.y} r="5" fill="white" stroke={v.stroke} strokeWidth="2"/>
        <circle cx={a.x} cy={a.y} r="2" fill={v.stroke}/>

        {/* Destination */}
        <circle cx={b.x} cy={b.y} r="5" fill={v.stroke}/>
        <circle cx={b.x} cy={b.y} r="2" fill="white"/>
      </svg>
      {distanceKm > 0 && (
        <div
          className="absolute bottom-1 left-1 rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-bold"
          style={{ color: v.label }}
        >
          {distanceKm >= 1000 ? `${(distanceKm / 1000).toFixed(1)}k km` : `${distanceKm} km`}
        </div>
      )}
    </div>
  );
}
