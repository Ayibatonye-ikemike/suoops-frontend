export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-white/10" />
        {/* Profile section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-white/10" />
              </div>
            ))}
          </div>
        </div>
        {/* Bank section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-36 animate-pulse rounded bg-white/10" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
                <div className="mt-2 h-10 w-full animate-pulse rounded-lg bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
