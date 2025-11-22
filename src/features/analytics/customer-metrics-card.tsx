import type { CustomerMetrics } from "@/api/analytics";

interface CustomerMetricsCardProps {
  metrics: CustomerMetrics;
}

export function CustomerMetricsCard({ metrics }: CustomerMetricsCardProps) {
  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-brand-text">Customer Metrics</h3>
        <span className="text-2xl" role="img" aria-label="Customers">
          👥
        </span>
      </div>

      {/* Repeat Rate */}
      <div className="mb-4 rounded-lg bg-purple-50 p-3 sm:p-4 border border-purple-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-900 opacity-80">
          Repeat Customer Rate
        </p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-purple-900">
          {metrics.repeat_customer_rate.toFixed(1)}%
        </p>
        <p className="mt-1 text-xs text-brand-textMuted">
          Customers with multiple invoices
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-textMuted">Total Customers</span>
          <span className="text-lg font-bold text-brand-text">
            {metrics.total_customers}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-textMuted">Active (Period)</span>
          <span className="text-lg font-bold text-brand-text">
            {metrics.active_customers}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-textMuted">New Customers</span>
          <span className="text-lg font-bold text-emerald-600">
            +{metrics.new_customers}
          </span>
        </div>
      </div>
    </div>
  );
}
