"use client";

import { Button } from "@/components/ui/button";
import { WalletBalanceCard } from "@/components/wallet-balance-card";
import {
  walletNaira,
  WALLET_TOPUP_TIERS,
  FEE_HEADLINE,
  FEE_SUMMARY_SHORT,
  WALLET_FEE_TAGLINE,
} from "../../constants/pricing";

interface SubscriptionSectionProps {
  user?: {
    plan?: string;
    invoice_balance?: number;
    wallet_balance_kobo?: number;
    invoices_this_month?: number; // deprecated, kept for backward compat
    subscription_expires_at?: string | null;
    subscription_started_at?: string | null;
  };
}

export function SubscriptionSection({ user }: SubscriptionSectionProps) {
  if (!user) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-brand-background" />
          <div className="h-20 w-full rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  const wallet = walletNaira(user?.wallet_balance_kobo);
  const isLow = wallet < 500;

  return (
    <div className="rounded-lg border border-brand-border bg-white text-brand-text shadow-card">
      <div className="border-b border-brand-border px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[22px] font-semibold text-brand-text">Billing &amp; wallet</h2>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-textMuted">
            <span className="block h-1 w-6 rounded-full bg-brand-jade/60" />
            {FEE_HEADLINE}
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-textMuted">
          {FEE_SUMMARY_SHORT}
        </p>
      </div>

      <div className="px-6 py-5 sm:px-8 sm:py-6">
        {/* Wallet balance */}
        <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
          <WalletBalanceCard
            label="Invoice wallet"
            naira={wallet}
            low={isLow}
            subtitle={
              isLow
                ? "⚠️ Running low — top up to keep creating manual invoices"
                : WALLET_FEE_TAGLINE
            }
          />

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-brand-textMuted">
              Top up: {WALLET_TOPUP_TIERS.map((t) => `₦${t.toLocaleString()}`).join(" · ")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/dashboard/billing/purchase")}
              className="w-full sm:w-auto"
            >
              Top up wallet
            </Button>
          </div>
        </div>

        {/* What's included */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-brand-text">Everything included</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              "Custom branding & logo",
              "Inventory management",
              "Team members",
              "Voice invoices",
              "Tax reports (PIT + CIT)",
              "Cash dashboard & insights",
              "Storefront & online payments",
              "WhatsApp & Email delivery",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
              >
                <span className="text-brand-jade">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment History Link */}
        <div className="mt-6 rounded-lg border border-brand-border bg-brand-background p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-brand-jade hover:text-brand-jade"
            onClick={() =>
              (window.location.href = "/dashboard/subscription/history")
            }
          >
            View Payment History →
          </Button>
        </div>
      </div>
    </div>
  );
}
