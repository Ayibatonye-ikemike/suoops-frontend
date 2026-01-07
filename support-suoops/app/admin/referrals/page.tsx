"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Gift,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Award,
  Banknote,
  Download,
  Building2,
  CreditCard,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface ReferralStats {
  total_referral_codes: number;
  total_referrals: number;
  completed_referrals: number;
  pending_referrals: number;
  expired_referrals: number;
  free_signup_referrals: number;
  paid_referrals: number;
  total_rewards_earned: number;
  pending_rewards: number;
  applied_rewards: number;
  expired_rewards: number;
  // Commission/payout fields
  total_commission_earned: number;
  pending_payout_amount: number;
  users_with_payout_bank: number;
  top_referrers: Array<{
    user_id: number;
    name: string;
    email: string | null;
    phone: string;
    referral_count: number;
    commission_earned: number;
    payout_bank_name: string | null;
  }>;
  referrals_today: number;
  referrals_this_week: number;
  referrals_this_month: number;
}

interface PayoutUser {
  user_id: number;
  name: string;
  email: string | null;
  phone: string;
  payout_bank_name: string | null;
  payout_account_number: string | null;
  payout_account_name: string | null;
  paid_referrals: number;
  commission_amount: number;
  has_bank_details: boolean;
}

interface PayoutListResponse {
  total_users: number;
  total_amount: number;
  users_with_bank: number;
  users_without_bank: number;
  payouts: PayoutUser[];
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
  color?: "emerald" | "blue" | "purple" | "orange" | "red";
}) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
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

