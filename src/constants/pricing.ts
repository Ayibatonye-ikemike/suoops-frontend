/**
 * Centralized pricing and plan configuration
 * Single source of truth for all subscription tiers
 * 
 * BILLING MODEL (Small & Medium Business Focus):
 * - FREE (displayed as "Starter"): 5 free invoices to start, buy packs (50 = ₦1,250)
 * - PRO: ₦3,250/month = 50 invoices included + ALL premium features
 * - All plans can buy additional packs (50 invoices = ₦1,250)
 * 
 * Note: STARTER plan removed from backend. Frontend shows "Starter" as UX label for FREE.
 * Note: BUSINESS plan removed - we focus on businesses under ₦100M annual revenue.
 * PRO now includes voice invoices.
 * 
 * IMPORTANT: Keep in sync with backend app/models/models.py SubscriptionPlan
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

// Invoice pack pricing
export const INVOICE_PACK_SIZE = 50;
export const INVOICE_PACK_PRICE = 1250;

/**
 * Complete plan definitions
 * Backend contract: SubscriptionPlan in app/models/models.py
 * 
 * Note: FREE plan is displayed as "Starter" to users for better UX.
 * Users get 5 free invoices and can buy packs without any plan change.
 */
export const PLANS: Record<PlanTier, Plan> = {
  FREE: {
    id: "FREE",
    name: "Free",
    displayName: "Starter",  // Shown to users as "Starter" for UX
    price: 0,
    priceDisplay: "₦0",
    invoicesIncluded: 5,
    invoicesDisplay: "5 free invoices to start",
    hasMonthlySubscription: false,
    icon: "🚀",
    description: "Get started free — 5 invoices on us",
    features: [
      "5 free invoices to try it out",
      "Buy more: 50 for ₦1,250",
      "WhatsApp & Email delivery",
      "PDF generation & QR verification",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    displayName: "Pro",
    price: 3250,
    priceDisplay: "₦3,250",
    invoicesIncluded: 50,
    invoicesDisplay: "50 invoices included",
    hasMonthlySubscription: true,
    popular: true,
    icon: "⭐",
    description: "All premium features for your business",
    features: [
      "50 invoices/month included",
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
 * Users start with 5 free invoices and can buy packs or upgrade to PRO
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
  INVOICES_INCLUDED: 50,
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
