import type { InvoiceMetrics } from "@/api/analytics";

interface InvoiceMetricsCardProps {
  metrics: InvoiceMetrics;
}

export function InvoiceMetricsCard({ metrics }: InvoiceMetricsCardProps) {
  const stats = [
    { label: "Total", value: metrics.total_invoices, color: "text-brand-text" },
    { label: "Paid", value: metrics.paid_invoices, color: "text-emerald-600" },
    {
      label: "Pending",
      value: metrics.pending_invoices,
      color: "text-amber-600",
    },
    {
      label: "Awaiting",
      value: metrics.awaiting_confirmation,
      color: "text-blue-600",
    },
    { label: "Failed", value: metrics.failed_invoices, color: "text-rose-600" },
  ];

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-brand-text">
          Invoice Metrics
        </h3>
        <span className="text-2xl" role="img" aria-label="Invoice">
          📊
        </span>
      </div>

      {/* Conversion Rate */}
      <div className="mb-4 rounded-lg bg-brand-primary/5 p-3 sm:p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
          Conversion Rate
        </p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-brand-primary">
          {metrics.conversion_rate.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-brand-textMuted">
          {metrics.paid_invoices} paid of {metrics.total_invoices} created
        </p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between py-2 border-b border-brand-border last:border-0"
          >
            <span className="text-sm text-brand-textMuted">{stat.label}</span>
            <span className={`text-base sm:text-lg font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
