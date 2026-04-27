"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  Users,
  Crown,
  AlertCircle,
  AlertTriangle,
  Calendar,
  BarChart3,
  Gift,
  CheckCircle,
  Zap,
  Target,
  ArrowRight,
  Clock,
  UserX,
  Activity,
  ShoppingCart,
  Search,
  Phone,
  Mail,
  Building2,
  Landmark,
} from "lucide-react";
import { useAdminAuth } from "../layout";

// ─── Types ───────────────────────────────────────────────────────

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

interface PackBuyerInfo {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  business_name: string | null;
  invoice_balance: number;
  total_packs_bought: number;
  last_purchase_date: string | null;
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
    pro?: number;
  };
  total_customers: number;
  paid_users: PaidUserInfo[];
  pack_buyers: PackBuyerInfo[];
}

interface MonthlyDataPoint {
  month: string;
  value: number;
}

interface ActivationFunnel {
  total_signups: number;
  created_first_invoice: number;
  received_first_payment: number;
  upgraded_to_paid: number;
}

interface GrowthMetrics {
  mrr: number;
  mrr_trend: MonthlyDataPoint[];
  arr: number;
  churned_users: number;
  churn_rate: number;
  activation_funnel: ActivationFunnel;
  collection_rate: number;
  avg_days_to_payment: number | null;
  user_growth: MonthlyDataPoint[];
  invoice_growth: MonthlyDataPoint[];
  revenue_growth: MonthlyDataPoint[];
  avg_invoices_per_user: number;
  power_users: number;
  zero_invoice_users: number;
  whatsapp_users: number;
  email_only_users: number;
  expired_subscriptions: number;
  expiring_soon: number;
}

// ─── Helpers ─────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `₦${(amount / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} '${year.slice(2)}`;
}

function isExpired(dateStr: string | null): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

function isExpiringSoon(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return d >= now && d <= sevenDays;
}

