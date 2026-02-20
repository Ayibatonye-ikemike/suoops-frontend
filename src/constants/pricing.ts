/**
 * Centralized pricing and plan configuration
 * Single source of truth for all subscription tiers
 * 
 * BILLING MODEL (Small & Medium Business Focus):
 * - FREE: 5 free invoices to start, basic features
 * - STARTER: No monthly fee, buy invoice packs (50 = ₦1,250)
 * - PRO: ₦3,250/month = 100 invoices included + ALL premium features
 * - All plans can buy additional packs (50 invoices = ₦1,250)
 * 
 * Note: BUSINESS plan removed - we focus on businesses under ₦100M annual revenue.
 * PRO now includes voice invoices.
 * 
 * IMPORTANT: Keep in sync with backend app/models/models.py SubscriptionPlan
 */

export type PlanTier = "FREE" | "STARTER" | "PRO";

export interface PlanFeature {
  text: string;
  available: boolean;
}

export interface Plan {
  id: PlanTier;
  name: string;
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
 */
export const PLANS: Record<PlanTier, Plan> = {
  FREE: {
    id: "FREE",
    name: "Free",
    price: 0,
    priceDisplay: "₦0",
    invoicesIncluded: 5,
    invoicesDisplay: "5 free invoices to start",
    hasMonthlySubscription: false,
    description: "Get started for free",
    features: [
      "5 free invoices to start",
      "Buy more: 50 for ₦1,250",
      "WhatsApp & Email delivery",
      "PDF generation",
      "QR verification",
    ],
  },
  STARTER: {
    id: "STARTER",
    name: "Starter",
    price: 1250,
    priceDisplay: "₦1,250 per 50 invoices",
    invoicesIncluded: 0,
    invoicesDisplay: "Buy invoice packs",
    hasMonthlySubscription: false,
    popular: false,
    icon: "🚀",
    description: "Pay as you go invoicing",
    features: [
      "No monthly fee",
      "50 invoices for ₦1,250",
      "WhatsApp & Email delivery",
      "PDF generation & QR verification",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
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
 * Plans available for paid upgrade selection (excludes FREE and STARTER)
 * STARTER has no monthly subscription - users just buy invoice packs
 */
export const PAID_PLANS: Plan[] = [
  PLANS.PRO,
];

/**
 * All plans in order for display
 */
export const ALL_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.STARTER,
  PLANS.PRO,
];

/**
 * Landing page pricing display
 * Shows FREE and PRO plans only
 * Users start FREE and can buy packs or upgrade to PRO for monthly subscription
 */
export const LANDING_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.STARTER,
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
 */
export function getPlan(planId: PlanTier): Plan {
  return PLANS[planId];
}

/**
 * Get display price with currency
 */
export function formatPrice(price: number): string {
  return `₦${price.toLocaleString()}`;
}
