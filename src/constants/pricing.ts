/**
 * Centralized pricing configuration — single source of truth.
 *
 * BILLING MODEL v2 (commission-based, no plans):
 * - One free tier. All features are free for everyone.
 * - Fees as low as 0.2%:
 *   • Manual invoices: max(0.2% of amount, ₦50) from a prepaid wallet at
 *     creation (≡ ₦200 per ₦100,000 of transaction value).
 *   • Storefront orders: 3% commission when the customer pays online,
 *     capped at ₦2,000 per ₦500,000.
 * - Wallet top-ups replace "packs": ₦1,250 / ₦5,000 / ₦20,000.
 *
 * Keep in sync with backend app/utils/feature_gate.py
 * (MANUAL_FEE_PERCENT, MANUAL_MIN_FEE_KOBO, STOREFRONT_FEE_PERCENT, WALLET_TOPUP_TIERS).
 */

/** Manual-invoice (wallet) commission (percent). */
export const MANUAL_FEE_PERCENT = 0.2;
/** Storefront / online commission. */
export const STOREFRONT_FEE_PERCENT = 3;
/** Back-compat alias (headline rate historically referenced as 3%). */
export const PLATFORM_FEE_PERCENT = STOREFRONT_FEE_PERCENT;
/** Minimum fee (₦) charged per manual invoice. */
export const MANUAL_INVOICE_MIN_FEE = 50;
/** Safety fee ceiling (₦) per ₦100,000 band for a manual invoice (≡ 0.2%). */
export const MANUAL_INVOICE_MAX_FEE = 200;
/** Transaction value (₦) per manual fee-cap tier. */
export const MANUAL_CAP_TIER_NAIRA = 100_000;
/** Transaction value (₦) per fee-cap tier (storefront default). */
export const FEE_CAP_TIER_NAIRA = 500_000;
/** Wallet top-up amounts (₦) sold to fund manual invoicing. */
export const WALLET_TOPUP_TIERS = [1250, 5000, 20000] as const;

/** Fee (₦) charged from the wallet for a manual invoice of `amount` (₦). */
export function manualInvoiceFee(amount: number): number {
  const pct = Math.round((amount * MANUAL_FEE_PERCENT) / 100);
  const tiers = amount <= 0 ? 1 : Math.max(1, Math.ceil(amount / MANUAL_CAP_TIER_NAIRA));
  const cap = MANUAL_INVOICE_MAX_FEE * tiers;
  return Math.min(Math.max(pct, MANUAL_INVOICE_MIN_FEE), cap);
}

/** Convert a kobo wallet balance to whole Naira. */
export function walletNaira(kobo: number | null | undefined): number {
  return Math.floor((kobo ?? 0) / 100);
}

/** Roughly how much invoicing a top-up covers, at the 0.2% manual rate. */
export function topupCoverage(amount: number): number {
  return Math.round((amount / MANUAL_FEE_PERCENT) * 100);
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

/** The single free tier. All features are included; you only pay 0.2% per invoice. */
export const FREE_PLAN: Plan = {
  id: "FREE",
  name: "Free",
  displayName: "Free",
  price: 0,
  priceDisplay: "₦0",
  invoicesDisplay: "All features free · 0.2% per invoice",
  icon: "🚀",
  description: "Everything included. We just take 0.2% when you invoice.",
  features: [
    "All features included — no plans",
    "0.2% per invoice (min ₦50), from your wallet",
    "Buyer-protected storefront with courier delivery",
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
