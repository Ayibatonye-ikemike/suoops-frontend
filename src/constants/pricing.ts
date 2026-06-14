/**
 * Centralized pricing and plan configuration
 * Single source of truth for all subscription tiers
 *
 * BILLING MODEL (Small & Medium Business Focus — fully prepaid):
 * - FREE (displayed as "Starter"): 2 free invoices to start, buy packs.
 * - Invoice packs (invoices only, never expire): 25 = ₦625, 50 = ₦1,250.
 * - Pro Pack: 20 invoices + 30 days of Pro features for ₦2,000 (one-time).
 * - Pro Features: ₦1,500/month recurring subscription (features only, auto-renews).
 *
 * Pro Pack features are time-limited (lapse after 30 days, no auto-renew);
 * purchased invoices are permanent. Pro Features is a recurring monthly plan.
 *
 * Note: STARTER plan removed from backend. Frontend shows "Starter" as UX label for FREE.
 *
 * IMPORTANT: Keep in sync with backend app/utils/feature_gate.py PACK_OPTIONS
 */

export type PlanTier = "FREE" | "PRO";

export interface PlanFeature {
  text: string;
  available: boolean;
}

export interface Plan {
  id: PlanTier;
  name: string;
  displayName: string;  // What users see (e.g., "Starter" for FREE)
  price: number;
  priceDisplay: string;
  invoicesIncluded: number;
  invoicesDisplay: string;
  features: string[];
  popular?: boolean;
  icon?: string;
  description?: string;
  hasMonthlySubscription?: boolean;
}

// Invoice pack pricing (invoices only, never expire)
export const INVOICE_PACK_SIZE = 50;
export const INVOICE_PACK_PRICE = 1250;

// Small pack option
export const INVOICE_SMALL_PACK_SIZE = 25;
export const INVOICE_SMALL_PACK_PRICE = 625;

// Pro packs (prepaid, one-time): grant time-limited Pro features.
export const PRO_FEATURES_DAYS = 30;

// Pro Pack: invoices + 30 days of Pro features
export const PRO_PACK_SIZE = 20;
export const PRO_PACK_PRICE = 2000;

// Pro Features: recurring monthly subscription (₦1,500/mo, features only, no
// invoices). Sold via /subscriptions/initialize?plan=PRO_FEATURES — NOT a pack.
export const PRO_FEATURES_PRICE = 1500;

export const PACK_OPTIONS = [
  { id: "small", size: INVOICE_SMALL_PACK_SIZE, price: INVOICE_SMALL_PACK_PRICE, label: "Starter Pack", proDays: 0 },
  { id: "standard", size: INVOICE_PACK_SIZE, price: INVOICE_PACK_PRICE, label: "Value Pack", proDays: 0 },
  { id: "pro_pack", size: PRO_PACK_SIZE, price: PRO_PACK_PRICE, label: "Pro Pack", proDays: PRO_FEATURES_DAYS, pro: true, popular: true },
] as const;

/**
 * Complete plan definitions
 * Backend contract: SubscriptionPlan in app/models/models.py
 * 
 * Note: FREE plan is displayed as "Starter" to users for better UX.
 * Users get 2 free invoices and can buy packs without any plan change.
 */
export const PLANS: Record<PlanTier, Plan> = {
  FREE: {
    id: "FREE",
    name: "Free",
    displayName: "Starter",  // Shown to users as "Starter" for UX
    price: 0,
    priceDisplay: "₦0",
    invoicesIncluded: 2,
    invoicesDisplay: "2 invoices to start",
    hasMonthlySubscription: false,
    icon: "🚀",
    description: "Get started free — 2 invoices on us",
    features: [
      "2 invoices included to get started",
      "Buy more: 25 for ₦625",
      "Buy more: 50 for ₦1,250",
      "WhatsApp & Email delivery",
      "PDF generation & QR verification",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    displayName: "Pro Pack",
    price: 2000,
    priceDisplay: "₦2,000",
    invoicesIncluded: 20,
    invoicesDisplay: "20 invoices + 30 days Pro",
    hasMonthlySubscription: false,
    popular: true,
    icon: "⭐",
    description: "All premium features — pay once, no auto-renew. Or subscribe to the Pro Plan for ₦1,500/mo.",
    features: [
      "20 invoices included (never expire)",
      "30 days of all premium features",
      "Tax reports (PIT + CIT)",
      "Custom logo branding",
      "Inventory management",
      "Team management (3 members)",
      "Cash-first dashboard & insights",
      "Customer value & dormancy alerts",
      "Margin & discount analysis",
      "Daily WhatsApp business summary",
      "Professionalism score & tips",
      "Priority support",
    ],
  },
};

/**
 * Plans available for paid upgrade selection (PRO only)
 */
export const PAID_PLANS: Plan[] = [
  PLANS.PRO,
];

/**
 * All plans in order for display
 */
export const ALL_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.PRO,
];

/**
 * Landing page pricing display
 * Shows Starter (FREE) and Pro plans
 * Users start with 2 free invoices and can buy packs or upgrade to PRO
 */
export const LANDING_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.PRO,
];

/**
 * Feature availability by plan tier
 */
export const FEATURE_GATES = {
  TAX_REPORTS: ["PRO"] as PlanTier[],
  CUSTOM_BRANDING: ["PRO"] as PlanTier[],
  INVENTORY: ["PRO"] as PlanTier[],
  TEAM_MANAGEMENT: ["PRO"] as PlanTier[],
  VOICE_INVOICE: ["PRO"] as PlanTier[],
  CASH_DASHBOARD: ["PRO"] as PlanTier[],
  CUSTOMER_INSIGHTS: ["PRO"] as PlanTier[],
  PROFESSIONALISM_SCORE: ["PRO"] as PlanTier[],
  MARGIN_INSIGHTS: ["PRO"] as PlanTier[],
  DAILY_SUMMARY: ["PRO"] as PlanTier[],
} as const;

/**
 * Pro plan quota limitations
 */
export const PRO_QUOTA = {
  VOICE_LIMIT: 15, // Voice invoices per month
  INVOICES_INCLUDED: 20,
} as const;

/**
 * Helper to check if plan has specific feature
 */
export function hasPlanFeature(planId: PlanTier, feature: keyof typeof FEATURE_GATES): boolean {
  return FEATURE_GATES[feature].includes(planId);
}

/**
 * Get plan by ID with type safety
 * Handles legacy "STARTER" values by mapping to FREE
 */
export function getPlan(planId: string): Plan {
  // Map legacy STARTER to FREE
  const normalizedId = planId.toUpperCase() === "STARTER" ? "FREE" : planId.toUpperCase();
  return PLANS[normalizedId as PlanTier] || PLANS.FREE;
}

/**
 * Get display price with currency
 */
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}

/**
 * Get display name for a plan (maps FREE -> "Starter" for UX)
 */
export function getPlanDisplayName(planId: string): string {
  const plan = getPlan(planId);
  return plan.displayName;
}
