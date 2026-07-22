import type { AgingReport } from "@/api/analytics";

interface AgingReportCardProps {
  aging: AgingReport;
  currency: "NGN" | "USD";
}

export function AgingReportCard({ aging, currency }: AgingReportCardProps) {
  const symbol = currency === "NGN" ? "₦" : "$";

  const formatAmount = (value: number) => {
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const buckets = [
    {
      label: "Current (0-30 days)",
      value: aging.current,
      color: "text-emerald-600",
    },
    { label: "31-60 days", value: aging.days_31_60, color: "text-amber-600" },
    { label: "61-90 days", value: aging.days_61_90, color: "text-orange-600" },
    {
      label: "Over 90 days",
      value: aging.over_90_days,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-brand-text">
          Aging Report
        </h3>
        <span className="text-2xl" role="img" aria-label="Aging">
          📅
        </span>
      </div>

      {/* Total Outstanding — money owed to you (on-brand, not alarming) */}
      <div className="mb-4 rounded-lg bg-brand-background p-3 sm:p-4 border border-brand-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-jadeText opacity-90">
          Total Outstanding
        </p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold text-brand-evergreen break-words">
          {formatAmount(aging.total_outstanding)}
        </p>
        <p className="mt-1 text-xs text-brand-textMuted">Accounts receivable</p>
      </div>

      {/* Aging Buckets */}
      <div className="space-y-3">
        {buckets.map((bucket) => (
          <div key={bucket.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-brand-textMuted">
                {bucket.label}
              </span>
              <span className={`text-sm font-bold ${bucket.color}`}>
                {formatAmount(bucket.value)}
              </span>
            </div>
            <div className="h-2 bg-brand-background rounded-full overflow-hidden">
              <div
                className={`h-full ${bucket.color.replace("text-", "bg-")}`}
                style={{
                  width: `${
                    aging.total_outstanding > 0
                      ? (bucket.value / aging.total_outstanding) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
