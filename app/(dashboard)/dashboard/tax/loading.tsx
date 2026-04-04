export default function TaxLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-white/10" />
        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-7 w-28 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
        {/* Report rows */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-8 w-24 animate-pulse rounded-lg bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