// ─── Components ──────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "emerald",
  alert,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color?: "emerald" | "blue" | "purple" | "orange" | "red" | "yellow";
  alert?: boolean;
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
    <div className={`rounded-xl border bg-white p-6 ${alert ? "border-red-300 ring-1 ring-red-100" : "border-slate-200"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className={`mt-1 text-sm ${alert ? "text-red-500 font-medium" : "text-slate-500"}`}>{subtitle}</p>
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

function FunnelStep({
  label,
  value,
  total,
  icon: Icon,
  color,
  isLast,
}: {
  label: string;
  value: number;
  total: number;
  icon: React.ElementType;
  color: string;
  isLast?: boolean;
}) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : "0";
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-bold text-slate-900">{value.toLocaleString()}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-slate-100">
            <div className={`h-1.5 rounded-full ${color.replace("/10", "")}`}
              style={{ width: `${Math.min(parseFloat(pct), 100)}%` }} />
          </div>
          <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
        </div>
      </div>
      {!isLast && <ArrowRight className="h-4 w-4 text-slate-300 shrink-0 hidden sm:block" />}
    </div>
  );
}

function MiniBarChart({ data, color = "bg-emerald-500", label = "" }: {
  data: MonthlyDataPoint[];
  color?: string;
  label?: string;
}) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      {label && <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>}
      <div className="flex gap-1 h-16">
        {data.map((d) => (
          <div key={d.month} className="flex-1 flex flex-col items-center justify-end">
            <div
              className={`w-full rounded-t ${color} transition-all`}
              style={{ height: `${Math.max((d.value / max) * 100, 4)}%` }}
              title={`${formatMonth(d.month)}: ${d.value.toLocaleString()}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1">
        {data.map((d) => (
          <div key={d.month} className="flex-1 text-center">
            <span className="text-[9px] text-slate-400">{formatMonth(d.month)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────

type Tab = "overview" | "growth" | "diagnostic";

// ─── Zero-Invoice Diagnostic Types ───────────────────────────────

interface ZeroInvoiceCohort {
  label: string;
  count: number;
  pct: number;
}

interface ZeroInvoiceUser {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  phone_verified: boolean;
  created_at: string;
  last_login: string | null;
  has_business_name: boolean;
  has_bank_details: boolean;
  has_logo: boolean;
  days_since_signup: number;
  login_count_bucket: string;
}

interface ZeroInvoiceDiagnostic {
  total_zero_invoice: number;
  total_signups: number;
  drop_off_rate: number;
  never_logged_back: ZeroInvoiceCohort;
  logged_in_once: ZeroInvoiceCohort;
  logged_in_multiple: ZeroInvoiceCohort;
  whatsapp_verified: ZeroInvoiceCohort;
  email_only: ZeroInvoiceCohort;
  has_business_name: ZeroInvoiceCohort;
  has_bank_details: ZeroInvoiceCohort;
  signed_up_today: ZeroInvoiceCohort;
  signed_up_1_3_days: ZeroInvoiceCohort;
  signed_up_4_7_days: ZeroInvoiceCohort;
  signed_up_8_14_days: ZeroInvoiceCohort;
  signed_up_15_30_days: ZeroInvoiceCohort;
  signed_up_over_30_days: ZeroInvoiceCohort;
  weekly_signup_vs_activation: { week: string; signups: number; activated: number; activation_rate: number }[];
  recent_zero_invoice_users: ZeroInvoiceUser[];
}

// ─── Page ────────────────────────────────────────────────────────

export default function MetricsPage() {
  const { token } = useAdminAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [growth, setGrowth] = useState<GrowthMetrics | null>(null);
  const [diagnostic, setDiagnostic] = useState<ZeroInvoiceDiagnostic | null>(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    async function fetchAll() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const [metricsRes, growthRes] = await Promise.all([
          fetch(`${apiUrl}/admin/metrics`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiUrl}/admin/metrics/growth`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!metricsRes.ok) throw new Error("Failed to fetch platform metrics");
        setMetrics(await metricsRes.json());

        if (growthRes.ok) {
          setGrowth(await growthRes.json());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [token]);

  // Fetch diagnostic data when tab is activated
  useEffect(() => {
    async function fetchDiagnostic() {
      if (!token || activeTab !== "diagnostic" || diagnostic) return;
      setDiagnosticLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const res = await fetch(`${apiUrl}/admin/metrics/zero-invoice-diagnostic`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDiagnostic(await res.json());
      } catch { /* ignore */ } finally {
        setDiagnosticLoading(false);
      }
    }
    fetchDiagnostic();
  }, [token, activeTab, diagnostic]);

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
        (metrics.active_subscriptions.pro || 0))
    : 0;
    
  const proCount = metrics?.active_subscriptions.pro || 0;
  const packBuyerCount = metrics?.pack_buyers?.length || 0;
    
  const referredPaidUsers = metrics?.paid_users?.filter(u => u.was_referred) || [];
  const directPaidUsers = metrics?.paid_users?.filter(u => !u.was_referred) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Metrics</h1>
        <p className="text-slate-500">Monitor overall platform performance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("growth")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "growth"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Growth Analytics
          {growth && (growth.expired_subscriptions > 0 || growth.expiring_soon > 0) && (
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              {growth.expired_subscriptions + growth.expiring_soon}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("diagnostic")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "diagnostic"
              ? "border-red-600 text-red-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Search className="h-4 w-4" />
          Drop-off Diagnostic
          {growth && growth.zero_invoice_users > 0 && (
            <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
              {growth.zero_invoice_users}
            </span>
          )}
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* ═══ OVERVIEW TAB ═══ */}

          {/* Subscription Health Alerts */}
          {growth && (growth.expired_subscriptions > 0 || growth.expiring_soon > 0) && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Subscription Health Alert</p>
                <p className="text-amber-700 mt-1">
                  {growth.expired_subscriptions > 0 && (
                    <span className="font-semibold text-red-600">{growth.expired_subscriptions} expired</span>
                  )}
                  {growth.expired_subscriptions > 0 && growth.expiring_soon > 0 && " · "}
                  {growth.expiring_soon > 0 && (
                    <span className="font-semibold text-amber-700">{growth.expiring_soon} expiring within 7 days</span>
                  )}
                  {" — check the Paid Subscribers table below for details."}
                </p>
              </div>
            </div>
          )}

          {/* Overview Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Registered Users"
              value={totalSubscribers.toLocaleString()}
              subtitle={`${metrics?.total_customers || 0} invoiced customers`}
              icon={Users}
            />
            <StatCard
              title="Total Invoices"
              value={metrics?.total_invoices?.toLocaleString() || "0"}
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

          {/* Collection Rate */}
          {growth && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-slate-600">Collection Rate</span>
              </div>
              <span className={`text-lg font-bold ${growth.collection_rate >= 50 ? "text-emerald-600" : growth.collection_rate >= 30 ? "text-amber-600" : "text-red-600"}`}>
                {growth.collection_rate}%
              </span>
            </div>
          )}
          {growth?.avg_days_to_payment && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">Avg. Days to Payment</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">{growth.avg_days_to_payment} days</span>
            </div>
          )}

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
              label="Free / Starter Users"
              value={metrics?.active_subscriptions.free || 0}
              total={totalSubscribers || 1}
              color="bg-slate-400"
            />
            <ProgressBar
              label="Invoice Pack Buyers"
              value={packBuyerCount}
              total={totalSubscribers || 1}
              color="bg-blue-500"
            />
            <ProgressBar
              label="Pro Plan"
              value={metrics?.active_subscriptions.pro || 0}
              total={totalSubscribers || 1}
              color="bg-purple-500"
            />
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Pro Users</p>
              <p className="text-2xl font-bold text-purple-600">{proCount}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Pack Buyers</p>
              <p className="text-2xl font-bold text-blue-600">{packBuyerCount}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-slate-50">
              <p className="text-sm text-slate-500">Pro Conversion</p>
              <p className="text-2xl font-bold text-emerald-600">
                {totalSubscribers > 0
                  ? ((proCount / totalSubscribers) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>

          {/* MRR Preview */}
          {growth && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-emerald-50">
                <p className="text-xs text-emerald-600">Monthly Recurring</p>
                <p className="text-lg font-bold text-emerald-700">₦{growth.mrr.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-purple-50">
                <p className="text-xs text-purple-600">ARR</p>
                <p className="text-lg font-bold text-purple-700">₦{growth.arr.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Pack Buyers Table */}
      {metrics?.pack_buyers && metrics.pack_buyers.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Invoice Pack Buyers</h3>
                <p className="text-sm text-slate-500">Free users who purchased invoice packs</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <span className="text-slate-600">Total: <strong className="text-blue-700">{packBuyerCount}</strong></span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Packs Bought</th>
                  <th className="px-6 py-3 font-medium">Balance</th>
                  <th className="px-6 py-3 font-medium">Last Purchase</th>
                </tr>
              </thead>
              <tbody>
                {metrics.pack_buyers.map((buyer) => (
                  <tr key={buyer.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{buyer.name}</div>
                      <div className="text-sm text-slate-500">{buyer.business_name || buyer.phone}</div>
                      {buyer.email && <div className="text-xs text-slate-400">{buyer.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {buyer.total_packs_bought} pack{buyer.total_packs_bought !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-emerald-600">{buyer.invoice_balance} invoices</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {buyer.last_purchase_date
                        ? new Date(buyer.last_purchase_date).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paid Users Table */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Pro Subscribers</h3>
              <p className="text-sm text-slate-500">Pro plan users with active subscriptions</p>
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
                  <tr key={user.id} className={`border-b border-slate-50 hover:bg-slate-50 ${
                    isExpired(user.subscription_expires_at) ? "bg-red-50/50" :
                    isExpiringSoon(user.subscription_expires_at) ? "bg-amber-50/50" : ""
                  }`}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-sm text-slate-500">{user.business_name || user.phone}</div>
                      {user.email && <div className="text-xs text-slate-400">{user.email}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                    <td className="px-6 py-4 text-sm">
                      {user.subscription_expires_at ? (
                        <span className={`inline-flex items-center gap-1 ${
                          isExpired(user.subscription_expires_at)
                            ? "text-red-600 font-semibold"
                            : isExpiringSoon(user.subscription_expires_at)
                            ? "text-amber-600 font-semibold"
                            : "text-slate-600"
                        }`}>
                          {isExpired(user.subscription_expires_at) && (
                            <AlertCircle className="h-3.5 w-3.5" />
                          )}
                          {isExpiringSoon(user.subscription_expires_at) && (
                            <AlertTriangle className="h-3.5 w-3.5" />
                          )}
                          {new Date(user.subscription_expires_at).toLocaleDateString()}
                          {isExpired(user.subscription_expires_at) && " (expired)"}
                          {isExpiringSoon(user.subscription_expires_at) && " (soon)"}
                        </span>
                      ) : (
                        "-"
                      )}
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
        </>
      ) : (
        <>
          {/* ═══ GROWTH ANALYTICS TAB ═══ */}

          {growth ? (
            <div className="space-y-6">
              {/* Revenue Health */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="MRR"
                  value={`₦${growth.mrr.toLocaleString()}`}
                  subtitle={`ARR: ₦${growth.arr.toLocaleString()}`}
                  icon={DollarSign}
                  color="emerald"
                />
                <StatCard
                  title="Churn Rate"
                  value={`${growth.churn_rate}%`}
                  subtitle={`${growth.churned_users} expired subscriptions`}
                  icon={growth.churn_rate > 10 ? TrendingDown : Activity}
                  color={growth.churn_rate > 10 ? "red" : growth.churn_rate > 5 ? "orange" : "emerald"}
                  alert={growth.churn_rate > 10}
                />
                <StatCard
                  title="Collection Rate"
                  value={`${growth.collection_rate}%`}
                  subtitle={growth.avg_days_to_payment ? `Avg. ${growth.avg_days_to_payment} days to pay` : "No data yet"}
                  icon={Target}
                  color={growth.collection_rate >= 50 ? "emerald" : growth.collection_rate >= 30 ? "orange" : "red"}
                />
                <StatCard
                  title="Avg. Invoices/User"
                  value={growth.avg_invoices_per_user}
                  subtitle={`${growth.power_users} power users (10+/mo)`}
                  icon={Zap}
                  color="purple"
                />
              </div>

              {/* Subscription Health Warnings */}
              {(growth.expired_subscriptions > 0 || growth.expiring_soon > 0) && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Subscription Health Warning</p>
                    <div className="mt-2 flex gap-6 text-sm">
                      {growth.expired_subscriptions > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-200 text-xs font-bold text-red-700">
                            {growth.expired_subscriptions}
                          </span>
                          <span className="text-red-700">Expired — need renewal outreach</span>
                        </div>
                      )}
                      {growth.expiring_soon > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-700">
                            {growth.expiring_soon}
                          </span>
                          <span className="text-amber-700">Expiring within 7 days</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Activation Funnel + Engagement */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Activation Funnel */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Activation Funnel</h3>
                      <p className="text-xs text-slate-500">Where are users dropping off?</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <FunnelStep
                      label="Signed Up"
                      value={growth.activation_funnel.total_signups}
                      total={growth.activation_funnel.total_signups}
                      icon={Users}
                      color="bg-slate-100 text-slate-600"
                    />
                    <FunnelStep
                      label="Created First Invoice"
                      value={growth.activation_funnel.created_first_invoice}
                      total={growth.activation_funnel.total_signups}
                      icon={FileText}
                      color="bg-blue-100 text-blue-600"
                    />
                    <FunnelStep
                      label="Received First Payment"
                      value={growth.activation_funnel.received_first_payment}
                      total={growth.activation_funnel.total_signups}
                      icon={DollarSign}
                      color="bg-emerald-100 text-emerald-600"
                    />
                    <FunnelStep
                      label="Upgraded to Paid Plan"
                      value={growth.activation_funnel.upgraded_to_paid}
                      total={growth.activation_funnel.total_signups}
                      icon={Crown}
                      color="bg-purple-100 text-purple-600"
                      isLast
                    />
                  </div>
                </div>

                {/* Engagement Health */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">Engagement Health</h3>
                      <p className="text-xs text-slate-500">User activity indicators</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 border border-red-100">
                      <div className="flex items-center gap-3">
                        <UserX className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="text-sm font-medium text-red-800">Zero-Invoice Users</p>
                          <p className="text-xs text-red-600">Signed up but never created an invoice</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-red-700">{growth.zero_invoice_users}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 border border-purple-100">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-purple-800">Power Users</p>
                          <p className="text-xs text-purple-600">10+ invoices this month</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-purple-700">{growth.power_users}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-emerald-800">Avg. Invoices/User</p>
                          <p className="text-xs text-emerald-600">Across all active users</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-emerald-700">{growth.avg_invoices_per_user}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">Avg. Days to Payment</p>
                          <p className="text-xs text-blue-600">From invoice created to paid</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-700">
                        {growth.avg_days_to_payment ?? "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Channel Segmentation */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Users className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">User Channels</h3>
                      <p className="text-xs text-slate-500">WhatsApp vs email-only users</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-green-800">WhatsApp Users</p>
                          <p className="text-xs text-green-600">Phone verified, connected to bot</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-700">{growth.whatsapp_users ?? 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-amber-800">Email-Only Users</p>
                          <p className="text-xs text-amber-600">No WhatsApp — limited engagement</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-amber-700">{growth.email_only_users ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Trend Charts */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-slate-900">User Growth</h3>
                  </div>
                  <MiniBarChart data={growth.user_growth} color="bg-blue-500" label="New signups per month" />
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-semibold text-slate-900">Invoice Growth</h3>
                  </div>
                  <MiniBarChart data={growth.invoice_growth} color="bg-emerald-500" label="Invoices created per month" />
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-slate-900">Revenue Growth</h3>
                  </div>
                  <MiniBarChart data={growth.revenue_growth} color="bg-purple-500" label="Paid revenue per month" />
                </div>
              </div>

              {/* MRR Trend */}
              {growth.mrr_trend.length > 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Subscription Revenue Trend</h3>
                      <p className="text-xs text-slate-500">Monthly subscription payments received</p>
                    </div>
                  </div>
                  <MiniBarChart data={growth.mrr_trend} color="bg-emerald-500" />
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-12 text-center">
              <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">Growth analytics loading...</p>
              <p className="text-sm text-slate-400 mt-1">This data requires the latest backend update.</p>
            </div>
          )}
        </>
      )}

      {/* ── Diagnostic Tab ── */}
      {activeTab === "diagnostic" && (
        <>
          {diagnosticLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
            </div>
          ) : diagnostic ? (
            <div className="space-y-6">
              {/* Top-level stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm font-medium text-red-700">Zero-Invoice Users</p>
                  <p className="text-3xl font-bold text-red-800 mt-1">{diagnostic.total_zero_invoice}</p>
                  <p className="text-xs text-red-600 mt-1">of {diagnostic.total_signups} signups</p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm font-medium text-red-700">Drop-off Rate</p>
                  <p className="text-3xl font-bold text-red-800 mt-1">{diagnostic.drop_off_rate}%</p>
                  <p className="text-xs text-red-600 mt-1">signed up → never created</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
                  <p className="text-sm font-medium text-amber-700">Recoverable</p>
                  <p className="text-3xl font-bold text-amber-800 mt-1">
                    {diagnostic.logged_in_once.count + diagnostic.logged_in_multiple.count}
                  </p>
                  <p className="text-xs text-amber-600 mt-1">came back but didn&apos;t create</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Engagement Buckets */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Activity className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Engagement After Signup</h3>
                      <p className="text-xs text-slate-500">Did they ever come back?</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[diagnostic.never_logged_back, diagnostic.logged_in_once, diagnostic.logged_in_multiple].map((c) => (
                      <div key={c.label} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-700">{c.label}</span>
                            <span className="font-semibold text-slate-900">{c.count} ({c.pct}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-400 rounded-full transition-all"
                              style={{ width: `${c.pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Breakdown */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="h-5 w-5 text-slate-500" />
                    <div>
                      <h3 className="font-semibold text-slate-900">Channel Breakdown</h3>
                      <p className="text-xs text-slate-500">WhatsApp vs email-only among zero-invoice</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">WhatsApp verified</span>
                      </div>
                      <span className="font-bold text-green-700">{diagnostic.whatsapp_verified.count} ({diagnostic.whatsapp_verified.pct}%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-amber-800">Email only</span>
                      </div>
                      <span className="font-bold text-amber-700">{diagnostic.email_only.count} ({diagnostic.email_only.pct}%)</span>
                    </div>
                  </div>

                  <hr className="my-4 border-slate-200" />

                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className="h-5 w-5 text-slate-500" />
                    <h4 className="font-medium text-slate-800 text-sm">Profile Completeness</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-800">Set business name</span>
                      </div>
                      <span className="font-bold text-blue-700">{diagnostic.has_business_name.count} ({diagnostic.has_business_name.pct}%)</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-800">Added bank details</span>
                      </div>
                      <span className="font-bold text-purple-700">{diagnostic.has_bank_details.count} ({diagnostic.has_bank_details.pct}%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signup Age Distribution */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-slate-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Signup Age Distribution</h3>
                    <p className="text-xs text-slate-500">How long ago did these users sign up?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { ...diagnostic.signed_up_today, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
                    { ...diagnostic.signed_up_1_3_days, color: "bg-blue-100 text-blue-700 border-blue-200" },
                    { ...diagnostic.signed_up_4_7_days, color: "bg-amber-100 text-amber-700 border-amber-200" },
                    { ...diagnostic.signed_up_8_14_days, color: "bg-orange-100 text-orange-700 border-orange-200" },
                    { ...diagnostic.signed_up_15_30_days, color: "bg-red-100 text-red-700 border-red-200" },
                    { ...diagnostic.signed_up_over_30_days, color: "bg-slate-100 text-slate-700 border-slate-200" },
                  ].map((b) => (
                    <div key={b.label} className={`rounded-lg border p-4 text-center ${b.color}`}>
                      <p className="text-2xl font-bold">{b.count}</p>
                      <p className="text-xs font-medium mt-1">{b.label}</p>
                      <p className="text-xs opacity-75">{b.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Signup vs Activation Trend */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Weekly Signup → Activation</h3>
                    <p className="text-xs text-slate-500">Are new signups converting? (last 8 weeks)</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-4 font-medium text-slate-600">Week of</th>
                        <th className="text-right py-2 px-4 font-medium text-slate-600">Signups</th>
                        <th className="text-right py-2 px-4 font-medium text-slate-600">Activated</th>
                        <th className="text-right py-2 px-4 font-medium text-slate-600">Rate</th>
                        <th className="py-2 pl-4 font-medium text-slate-600 w-32"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostic.weekly_signup_vs_activation.map((w) => (
                        <tr key={w.week} className="border-b border-slate-100">
                          <td className="py-2 pr-4 text-slate-700">{w.week}</td>
                          <td className="py-2 px-4 text-right font-medium text-slate-900">{w.signups}</td>
                          <td className="py-2 px-4 text-right font-medium text-emerald-700">{w.activated}</td>
                          <td className={`py-2 px-4 text-right font-bold ${w.activation_rate >= 40 ? "text-emerald-700" : w.activation_rate >= 20 ? "text-amber-700" : "text-red-700"}`}>
                            {w.activation_rate}%
                          </td>
                          <td className="py-2 pl-4">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${w.activation_rate >= 40 ? "bg-emerald-500" : w.activation_rate >= 20 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${Math.min(w.activation_rate, 100)}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Zero-Invoice Users */}
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-4">
                  <UserX className="h-5 w-5 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Recent Zero-Invoice Users</h3>
                    <p className="text-xs text-slate-500">Most recent signups who never created an invoice</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 pr-3 font-medium text-slate-600">User</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Channel</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Logins</th>
                        <th className="text-left py-2 px-3 font-medium text-slate-600">Profile</th>
                        <th className="text-right py-2 pl-3 font-medium text-slate-600">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostic.recent_zero_invoice_users.map((u) => (
                        <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-2 pr-3">
                            <p className="font-medium text-slate-900">{u.name || "—"}</p>
                            <p className="text-xs text-slate-500">{u.phone || u.email || `ID ${u.id}`}</p>
                          </td>
                          <td className="py-2 px-3">
                            {u.phone_verified ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                                <Phone className="h-3 w-3" /> WhatsApp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">
                                <Mail className="h-3 w-3" /> Email
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                              u.login_count_bucket === "never"
                                ? "bg-red-100 text-red-700"
                                : u.login_count_bucket === "once"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {u.login_count_bucket === "never" ? "Never returned" : u.login_count_bucket === "once" ? "Came back once" : "Multiple visits"}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex gap-1">
                              {u.has_business_name && (
                                <span title="Business name" className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600">
                                  <Building2 className="h-3 w-3" />
                                </span>
                              )}
                              {u.has_bank_details && (
                                <span title="Bank details" className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-50 text-purple-600">
                                  <Landmark className="h-3 w-3" />
                                </span>
                              )}
                              {!u.has_business_name && !u.has_bank_details && (
                                <span className="text-xs text-slate-400">Empty</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 pl-3 text-right text-xs text-slate-600">
                            {u.days_since_signup}d ago
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-12 text-center">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-600">Diagnostic data loading...</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
