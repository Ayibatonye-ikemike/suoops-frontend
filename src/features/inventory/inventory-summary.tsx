"use client";

import { useState } from "react";
import { Package, AlertTriangle, TrendingUp, Layers } from "lucide-react";
import { useInventorySummary, useLowStockAlerts } from "./use-inventory";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "danger" | "success";
}

function StatCard({ title, value, subtitle, icon, variant = "default" }: StatCardProps) {
  const bgColors = {
    default: "bg-white dark:bg-gray-800",
    warning: "bg-amber-50 dark:bg-amber-900/20",
    danger: "bg-red-50 dark:bg-red-900/20",
    success: "bg-brand-mint dark:bg-brand-jade/20",
  };

  const iconColors = {
    default: "text-brand-jade",
    warning: "text-amber-500",
    danger: "text-red-500",
    success: "text-brand-jade",
  };

  return (
    <div className={`rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 ${bgColors[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-700/50 ${iconColors[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function InventorySummaryCards() {
  const { data: summary, isLoading } = useInventorySummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(value);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Products"
        value={summary.active_products}
        subtitle={`${summary.categories_count} categories`}
        icon={<Package className="h-5 w-5" />}
      />
      <StatCard
        title="Stock Value"
        value={formatCurrency(summary.total_stock_value)}
        subtitle="At cost price"
        icon={<TrendingUp className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="Low Stock"
        value={summary.low_stock_count}
        subtitle="Need restocking"
        icon={<AlertTriangle className="h-5 w-5" />}
        variant={summary.low_stock_count > 0 ? "warning" : "default"}
      />
      <StatCard
        title="Out of Stock"
        value={summary.out_of_stock_count}
        subtitle="Unavailable"
        icon={<Layers className="h-5 w-5" />}
        variant={summary.out_of_stock_count > 0 ? "danger" : "default"}
      />
    </div>
  );
}

export function LowStockAlertsList() {
  const { data: alerts, isLoading } = useLowStockAlerts();
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />
          <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center gap-2 text-gray-500">
          <Package className="h-5 w-5" />
          <span>All products are well stocked!</span>
        </div>
      </div>
    );
  }

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 5);

  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="font-semibold text-amber-800 dark:text-amber-200">
          Low Stock Alerts ({alerts.length})
        </h3>
      </div>
      <div className="divide-y divide-amber-100 dark:divide-amber-800">
        {displayedAlerts.map((alert) => (
          <div key={alert.product_id} className="px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{alert.product_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {alert.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-amber-600 dark:text-amber-400">
                {alert.current_stock} {alert.unit}
              </p>
              <p className="text-xs text-gray-500">
                Reorder at: {alert.reorder_level} {alert.unit}
              </p>
            </div>
          </div>
        ))}
      </div>
      {alerts.length > 5 && (
        <div className="px-4 py-2 border-t border-amber-200 dark:border-amber-800">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
          >
            {showAll ? "Show less" : `Show all ${alerts.length} alerts`}
          </button>
        </div>
      )}
    </div>
  );
}