export default function ReferralsPage() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [payouts, setPayouts] = useState<PayoutListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "payouts">("overview");

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        
        // Fetch both stats and payouts in parallel
        const [statsRes, payoutsRes] = await Promise.all([
          fetch(`${apiUrl}/admin/referrals/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/admin/referrals/payouts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!statsRes.ok) throw new Error("Failed to fetch referral stats");
        if (!payoutsRes.ok) throw new Error("Failed to fetch payout data");
        
        const [statsData, payoutsData] = await Promise.all([
          statsRes.json(),
          payoutsRes.json(),
        ]);
        
        setStats(statsData);
        setPayouts(payoutsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  // Export payouts to CSV for bank transfers
  const exportPayoutsCSV = () => {
    if (!payouts?.payouts.length) return;
    
    const headers = ["Name", "Bank", "Account Number", "Account Name", "Pro Referrals", "Commission (₦)", "Phone", "Email"];
    const rows = payouts.payouts
      .filter(p => p.has_bank_details)
      .map(p => [
        p.name,
        p.payout_bank_name || "",
        p.payout_account_number || "",
        p.payout_account_name || "",
        p.paid_referrals.toString(),
        p.commission_amount.toString(),
        p.phone,
        p.email || "",
      ]);
    
    const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `referral-payouts-${new Date().toISOString().slice(0, 7)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Referral Program</h1>
          <p className="text-slate-500">Monitor referral activity and process payouts</p>
        </div>
        {activeTab === "payouts" && payouts && payouts.users_with_bank > 0 && (
          <button
            onClick={exportPayoutsCSV}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            Export CSV for Bank Transfer
          </button>
        )}
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
          onClick={() => setActiveTab("payouts")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "payouts"
              ? "border-emerald-600 text-emerald-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Banknote className="h-4 w-4" />
          Payouts
          {payouts && payouts.total_users > 0 && (
            <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-700">
              {payouts.total_users}
            </span>
          )}
        </button>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* Overview Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Referrals"
              value={stats?.total_referrals || 0}
              subtitle={`${stats?.completed_referrals || 0} completed`}
              icon={Users}
            />
            <StatCard
              title="Paid Referrals"
              value={stats?.paid_referrals || 0}
              subtitle="Pro subscribers referred"
              icon={Gift}
              color="purple"
            />
            <StatCard
              title="Commission Earned"
              value={`₦${((stats?.paid_referrals || 0) * 500).toLocaleString()}`}
              subtitle="₦500 per Pro referral"
              icon={Award}
              color="orange"
            />
            <StatCard
              title="Pending Payouts"
              value={`₦${(payouts?.total_amount || 0).toLocaleString()}`}
              subtitle={`${payouts?.users_with_bank || 0} users ready`}
              icon={TrendingUp}
              color="blue"
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Referral Status Breakdown */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Referral Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-slate-600">Completed</span>
                  </div>
                  <span className="font-semibold text-slate-900">{stats?.completed_referrals || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span className="text-slate-600">Pending</span>
                  </div>
                  <span className="font-semibold text-slate-900">{stats?.pending_referrals || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-slate-600">Expired</span>
              </div>
              <span className="font-semibold text-slate-900">{stats?.expired_referrals || 0}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-500 mb-3">By Type</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Free Signups</span>
                <span className="font-semibold text-slate-900">{stats?.free_signup_referrals || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Paid Subscriptions</span>
                <span className="font-semibold text-emerald-600">{stats?.paid_referrals || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Rewards Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-500" />
                <span className="text-slate-600">Pending Rewards</span>
              </div>
              <span className="font-semibold text-slate-900">{stats?.pending_rewards || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-slate-600">Applied Rewards</span>
              </div>
              <span className="font-semibold text-slate-900">{stats?.applied_rewards || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-500" />
                <span className="text-slate-600">Expired Rewards</span>
              </div>
              <span className="font-semibold text-slate-900">{stats?.expired_rewards || 0}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-500 mb-3">Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Today</span>
                <span className="font-semibold text-slate-900">{stats?.referrals_today || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">This Week</span>
                <span className="font-semibold text-slate-900">{stats?.referrals_this_week || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">This Month</span>
                <span className="font-semibold text-slate-900">{stats?.referrals_this_month || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Top Referrers</h3>
          <p className="text-sm text-slate-500">Users with the most Pro referrals (₦500 commission each)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium text-right">Pro Referrals</th>
                <th className="px-6 py-3 font-medium text-right">Commission</th>
                <th className="px-6 py-3 font-medium text-center">Payout Bank</th>
              </tr>
            </thead>
            <tbody>
              {stats?.top_referrers && stats.top_referrers.length > 0 ? (
                stats.top_referrers.map((referrer, idx) => (
                  <tr key={referrer.user_id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        idx === 0 ? "bg-yellow-100 text-yellow-700" :
                        idx === 1 ? "bg-slate-200 text-slate-700" :
                        idx === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{referrer.name}</div>
                      <div className="text-sm text-slate-500">ID: {referrer.user_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{referrer.phone}</div>
                      {referrer.email && (
                        <div className="text-sm text-slate-500">{referrer.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {referrer.referral_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-slate-900">
                        ₦{(referrer.commission_earned || referrer.referral_count * 500).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {referrer.payout_bank_name ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                          <Banknote className="h-3 w-3" />
                          {referrer.payout_bank_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                          <XCircle className="h-3 w-3" />
                          Not set
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No referrals yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      ) : (
        /* Payouts Tab */
        <div className="space-y-6">
          {/* Payout Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total to Pay"
              value={`₦${(payouts?.total_amount || 0).toLocaleString()}`}
              subtitle="This month"
              icon={Banknote}
              color="orange"
            />
            <StatCard
              title="Users with Bank"
              value={payouts?.users_with_bank || 0}
              subtitle="Ready for payout"
              icon={Building2}
            />
            <StatCard
              title="Missing Bank Details"
              value={payouts?.users_without_bank || 0}
              subtitle="Cannot pay yet"
              icon={CreditCard}
              color="red"
            />
            <StatCard
              title="Total Users"
              value={payouts?.total_users || 0}
              subtitle="With pending payouts"
              icon={Users}
              color="blue"
            />
          </div>

          {/* Payout List */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Pending Payouts</h3>
              <p className="text-sm text-slate-500">Users with commission to be paid this month</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Contact</th>
                    <th className="px-6 py-3 font-medium">Bank Details</th>
                    <th className="px-6 py-3 font-medium text-right">Pro Referrals</th>
                    <th className="px-6 py-3 font-medium text-right">Commission</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts?.payouts && payouts.payouts.length > 0 ? (
                    payouts.payouts.map((payout) => (
                      <tr key={payout.user_id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{payout.name}</div>
                          <div className="text-sm text-slate-500">ID: {payout.user_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-slate-600">{payout.phone}</div>
                          {payout.email && (
                            <div className="text-sm text-slate-500">{payout.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {payout.has_bank_details ? (
                            <div>
                              <div className="font-medium text-slate-900">{payout.payout_bank_name}</div>
                              <div className="text-sm text-slate-600">{payout.payout_account_number}</div>
                              <div className="text-sm text-slate-500">{payout.payout_account_name}</div>
                            </div>
                          ) : (
                            <span className="text-sm text-red-500 italic">Not provided</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                            {payout.paid_referrals}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-lg font-bold text-slate-900">
                            ₦{payout.commission_amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {payout.has_bank_details ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              <CheckCircle className="h-3 w-3" />
                              Ready
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600">
                              <XCircle className="h-3 w-3" />
                              Missing Bank
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No pending payouts this month
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Payout Instructions */}
            {payouts && payouts.users_with_bank > 0 && (
              <div className="border-t border-slate-100 px-6 py-4 bg-emerald-50">
                <h4 className="text-sm font-semibold text-emerald-800 mb-2">💡 How to Process Payouts</h4>
                <ol className="text-sm text-emerald-700 space-y-1 list-decimal list-inside">
                  <li>Click &quot;Export CSV for Bank Transfer&quot; to download the payout list</li>
                  <li>Upload the CSV to your bank&apos;s bulk transfer portal</li>
                  <li>Process payments to each user&apos;s bank account</li>
                  <li>Keep the CSV as a record of payments made</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
