'use client';
import { Grid3x3, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import { useT } from '@/hooks/useT';
import { getTotalPrice, isNewCargo } from '@/lib/utils';
import type { Cargo, PaginationMeta } from '@/types/cargo';

interface Props {
  data?: { items: Cargo[]; meta: PaginationMeta };
  isLoading: boolean;
}

function Sparkline({ values, color, type = 'line' }: { values: number[]; color: string; type?: 'line' | 'bar' }) {
  const max = Math.max(...values, 1);
  const w = 48, h = 22;
  if (type === 'bar') {
    const bw = (w - 6) / values.length;
    return (
      <svg width={w} height={h} className="absolute right-3 bottom-3 opacity-50">
        {values.map((v, i) => {
          const bh = (v / max) * (h - 2);
          return <rect key={i} x={i * (bw + 1)} y={h - bh} width={bw} height={bh} fill={color} rx="1"/>;
        })}
      </svg>
    );
  }
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="absolute right-3 bottom-3 opacity-50">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}

function StatCard({ iconBg, icon, label, value, hint, hintColor, spark, sparkColor, sparkType }: {
  iconBg: string; icon: React.ReactNode; label: string; value: string | number;
  hint: string; hintColor?: string; spark: number[]; sparkColor: string; sparkType?: 'line' | 'bar';
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 transition-transform">
      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
        <span className={`flex h-5 w-5 items-center justify-center rounded-md text-white ${iconBg}`}>
          {icon}
        </span>
        {label}
      </div>
      <div className="mt-1.5 text-[26px] font-bold leading-none tracking-tight text-slate-900">{value}</div>
      <div className={`mt-1.5 text-[11px] font-medium ${hintColor ?? 'text-emerald-600'}`}>{hint}</div>
      <Sparkline values={spark} color={sparkColor} type={sparkType}/>
    </div>
  );
}

export function CargoStats({ data, isLoading }: Props) {
  const t = useT();
  const items = data?.items ?? [];
  const total = items.length;
  const newCount = items.filter(c => isNewCargo(c.created_at)).length;
  const adrCount = items.filter(c => c.adr_enabled).length;
  const usdItems = items.filter(c => getTotalPrice(c).currency === 'USD');
  const avgPrice = usdItems.length > 0
    ? Math.round(usdItems.reduce((s, c) => s + getTotalPrice(c).amount, 0) / usdItems.length)
    : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="h-[100px] animate-pulse rounded-xl border border-slate-200 bg-white" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <StatCard
        iconBg="bg-gradient-to-br from-emerald-500 to-emerald-700"
        icon={<Grid3x3 className="h-3 w-3" strokeWidth={2.5}/>}
        label={t('stats.total')}
        value={total}
        hint={`↑ +${newCount} ${t('stats.today')}`}
        spark={[3,5,4,6,5,8,7,9]}
        sparkColor="#10b981"
      />
      <StatCard
        iconBg="bg-gradient-to-br from-blue-500 to-blue-700"
        icon={<Clock className="h-3 w-3" strokeWidth={2.5}/>}
        label={t('stats.new')}
        value={newCount}
        hint={`↑ ${t('stats.high_activity')}`}
        spark={[2,3,4,3,5,7,6,8]}
        sparkColor="#3b82f6"
        sparkType="bar"
      />
      <StatCard
        iconBg="bg-gradient-to-br from-amber-500 to-amber-700"
        icon={<AlertTriangle className="h-3 w-3" strokeWidth={2.5}/>}
        label={t('stats.adr')}
        value={adrCount}
        hint={`⚠ ${t('stats.dangerous')}`}
        hintColor="text-amber-700"
        spark={[1,1,2,1,1,1,2,1]}
        sparkColor="#f59e0b"
      />
      <StatCard
        iconBg="bg-gradient-to-br from-violet-500 to-violet-700"
        icon={<DollarSign className="h-3 w-3" strokeWidth={2.5}/>}
        label={t('stats.avg_price')}
        value={avgPrice > 0 ? `$${avgPrice.toLocaleString()}` : '—'}
        hint="USD"
        hintColor="text-slate-500"
        spark={[5,6,5,7,6,8,7,9]}
        sparkColor="#a78bfa"
      />
    </div>
  );
}
