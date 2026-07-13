"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { initializeWalletTopup } from "@/api/subscription";
import { apiClient } from "@/api/client";
import { WALLET_TOPUP_TIERS, walletNaira, topupCoverage } from "@/constants/pricing";

export default function TopUpWalletPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(WALLET_TOPUP_TIERS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });

  const walletBalance = walletNaira(user?.wallet_balance_kobo);

  const handleTopUp = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await initializeWalletTopup(amount);
      window.location.href = response.authorization_url;
    } catch (err) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e.response?.data?.detail || "Failed to start payment. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-text">Top up your wallet</h1>
          <p className="mt-2 text-brand-textMuted">
            We take a flat 3% per invoice (minimum ₦20, capped at ₦2,000 for invoices up to
            ₦500,000, then +₦2,000 per additional ₦500,000), charged from your wallet when
            you create one. Storefront orders pay 3% only when the customer pays.
          </p>
        </div>

        {/* Current wallet balance */}
        <div className="mb-6 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-textMuted">Wallet balance</p>
              <p className="text-2xl font-bold text-brand-primary">
                ₦{walletBalance.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">👛</div>
          </div>
        </div>

        {/* Tier selection */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {WALLET_TOPUP_TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setAmount(tier)}
              className={`rounded-xl border-2 p-4 text-center transition ${
                amount === tier
                  ? "border-brand-jade bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-lg font-bold text-brand-jade">₦{tier.toLocaleString()}</p>
              <p className="mt-1 text-[10px] text-brand-textMuted">
                covers ~₦{topupCoverage(tier).toLocaleString()}
              </p>
            </button>
          ))}
        </div>

        {/* Summary + pay */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-6 rounded-xl border border-brand-border bg-brand-background p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-textMuted">Top-up</span>
                <span className="font-medium">₦{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-brand-border pt-2">
                <span className="text-brand-textMuted">New wallet balance</span>
                <span className="font-bold text-brand-jade">
                  ₦{(walletBalance + amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-textMuted">Covers roughly</span>
                <span className="font-medium">
                  ~₦{topupCoverage(amount).toLocaleString()} in typical invoices
                </span>
              </div>
            </div>
            <p className="mt-3 text-[11px] leading-snug text-brand-textMuted">
              Estimated at the full 3% (invoices ₦667–₦66,667). Bigger invoices
              stretch much further — the fee caps at ₦2,000 per ₦500,000, so a
              ₦500,000 invoice costs just ₦2,000.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <Button
            onClick={handleTopUp}
            disabled={isLoading}
            className="w-full bg-brand-primary py-3 text-white hover:bg-brand-primary/90"
            size="lg"
          >
            {isLoading ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
          </Button>

          <p className="mt-4 text-center text-xs text-brand-textMuted">
            🔒 Secure payment via Paystack · a small processing fee is added at checkout
          </p>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => router.back()} className="text-sm text-brand-textMuted hover:text-brand-text">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
