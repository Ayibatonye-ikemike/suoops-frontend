"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  ExternalLink,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

import { apiClient } from "@/api/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

interface EarningsData {
  first_purchase_earned: number;
  recurring_earned: number;
  perpetual_earned: number;
  total_earned: number;
  total_signups: number;
  total_conversions: number;
  pending_payout: number;
  custom_link: string | null;
  commission_first: number;
  commission_recurring: number;
  commission_perpetual_pct: number;
  recent_earnings: {
    date: string;
    type: string;
    amount: number;
    description: string;
    status: string;
  }[];
}

interface PayoutBank {
  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;
  is_complete: boolean;
  using_business_bank?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  commission_first_purchase: "First Purchase",
  commission_recurring: "Recurring",
  commission_perpetual: "Perpetual",
};

export default function EarningsPage() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [editingPayout, setEditingPayout] = useState(false);
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);
  const [payoutForm, setPayoutForm] = useState({
    bank_name: "",
    account_number: "",
    account_name: "",
  });

  const { data: earnings, isLoading } = useQuery<EarningsData>({
    queryKey: ["influencerEarnings"],
    queryFn: async () => {
      const res = await apiClient.get<EarningsData>("/referrals/earnings");
      return res.data;
    },
    staleTime: 60_000,
  });

  const { data: bank } = useQuery<PayoutBank>({
    queryKey: ["payoutBank"],
    queryFn: async () => {
      const res = await apiClient.get<PayoutBank>("/referrals/payout-bank");
      return res.data;
    },
    staleTime: 60_000,
  });

  const copyLink = () => {
    if (!earnings?.custom_link) return;
    navigator.clipboard.writeText(earnings.custom_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  const startPayoutEdit = () => {
    setPayoutError(null);
    setPayoutSuccess(null);
    setPayoutForm({
      bank_name: bank?.bank_name ?? "",
      account_number: bank?.account_number ?? "",
      account_name: bank?.account_name ?? "",
    });
    setEditingPayout(true);
  };

  const savePayout = async () => {
    setPayoutError(null);
    setPayoutSuccess(null);

    const bank_name = payoutForm.bank_name.trim();
    const account_name = payoutForm.account_name.trim();
    const account_number = payoutForm.account_number.replace(/\D/g, "");

    if (!bank_name || bank_name.length < 2) {
      setPayoutError("Enter a valid bank name.");
      return;
    }
    if (!/^\d{10}$/.test(account_number)) {
      setPayoutError("Account number must be exactly 10 digits.");
      return;
    }
    if (!account_name || account_name.length < 2) {
      setPayoutError("Enter a valid account name.");
      return;
    }

    try {
      setSavingPayout(true);
      await apiClient.patch("/referrals/payout-bank", {
        bank_name,
        account_number,
        account_name,
      });
      await queryClient.invalidateQueries({ queryKey: ["payoutBank"] });
      setPayoutSuccess("Payout account saved.");
      setEditingPayout(false);
    } catch (error) {
      console.error("Error saving payout:", error);
      const detail = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.detail || "Could not save payout account. Please try again.";
      setPayoutError(detail);
    } finally {
      setSavingPayout(false);
    }
  };

  const useInvoiceBankInstead = async () => {
    setPayoutError(null);
    setPayoutSuccess(null);
    try {
      setSavingPayout(true);
      await apiClient.delete("/referrals/payout-bank");
      await queryClient.invalidateQueries({ queryKey: ["payoutBank"] });
      setPayoutSuccess("Switched to your invoice bank account.");
      setEditingPayout(false);
    } catch (error) {
      console.error("Error clearing payout:", error);
      const detail = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.detail || "Could not switch account now. Please try again.";
      setPayoutError(detail);
    } finally {
      setSavingPayout(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-white/10" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const e = earnings ?? {
    first_purchase_earned: 0,
    recurring_earned: 0,
    perpetual_earned: 0,
    total_earned: 0,
    total_signups: 0,
    total_conversions: 0,
    pending_payout: 0,
    custom_link: null,
    commission_first: 500,
    commission_recurring: 200,
    commission_perpetual_pct: 5,
    recent_earnings: [],
  };

  const conversionRate =
    e.total_signups > 0
      ? Math.round((e.total_conversions / e.total_signups) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Earnings Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Track your referral commissions and payouts
        </p>
      </div>

      {/* Referral Link */}
      {e.custom_link && (
        <Card className="mb-6 border-brand-jade/30 bg-brand-jade/10">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                Your Referral Link
              </p>
              <p className="mt-1 font-mono text-sm text-brand-primary break-all">
                {e.custom_link}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-jade px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-jade/80"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
              <a
                href={e.custom_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-white px-3 py-2 text-sm font-medium text-brand-text transition hover:bg-brand-bg"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Earned" value={fmt(e.total_earned)} icon="💰" />
        <StatCard
          label="Pending Payout"
          value={fmt(e.pending_payout)}
          icon="⏳"
        />
        <StatCard label="Signups" value={e.total_signups} icon="👥" />
        <StatCard
          label="Conversions"
          value={`${e.total_conversions} (${conversionRate}%)`}
          icon="🎯"
        />
      </div>

      {/* Commission Breakdown + Rates */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {/* Earnings Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-text">
              <TrendingUp className="h-5 w-5 text-brand-jade" />
              Earnings Breakdown
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-textMuted">
                First Purchases
              </span>
              <span className="font-semibold text-brand-text">
                {fmt(e.first_purchase_earned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-textMuted">
                Recurring (2nd–3rd)
              </span>
              <span className="font-semibold text-brand-text">
                {fmt(e.recurring_earned)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-textMuted">
                Perpetual ({e.commission_perpetual_pct}%)
              </span>
              <span className="font-semibold text-brand-text">
                {fmt(e.perpetual_earned)}
              </span>
            </div>
            <div className="border-t border-brand-border pt-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-brand-text">Total</span>
                <span className="text-lg font-bold text-brand-primary">
                  {fmt(e.total_earned)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commission Rates */}
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-text">
              <Wallet className="h-5 w-5 text-brand-jade" />
              Your Commission Rates
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-brand-bg p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                1st Purchase
              </p>
              <p className="mt-1 text-xl font-bold text-brand-primary">
                {fmt(e.commission_first)}
              </p>
            </div>
            <div className="rounded-xl bg-brand-bg p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                2nd & 3rd Purchase
              </p>
              <p className="mt-1 text-xl font-bold text-brand-primary">
                {fmt(e.commission_recurring)}
                <span className="text-sm font-normal text-brand-textMuted">
                  {" "}
                  each
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-brand-bg p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                Every Purchase After
              </p>
              <p className="mt-1 text-xl font-bold text-brand-primary">
                {e.commission_perpetual_pct}%
                <span className="text-sm font-normal text-brand-textMuted">
                  {" "}
                  forever
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Bank */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-text">
            <Wallet className="h-5 w-5 text-brand-jade" />
            Payout Account
          </h2>
        </CardHeader>
        <CardContent>
          {editingPayout ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                  Bank Name
                </label>
                <input
                  value={payoutForm.bank_name}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({ ...prev, bank_name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text"
                  placeholder="e.g. Access Bank"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                  Account Number
                </label>
                <input
                  value={payoutForm.account_number}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({
                      ...prev,
                      account_number: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 font-mono text-sm text-brand-text"
                  placeholder="10-digit account number"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-textMuted">
                  Account Name
                </label>
                <input
                  value={payoutForm.account_name}
                  onChange={(e) =>
                    setPayoutForm((prev) => ({ ...prev, account_name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text"
                  placeholder="e.g. Ayibatonye Ikemike"
                />
              </div>

              {payoutError ? (
                <p className="text-sm text-rose-600">{payoutError}</p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={savePayout}
                  disabled={savingPayout}
                  className="inline-flex items-center rounded-lg bg-brand-jade px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-jade/80 disabled:opacity-60"
                >
                  {savingPayout ? "Saving..." : "Save Payout Account"}
                </button>
                <button
                  onClick={() => {
                    setEditingPayout(false);
                    setPayoutError(null);
                  }}
                  className="inline-flex items-center rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-text transition hover:bg-brand-bg"
                >
                  Cancel
                </button>
                {!bank?.using_business_bank ? (
                  <button
                    onClick={useInvoiceBankInstead}
                    disabled={savingPayout}
                    className="inline-flex items-center rounded-lg border border-brand-border bg-white px-4 py-2 text-sm font-medium text-brand-jade transition hover:bg-brand-bg disabled:opacity-60"
                  >
                    Use Invoice Bank Account Instead
                  </button>
                ) : null}
              </div>
            </div>
          ) : bank?.is_complete ? (
            <>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-brand-textMuted">
                    {bank.bank_name}
                  </p>
                  <p className="font-mono text-sm text-brand-text">
                    {bank.account_number}
                  </p>
                  <p className="text-sm text-brand-text">{bank.account_name}</p>
                </div>
                <button
                  onClick={startPayoutEdit}
                  className="text-sm font-medium text-brand-jade hover:underline"
                >
                  Edit
                </button>
              </div>
              {bank?.using_business_bank ? (
                <p className="mt-3 text-xs text-brand-textMuted">
                  Using your invoice bank account by default. You can still set a different payout account later.
                </p>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-brand-textMuted">
                Add your bank details to receive weekly payouts.
              </p>
              <button
                onClick={startPayoutEdit}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-jade px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-jade/80"
              >
                <ArrowUpRight className="h-4 w-4" />
                Set Up Payout
              </button>
            </div>
          )}
          {payoutSuccess ? (
            <p className="mt-3 text-sm text-brand-statusPaidText">{payoutSuccess}</p>
          ) : null}
        </CardContent>
      </Card>

      {/* Recent Earnings */}
      <Card>
        <CardHeader>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-brand-text">
            <Clock className="h-5 w-5 text-brand-jade" />
            Recent Earnings
          </h2>
        </CardHeader>
        <CardContent>
          {e.recent_earnings.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto h-10 w-10 text-brand-textMuted/40" />
              <p className="mt-3 text-sm text-brand-textMuted">
                No earnings yet. Share your link to start earning!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border">
              {e.recent_earnings.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-brand-text">
                      {TYPE_LABELS[item.type] || item.type}
                    </p>
                    <p className="text-xs text-brand-textMuted">
                      {new Date(item.date).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-brand-primary">
                      +{fmt(item.amount)}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        item.status === "applied"
                          ? "text-brand-statusPaidText"
                          : "text-amber-600"
                      }`}
                    >
                      {item.status === "applied" ? "Paid" : "Pending"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
