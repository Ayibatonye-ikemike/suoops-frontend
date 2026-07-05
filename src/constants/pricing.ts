/**
 * Centralized pricing configuration — single source of truth.
 *
 * BILLING MODEL v2 (commission-based, no plans):
 * - One free tier. All features are free for everyone.
 * - Suoops takes a flat 3% per invoice.
 *   • Manual invoices: max(3% of amount, ₦20) from a prepaid wallet at creation.
 *   • Storefront orders: 3% commission when the customer pays online.
 * - Wallet top-ups replace "packs": ₦1,250 / ₦5,000 / ₦20,000.
 *
 * Keep in sync with backend app/utils/feature_gate.py
 * (PLATFORM_FEE_PERCENT, MANUAL_INVOICE_MIN_FEE_KOBO, WALLET_TOPUP_TIERS).
 */

export const PLATFORM_FEE_PERCENT = 3;
/** Minimum fee (₦) charged per manual invoice. */
export const MANUAL_INVOICE_MIN_FEE = 20;
/** Maximum fee (₦) charged per manual invoice. */
export const MANUAL_INVOICE_MAX_FEE = 2000;
/** Wallet top-up amounts (₦) sold to fund manual invoicing. */
export const WALLET_TOPUP_TIERS = [1250, 5000, 20000] as const;

/** Fee (₦) charged from the wallet for a manual invoice of `amount` (₦). */
export function manualInvoiceFee(amount: number): number {
  const pct = Math.round((amount * PLATFORM_FEE_PERCENT) / 100);
  return Math.min(Math.max(pct, MANUAL_INVOICE_MIN_FEE), MANUAL_INVOICE_MAX_FEE);
}

/** Convert a kobo wallet balance to whole Naira. */
export function walletNaira(kobo: number | null | undefined): number {
  return Math.floor((kobo ?? 0) / 100);
}

/** Roughly how much invoicing a top-up covers, at the 3% rate. */
export function topupCoverage(amount: number): number {
  return Math.round((amount / PLATFORM_FEE_PERCENT) * 100);
}

export type PlanTier = "FREE";

export interface Plan {
  id: PlanTier;
  name: string;
  displayName: string;
  price: number;
  priceDisplay: string;
  invoicesDisplay: string;
  features: string[];
  icon?: string;
  description?: string;
}

/** The single free tier. All features are included; you only pay 3% per invoice. */
export const FREE_PLAN: Plan = {
  id: "FREE",
  name: "Free",
  displayName: "Free",
  price: 0,
  priceDisplay: "₦0",
  invoicesDisplay: "All features free · 3% per invoice",
  icon: "🚀",
  description: "Everything included. We just take 3% when you invoice.",
  features: [
    "All features included — no plans",
    "3% per invoice (min ₦20), from your wallet",
    "Storefront: 3% only when the customer pays",
    "Custom branding, inventory, team & voice",
    "Tax reports, insights & daily summary",
    "WhatsApp & Email delivery, PDF & QR",
  ],
};

/** Get display price with currency. */
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}
