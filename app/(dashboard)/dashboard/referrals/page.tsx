"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Copy, Gift, Users, Trophy, Clock, CheckCircle2, Banknote, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NIGERIAN_BANKS } from "@/features/settings/bank-details-form.constants";

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
  commission: {
    rate_percentage: number;
    amount_per_referral: number;
    total_earned: number;
    payout_schedule: string;
  };
  progress: {
    paid_signups: {
      current: number;
      earnings: number;
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

interface PayoutBankDetails {
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  is_complete: boolean;
}

export default function ReferralsPage() {
  const queryClient = useQueryClient();
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Payout bank form state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const bankInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<ReferralStats>({
    queryKey: ["referralStats"],
    queryFn: async () => {
      const response = await apiClient.get<ReferralStats>("/referrals/stats");
      return response.data;
    },
  });

  const { data: payoutBank } = useQuery<PayoutBankDetails>({
    queryKey: ["payoutBankDetails"],
    queryFn: async () => {
      const response = await apiClient.get<PayoutBankDetails>("/referrals/payout-bank");
      return response.data;
    },
  });

  // Populate form when data loads
  useEffect(() => {
    if (payoutBank) {
      setBankName(payoutBank.bank_name || "");
      setAccountNumber(payoutBank.account_number || "");
      setAccountName(payoutBank.account_name || "");
    }
  }, [payoutBank]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        bankInputRef.current &&
        !bankInputRef.current.contains(event.target as Node)
      ) {
        setShowBankDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const updatePayoutBankMutation = useMutation({
    mutationFn: async (data: { bank_name: string; account_number: string; account_name: string }) => {
      const response = await apiClient.patch("/referrals/payout-bank", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Payout bank details saved!");
      queryClient.invalidateQueries({ queryKey: ["payoutBankDetails"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save bank details");
    },
  });

  const filteredBanks = NIGERIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleBankSelect = (bank: string) => {
    setBankName(bank);
    setBankSearch("");
    setShowBankDropdown(false);
  };

  const handleSavePayoutBank = () => {
    if (!bankName || !accountNumber || !accountName) {
      toast.error("Please fill in all bank details");
      return;
    }
    if (accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits");
      return;
    }
    updatePayoutBankMutation.mutate({
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
    });
  };

  const isPayoutBankComplete = bankName && accountNumber?.length === 10 && accountName;

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
            Earn ₦488 cash for every friend who subscribes to Pro!
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
                  <span>When your friend subscribes to Pro (₦3,250/month)</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-emerald-400 text-xs font-bold shrink-0">
                    3
                  </div>
                  <span><strong className="text-emerald-400">You earn ₦488 cash</strong> (15% commission) paid at month end!</span>
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
              <div className="text-2xl font-bold text-white">{stats?.paid_signups || 0}</div>
              <div className="text-xs text-brand-textMuted">Pro Referrals</div>
            </CardContent>
          </Card>
          <Card className="bg-brand-surface/60">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stats?.pending_referrals || 0}</div>
              <div className="text-xs text-brand-textMuted">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-900/60 to-brand-surface/60 border-emerald-700/40">
            <CardContent className="p-4 text-center">
              <Trophy className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-400">₦{(stats?.commission?.total_earned || 0).toLocaleString()}</div>
              <div className="text-xs text-brand-textMuted">Total Earned</div>
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

        {/* Commission Info Card */}
        <Card className="mb-6 bg-gradient-to-br from-emerald-900/30 to-brand-surface border-emerald-700/30">
          <CardHeader className="border-b border-emerald-700/40 px-4 sm:px-6">
            <h3 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              💰 Your Commission Rate
            </h3>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-brand-bg/40 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">15%</div>
                <div className="text-sm text-brand-textMuted mt-1">Commission Rate</div>
              </div>
              <div className="bg-brand-bg/40 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-white">₦488</div>
                <div className="text-sm text-brand-textMuted mt-1">Per Pro Subscriber</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-brand-bg/30 rounded-lg text-center">
              <p className="text-sm text-brand-textMuted">
                Commissions are <span className="text-emerald-400 font-semibold">paid out in cash</span> at the end of each month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payout Bank Account Card */}
        <Card className="mb-6 bg-brand-surface border-brand-border">
          <CardHeader className="border-b border-brand-border px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-400" />
                Payout Bank Account
              </h3>
              {payoutBank?.is_complete && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/30 px-2 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Saved
                </span>
              )}
            </div>
            <p className="text-sm text-brand-textMuted mt-1">
              Where we&apos;ll send your referral commissions each month
            </p>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
            <div className="space-y-4">
              {/* Bank Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={bankInputRef}
                    type="text"
                    value={showBankDropdown ? bankSearch : bankName}
                    onChange={(e) => {
                      if (showBankDropdown) {
                        setBankSearch(e.target.value);
                      } else {
                        setBankName(e.target.value);
                      }
                    }}
                    onFocus={() => {
                      setShowBankDropdown(true);
                      setBankSearch("");
                    }}
                    placeholder="Select your bank"
                    className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-textMuted" />
                  {showBankDropdown && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-brand-border bg-brand-surface shadow-lg"
                    >
                      {filteredBanks.length > 0 ? (
                        filteredBanks.map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => handleBankSelect(bank)}
                            className="w-full px-3 py-2 text-left text-sm text-white hover:bg-brand-border/50"
                          >
                            {bank}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-brand-textMuted">No banks found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="0123456789"
                  maxLength={10}
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted mb-2">
                  Account Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-3 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <Button
                onClick={handleSavePayoutBank}
                disabled={!isPayoutBankComplete || updatePayoutBankMutation.isPending}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                {updatePayoutBankMutation.isPending ? "Saving..." : "Save Payout Bank"}
              </Button>
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
