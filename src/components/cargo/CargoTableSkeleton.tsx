function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded bg-gradient-to-r from-slate-100 via-slate-200/70 to-slate-100 [background-size:200%_100%] ${className ?? ''}`}/>
  );
}

export function CargoTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Loading" className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-3 lg:grid-cols-[95px_minmax(0,1.3fr)_1fr_130px_125px_auto] lg:items-center">
          <Shimmer className="hidden h-[70px] w-[95px] lg:block" />
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-28"/>
            <Shimmer className="h-3 w-20"/>
            <Shimmer className="h-3 w-24"/>
          </div>
          <div className="space-y-1.5">
            <Shimmer className="h-3 w-24"/>
            <Shimmer className="h-3 w-32"/>
          </div>
          <Shimmer className="h-5 w-20"/>
          <div className="flex items-center gap-2">
            <Shimmer className="h-8 w-8 rounded-full"/>
            <div className="flex-1 space-y-1">
              <Shimmer className="h-3 w-20"/>
              <Shimmer className="h-3 w-14"/>
            </div>
          </div>
          <div className="hidden gap-1 lg:flex">
            <Shimmer className="h-7 w-7"/>
            <Shimmer className="h-7 w-7"/>
            <Shimmer className="h-7 w-7"/>
          </div>
        </div>
      ))}
    </div>
  );
}
