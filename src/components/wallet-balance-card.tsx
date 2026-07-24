"use client";

import { Wallet } from "lucide-react";

interface WalletBalanceCardProps {
  /** Small label above the balance, e.g. "Wallet balance" / "Invoice wallet". */
  label: string;
  /** Balance in whole Naira. */
  naira: number;
  /** Optional helper line under the balance (fee tagline or low-balance warning). */
  subtitle?: string | null;
  /** Render in the low-balance (amber) tone. */
  low?: boolean;
  className?: string;
}

/**
 * Shared wallet balance card. Single presentation used by the Settings billing
 * card and the wallet top-up page so both screens look identical (DRY).
 */
export function WalletBalanceCard({
  label,
  naira,
  subtitle,
  low = false,
  className = "",
}: WalletBalanceCardProps) {
  return (
    <div
      className={`rounded-2xl border border-brand-border bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-brand-textMuted">{label}</p>
          <p
            className={`mt-1 text-2xl font-bold ${low ? "text-amber-600" : "text-brand-jade"}`}
          >
            ₦{naira.toLocaleString()}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-brand-textMuted">{subtitle}</p>
          ) : null}
        </div>
        <Wallet
          className={`h-9 w-9 shrink-0 ${low ? "text-amber-500" : "text-brand-jade"}`}
        />
      </div>
    </div>
  );
}
