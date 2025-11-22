import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyTrend } from "@/api/analytics";

interface MonthlyTrendsChartProps {
  trends: MonthlyTrend[];
  currency: "NGN" | "USD";
}

export function MonthlyTrendsChart({ trends, currency }: MonthlyTrendsChartProps) {
  const symbol = currency === "NGN" ? "₦" : "$";

  const formatAmount = (value: number) => {
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${symbol}${(value / 1000).toFixed(1)}K`;
    }
    return `${symbol}${value.toFixed(0)}`;
  };

  return (
    <div className="rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-brand-text">Monthly Trends</h3>
          <p className="text-xs text-brand-textMuted mt-1">Revenue, expenses, and profit over time</p>
        </div>
        <span className="text-2xl" role="img" aria-label="Chart">
          📈
        </span>
      </div>

      <div className="h-[300px] sm:h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trends} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              tickFormatter={formatAmount}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => formatAmount(value)}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", r: 4 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: "#f59e0b", r: 4 }}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-brand-border grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-brand-textMuted">Avg Revenue</p>
          <p className="text-sm font-bold text-emerald-600">
            {formatAmount(trends.reduce((sum, t) => sum + t.revenue, 0) / trends.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-brand-textMuted">Avg Expenses</p>
          <p className="text-sm font-bold text-amber-600">
            {formatAmount(trends.reduce((sum, t) => sum + t.expenses, 0) / trends.length)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-brand-textMuted">Avg Profit</p>
          <p className="text-sm font-bold text-blue-600">
            {formatAmount(trends.reduce((sum, t) => sum + t.profit, 0) / trends.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
