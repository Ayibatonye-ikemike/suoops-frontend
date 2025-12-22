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
  top_referrers: Array<{
    user_id: number;
    name: string;
    email: string | null;
    phone: string;
    referral_count: number;
  }>;
  referrals_today: number;
  referrals_this_week: number;
  referrals_this_month: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const res = await fetch(`${apiUrl}/admin/referrals/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch referral stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Referral Program</h1>
        <p className="text-slate-500">Monitor referral activity and rewards</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Referrals"
          value={stats?.total_referrals || 0}
          subtitle={`${stats?.completed_referrals || 0} completed`}
          icon={Users}
        />
        <StatCard
          title="Referral Codes"
          value={stats?.total_referral_codes || 0}
          subtitle="Active codes issued"
          icon={Gift}
          color="purple"
        />
        <StatCard
          title="Rewards Earned"
          value={stats?.total_rewards_earned || 0}
          subtitle={`${stats?.applied_rewards || 0} applied`}
          icon={Award}
          color="orange"
        />
        <StatCard
          title="This Month"
          value={stats?.referrals_this_month || 0}
          subtitle={`${stats?.referrals_today || 0} today`}
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
          <p className="text-sm text-slate-500">Users with the most completed referrals</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                <th className="px-6 py-3 font-medium">Rank</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium text-right">Referrals</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No referrals yet
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
