import { useQuery } from "@tanstack/react-query";
import { getConversionFunnel } from "@/api/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ConversionFunnelCardProps {
  period: "7d" | "30d" | "90d" | "1y" | "all";
}

export function ConversionFunnelCard({ period }: ConversionFunnelCardProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["conversionFunnel", period],
    queryFn: () => getConversionFunnel(period),
    staleTime: 60000,
  });

  if (!data || isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-brand-background" />
          <div className="h-[250px] rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  const chartData = [
    { stage: "Created", count: data.funnel.created, color: "#3b82f6" },
    { stage: "Sent", count: data.funnel.sent, color: "#8b5cf6" },
    { stage: "Viewed", count: data.funnel.viewed, color: "#10b981" },
    { stage: "Awaiting", count: data.funnel.awaiting_confirmation, color: "#f59e0b" },
    { stage: "Paid", count: data.funnel.paid, color: "#059669" },
  ];

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-brand-text">Conversion Funnel</h3>
          <p className="text-xs text-brand-textMuted mt-1">Invoice journey from creation to payment</p>
        </div>
        <span className="text-2xl" role="img" aria-label="Funnel">
          🔄
        </span>
      </div>

      {/* Chart */}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="stage"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Rates */}
      <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-brand-textMuted">Sent → Viewed</p>
          <p className="text-lg font-bold text-emerald-600">
            {data.conversion_rates.sent_to_viewed.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-textMuted">Viewed → Paid</p>
          <p className="text-lg font-bold text-blue-600">
            {data.conversion_rates.viewed_to_paid.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-brand-textMuted">Overall</p>
          <p className="text-lg font-bold text-brand-primary">
            {data.conversion_rates.overall.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
