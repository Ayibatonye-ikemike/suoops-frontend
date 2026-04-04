export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-white/10" />
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-7 w-24 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
        {/* Chart placeholder */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-6 h-48 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
