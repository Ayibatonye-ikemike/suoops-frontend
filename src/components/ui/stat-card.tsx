interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, icon, trend, className = "" }: StatCardProps) {
  return (
    <div className={`rounded-2xl border border-brand-border bg-white p-6 text-brand-text shadow-sm ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-brand-textMuted uppercase tracking-wide">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-brand-primary">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm font-semibold">
              <span className={trend.isPositive ? "text-brand-statusPaidText" : "text-red-600"}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className="rounded-full bg-brand-primary/10 p-3 text-2xl text-brand-primary">{icon}</div>}
      </div>
    </div>
  );
}
