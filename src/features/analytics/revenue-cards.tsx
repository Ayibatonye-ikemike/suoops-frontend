import type { RevenueMetrics } from "@/api/analytics";

interface RevenueCardsProps {
  metrics: RevenueMetrics;
  currency: "NGN" | "USD";
}

export function RevenueCards({ metrics, currency }: RevenueCardsProps) {
  const symbol = currency === "NGN" ? "₦" : "$";

  const formatAmount = (value: number) => {
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatAmount(metrics.total_revenue),
      subtitle: `Avg: ${formatAmount(metrics.average_invoice_value)}/invoice`,
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-900",
      iconColor: "text-blue-600",
      icon: "💰",
    },
    {
      title: "Paid Revenue",
      value: formatAmount(metrics.paid_revenue),
      subtitle: `${
        metrics.growth_rate >= 0 ? "+" : ""
      }${metrics.growth_rate.toFixed(1)}% vs prev period`,
      color: "bg-emerald-50 border-emerald-200",
      textColor: "text-emerald-900",
      iconColor: "text-emerald-600",
      icon: "✅",
      growth: metrics.growth_rate,
    },
    {
      title: "Pending Revenue",
      value: formatAmount(metrics.pending_revenue),
      subtitle: "Awaiting payment",
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-900",
      iconColor: "text-amber-600",
      icon: "⏳",
    },
    {
      title: "Overdue Revenue",
      value: formatAmount(metrics.overdue_revenue),
      subtitle: "Past due date",
      color: "bg-rose-50 border-rose-200",
      textColor: "text-rose-900",
      iconColor: "text-rose-600",
      icon: "⚠️",
    },
  ];

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg border ${card.color} p-4 sm:p-6 shadow-card transition hover:shadow-lg`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p
                className={`text-xs sm:text-sm font-semibold uppercase tracking-wide ${card.textColor} opacity-80`}
              >
                {card.title}
              </p>
              <p
                className={`mt-2 text-xl sm:text-2xl lg:text-3xl font-bold ${card.textColor} truncate`}
              >
                {card.value}
              </p>
              <p className="mt-1 text-xs text-brand-textMuted">
                {card.subtitle}
              </p>
            </div>
            <span
              className="text-2xl sm:text-3xl"
              role="img"
              aria-label={card.title}
            >
              {card.icon}
            </span>
          </div>

          {card.growth !== undefined && (
            <div className="mt-3 pt-3 border-t border-emerald-200">
              <div className="flex items-center gap-1 text-xs font-medium">
                <span
                  className={
                    card.growth >= 0 ? "text-emerald-600" : "text-rose-600"
                  }
                >
                  {card.growth >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(card.growth).toFixed(1)}%
                </span>
                <span className="text-brand-textMuted">growth</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
