export default function InvoicesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-white/10" />
        </div>
        {/* Status card skeleton */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
        </div>
        {/* Invoice rows skeleton */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                <div className="h-6 w-20 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
