"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Crown,
  AlertCircle,
  Calendar,
  BarChart3,
  Gift,
  CheckCircle,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface PaidUserInfo {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  plan: string;
  business_name: string | null;
  created_at: string;
  subscription_started_at: string | null;
  subscription_expires_at: string | null;
  was_referred: boolean;
  referred_by_name: string | null;
  referred_by_id: number | null;
}

interface PlatformMetrics {
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  cancelled_invoices: number;
  total_revenue_amount: number;
  total_expense_amount: number;
  invoices_today: number;
  invoices_this_week: number;
  invoices_this_month: number;
  active_subscriptions: {
    free?: number;
    starter?: number;
    pro?: number;
    business?: number;
  };
  total_customers: number;
  paid_users: PaidUserInfo[];
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
    ? ((metrics.active_subscriptions.free || 0) +
        (metrics.active_subscriptions.starter || 0) +
        (metrics.active_subscriptions.pro || 0) +
        (metrics.active_subscriptions.business || 0))
    : 0;
    
  const paidCount = metrics
    ? ((metrics.active_subscriptions.pro || 0) +
        (metrics.active_subscriptions.business || 0))
    : 0;
    
  const referredPaidUsers = metrics?.paid_users?.filter(u => u.was_referred) || [];
  const directPaidUsers = metrics?.paid_users?.filter(u => !u.was_referred) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Metrics</h1>
        <p className="text-slate-500">Monitor overall platform performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={metrics?.total_customers?.toLocaleString() || 0}
          subtitle={`${totalSubscribers} users`}
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
          title="Revenue Tracked"
          value={formatCurrency(metrics?.total_revenue_amount || 0)}
          subtitle="From paid invoices"
          icon={DollarSign}
          color="emerald"
        />
        <StatCard
          title="Expenses Tracked"
          value={formatCurrency(metrics?.total_expense_amount || 0)}
          subtitle="Across platform"
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
              label="Pending Invoices"
              value={metrics?.pending_invoices || 0}
              total={metrics?.total_invoices || 1}
              color="bg-yellow-500"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Today</span>
                <span className="font-semibold text-slate-900">{metrics?.invoices_today || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">This Week</span>
                <span className="font-semibold text-slate-900">{metrics?.invoices_this_week || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">This Month</span>
                <span className="font-bold text-emerald-600">{metrics?.invoices_this_month || 0}</span>
              </div>
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
              value={metrics?.active_subscriptions.free || 0}
              total={totalSubscribers || 1}
              color="bg-slate-400"
            />
            <ProgressBar
              label="Starter Plan"
              value={metrics?.active_subscriptions.starter || 0}
              total={totalSubscribers || 1}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Pro Plan"
              value={metrics?.active_subscriptions.pro || 0}
              total={totalSubscribers || 1}
              color="bg-purple-500"
            />
            <ProgressBar
              label="Business Plan"
              value={metrics?.active_subscriptions.business || 0}
              total={totalSubscribers || 1}
              color="bg-emerald-500"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Paying Users</p>
              <p className="text-2xl font-bold text-emerald-600">{paidCount}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalSubscribers > 0
                  ? ((paidCount / totalSubscribers) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Paid Users Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Paid Subscribers</h3>
              <p className="text-sm text-slate-500">Pro and Business plan users</p>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-purple-500" />
                <span className="text-slate-600">Referred: <strong className="text-purple-700">{referredPaidUsers.length}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-slate-600">Direct: <strong className="text-emerald-700">{directPaidUsers.length}</strong></span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium">Subscribed</th>
                <th className="px-6 py-3 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.paid_users && metrics.paid_users.length > 0 ? (
                metrics.paid_users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.business_name || user.phone}</div>
                      {user.email && <div className="text-xs text-slate-400">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.plan === "business" ? "bg-emerald-100 text-emerald-700" :
                        user.plan === "pro" ? "bg-purple-100 text-purple-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {user.plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.was_referred ? (
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-purple-500" />
                          <div>
                            <span className="text-purple-700 font-medium">Referral</span>
                            {user.referred_by_name && (
                              <div className="text-xs text-slate-500">by {user.referred_by_name}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-emerald-700 font-medium">Direct</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.subscription_started_at
                        ? new Date(user.subscription_started_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.subscription_expires_at
                        ? new Date(user.subscription_expires_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No paid subscribers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
