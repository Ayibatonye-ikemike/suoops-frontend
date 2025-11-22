import { useQuery } from "@tanstack/react-query";
import { getTopCustomers } from "@/api/analytics";

interface TopCustomersCardProps {
  period: "7d" | "30d" | "90d" | "1y" | "all";
  currency: "NGN" | "USD";
}

export function TopCustomersCard({ period, currency }: TopCustomersCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["topCustomers", period],
    queryFn: () => getTopCustomers(period, 10),
    staleTime: 60000,
  });

  const symbol = currency === "NGN" ? "₦" : "$";

  const formatAmount = (value: number) => {
    return `${symbol}${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-brand-text">Top Customers</h3>
          <p className="text-xs text-brand-textMuted mt-1">Highest revenue contributors</p>
        </div>
        <span className="text-2xl" role="img" aria-label="Trophy">
          🏆
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-brand-background" />
              <div className="flex-1">
                <div className="h-4 w-32 rounded bg-brand-background mb-2" />
                <div className="h-3 w-20 rounded bg-brand-background" />
              </div>
              <div className="h-4 w-24 rounded bg-brand-background" />
            </div>
          ))}
        </div>
      ) : data && data.customers.length > 0 ? (
        <div className="space-y-3">
          {data.customers.map((customer, index) => (
            <div
              key={customer.name}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-brand-background transition"
            >
              {/* Rank */}
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? "bg-amber-100 text-amber-900"
                    : index === 1
                    ? "bg-gray-100 text-gray-900"
                    : index === 2
                    ? "bg-orange-100 text-orange-900"
                    : "bg-brand-background text-brand-textMuted"
                }`}
              >
                {index + 1}
              </div>

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">
                  {customer.name}
                </p>
                <p className="text-xs text-brand-textMuted">
                  {customer.invoice_count} invoice{customer.invoice_count !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Revenue */}
              <div className="text-right">
                <p className="text-sm font-bold text-brand-primary">
                  {formatAmount(customer.total_revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-brand-textMuted">No customer data available</p>
        </div>
      )}
    </div>
  );
}
