export default function BillingLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-white/10" />
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-4 w-48 animate-pulse rounded bg-white/10" />
          <div className="mt-6 h-10 w-40 animate-pulse rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}
