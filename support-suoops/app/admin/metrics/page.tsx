"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Crown,
  Briefcase,
  AlertCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface PlatformMetrics {
  total_invoices: number;
  paid_invoices: number;
  unpaid_invoices: number;
  overdue_invoices: number;
  cancelled_invoices: number;
  total_revenue: number;
  paid_revenue: number;
  outstanding_revenue: number;
  total_expenses: number;
  total_users: number;
  subscription_distribution: {
    free: number;
    basic: number;
    pro: number;
    business: number;
  };
  invoices_this_month: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "emerald",
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow";
}) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function MetricsPage() {
  const { token } = useAdminAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetrics() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const res = await fetch(`${apiUrl}/admin/metrics`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch platform metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const totalSubscribers = metrics
    ? (metrics.subscription_distribution.free +
        metrics.subscription_distribution.basic +
        metrics.subscription_distribution.pro +
        metrics.subscription_distribution.business)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Metrics</h1>
        <p className="text-slate-500">Monitor overall platform performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={metrics?.total_users?.toLocaleString() || 0}
          subtitle={`${metrics?.invoices_this_month || 0} invoices this month`}
          icon={Users}
        />
        <StatCard
          title="Total Invoices"
          value={metrics?.total_invoices?.toLocaleString() || 0}
          subtitle={`${metrics?.paid_invoices || 0} paid`}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(metrics?.total_revenue || 0)}
          subtitle={`${formatCurrency(metrics?.paid_revenue || 0)} collected`}
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(metrics?.total_expenses || 0)}
          subtitle="Tracked across platform"
          icon={Receipt}
          color="orange"
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoice Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-900">Invoice Status</h3>
          </div>
          <div className="space-y-5">
            <ProgressBar
              label="Paid Invoices"
              value={metrics?.paid_invoices || 0}
              total={metrics?.total_invoices || 1}
              color="bg-green-500"
            />
            <ProgressBar
              label="Unpaid Invoices"
              value={metrics?.unpaid_invoices || 0}
              total={metrics?.total_invoices || 1}
              color="bg-yellow-500"
            />
            <ProgressBar
              label="Overdue Invoices"
              value={metrics?.overdue_invoices || 0}
              total={metrics?.total_invoices || 1}
              color="bg-red-500"
            />
            <ProgressBar
              label="Cancelled Invoices"
              value={metrics?.cancelled_invoices || 0}
              total={metrics?.total_invoices || 1}
              color="bg-slate-400"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-slate-500" />
              <h4 className="font-medium text-slate-900">Activity</h4>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Invoices This Month</span>
              <span className="font-bold text-emerald-600">{metrics?.invoices_this_month || 0}</span>
            </div>
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="h-5 w-5 text-slate-500" />
            <h3 className="text-lg font-semibold text-slate-900">Subscription Plans</h3>
          </div>
          <div className="space-y-5">
            <ProgressBar
              label="Free Users"
              value={metrics?.subscription_distribution.free || 0}
              total={totalSubscribers || 1}
              color="bg-slate-400"
            />
            <ProgressBar
              label="Basic Plan"
              value={metrics?.subscription_distribution.basic || 0}
              total={totalSubscribers || 1}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Pro Plan"
              value={metrics?.subscription_distribution.pro || 0}
              total={totalSubscribers || 1}
              color="bg-purple-500"
            />
            <ProgressBar
              label="Business Plan"
              value={metrics?.subscription_distribution.business || 0}
              total={totalSubscribers || 1}
              color="bg-emerald-500"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Paying Users</p>
              <p className="text-2xl font-bold text-emerald-600">
                {((metrics?.subscription_distribution.basic || 0) +
                  (metrics?.subscription_distribution.pro || 0) +
                  (metrics?.subscription_distribution.business || 0)).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalSubscribers > 0
                  ? (
                      (((metrics?.subscription_distribution.basic || 0) +
                        (metrics?.subscription_distribution.pro || 0) +
                        (metrics?.subscription_distribution.business || 0)) /
                        totalSubscribers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-5 w-5 text-slate-500" />
          <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
            <p className="text-sm font-medium text-green-600 mb-2">Collected Revenue</p>
            <p className="text-3xl font-bold text-green-700">
              {formatCurrency(metrics?.paid_revenue || 0)}
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-yellow-50 border border-yellow-100">
            <p className="text-sm font-medium text-yellow-600 mb-2">Outstanding Revenue</p>
            <p className="text-3xl font-bold text-yellow-700">
              {formatCurrency(metrics?.outstanding_revenue || 0)}
            </p>
          </div>
          <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-sm font-medium text-blue-600 mb-2">Total Tracked</p>
            <p className="text-3xl font-bold text-blue-700">
              {formatCurrency(metrics?.total_revenue || 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
