"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Copy, Gift, Users, Trophy, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ReferralStats {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  pending_referrals: number;
  free_signups: number;
  paid_signups: number;
  rewards_earned: number;
  pending_rewards: number;
  pending_rewards_list: Array<{
    id: number;
    description: string;
    expires_at: string | null;
  }>;
  progress: {
    free_signups: {
      current: number;
      required: number;
      remaining: number;
    };
    paid_signups: {
      current: number;
      required: number;
      remaining: number;
    };
  };
}

interface RecentReferral {
  id: number;
  referred_name: string;
  type: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export default function ReferralsPage() {
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ["referralStats"],
    queryFn: async () => {
      const response = await apiClient.get<ReferralStats>("/referrals/stats");
      return response.data;
    },
  });

  const { data: recentReferrals, isLoading: referralsLoading } = useQuery<RecentReferral[]>({
    queryKey: ["recentReferrals"],
    queryFn: async () => {
      const response = await apiClient.get<RecentReferral[]>("/referrals/recent");
      return response.data;
    },
  });

  const applyRewardMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const response = await apiClient.post("/referrals/apply-reward", {
        reward_id: rewardId,
      });
      return response.data;
    },
    onSuccess: (data: { message: string }) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["referralStats"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to apply reward");
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-brand-border/30 rounded w-48" />
            <div className="h-64 bg-brand-border/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-10 text-brand-text">
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl font-bold text-brand-text flex items-center gap-3">
            <Gift className="w-6 h-6 text-emerald-400" />
            Refer & Earn
          </h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            Invite friends and earn free months of SuoOps!
          </p>
        </div>

        {/* Referral Code Card */}
        <Card className="mb-6 bg-gradient-to-br from-emerald-900/40 to-brand-surface border-emerald-700/40">
          <CardHeader className="border-b border-emerald-700/40 px-4 sm:px-6">
            <h3 className="text-lg sm:text-[22px] font-semibold text-white">
              Your Referral Code
            </h3>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Code Display */}
              <div className="flex-1">
                <div className="bg-brand-bg/60 rounded-lg px-4 py-3 flex items-center justify-between">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400 tracking-wider">
                    {stats?.referral_code}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(stats?.referral_code || "")}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    {copiedCode ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mt-6 p-4 bg-brand-bg/40 rounded-lg">
              <h3 className="font-semibold text-white mb-3">How it works</h3>
              <div className="grid gap-3 text-sm text-brand-textMuted">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    1
                  </div>
                  <span>Share your referral code or link with friends</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    2
                  </div>
                  <span>When 8 friends sign up, you get 1 month free Starter plan</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    3
                  </div>
                  <span>When 2 friends subscribe to paid plans, you also get 1 month free!</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="bg-brand-surface/60">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.total_referrals || 0}</div>
              <div className="text-xs text-brand-textMuted">Total Referrals</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-surface/60">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.pending_referrals || 0}</div>
              <div className="text-xs text-brand-textMuted">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-surface/60">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.rewards_earned || 0}</div>
              <div className="text-xs text-brand-textMuted">Rewards Earned</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-surface/60">
            <CardContent className="p-4 text-center">
              <Gift className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.pending_rewards || 0}</div>
              <div className="text-xs text-brand-textMuted">Ready to Claim</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Reward */}
        <Card className="mb-6">
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h3 className="text-lg font-semibold text-brand-text">
              Progress to Next Reward
            </h3>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 space-y-4">
            {/* Free Signups Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-textMuted">Free Signups</span>
                <span className="text-white">
                  {stats?.progress?.free_signups?.current || 0} / {stats?.progress?.free_signups?.required || 8}
                </span>
              </div>
              <div className="h-2 bg-brand-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats?.progress?.free_signups?.current || 0) / (stats?.progress?.free_signups?.required || 8)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-brand-textMuted mt-1">
                {stats?.progress?.free_signups?.remaining || 8} more signups for 1 month free
              </p>
            </div>

            {/* Paid Signups Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-textMuted">Paid Subscriptions</span>
                <span className="text-white">
                  {stats?.progress?.paid_signups?.current || 0} / {stats?.progress?.paid_signups?.required || 2}
                </span>
              </div>
              <div className="h-2 bg-brand-border/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${((stats?.progress?.paid_signups?.current || 0) / (stats?.progress?.paid_signups?.required || 2)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-xs text-brand-textMuted mt-1">
                {stats?.progress?.paid_signups?.remaining || 2} more paid referrals for 1 month free
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Rewards */}
        {stats?.pending_rewards_list && stats.pending_rewards_list.length > 0 && (
          <Card className="mb-6 border-emerald-700/40 bg-emerald-900/20">
            <CardHeader className="border-b border-emerald-700/40 px-4 sm:px-6">
              <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Rewards Ready to Claim!
              </h3>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="space-y-3">
                {stats.pending_rewards_list.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex items-center justify-between p-3 bg-brand-bg/40 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{reward.description}</p>
                      {reward.expires_at && (
                        <p className="text-xs text-brand-textMuted">
                          Expires: {new Date(reward.expires_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => applyRewardMutation.mutate(reward.id)}
                      disabled={applyRewardMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {applyRewardMutation.isPending ? "Claiming..." : "Claim"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Referrals */}
        <Card>
          <CardHeader className="border-b border-brand-border/60 px-4 sm:px-6">
            <h3 className="text-lg font-semibold text-brand-text">
              Recent Referrals
            </h3>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            {referralsLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-brand-border/30 rounded" />
                ))}
              </div>
            ) : recentReferrals && recentReferrals.length > 0 ? (
              <div className="space-y-3">
                {recentReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-3 bg-brand-bg/40 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-border/40 flex items-center justify-center text-brand-textMuted">
                        {referral.referred_name[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-white">{referral.referred_name}</p>
                        <p className="text-xs text-brand-textMuted">
                          {new Date(referral.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          referral.type === "paid_signup"
                            ? "bg-emerald-900/40 text-emerald-400"
                            : "bg-blue-900/40 text-blue-400"
                        }`}
                      >
                        {referral.type === "paid_signup" ? "Paid" : "Free"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          referral.status === "completed"
                            ? "bg-emerald-900/40 text-emerald-400"
                            : referral.status === "pending"
                            ? "bg-amber-900/40 text-amber-400"
                            : "bg-red-900/40 text-red-400"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-brand-textMuted">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No referrals yet</p>
                <p className="text-sm mt-1">Share your code to start earning rewards!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
