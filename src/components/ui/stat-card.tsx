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
    <div className={`rounded-xl border border-brand-accentMuted/60 bg-brand-accent p-6 text-brand-primary ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-brand-primary/80">{label}</p>
          <p className="mt-2 text-3xl font-bold text-brand-primary">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center text-sm">
              <span className={trend.isPositive ? "text-emerald-600" : "text-red-600"}>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}
