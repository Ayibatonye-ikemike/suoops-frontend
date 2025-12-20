/**
 * Centralized pricing and plan configuration
 * Single source of truth for all subscription tiers
 * 
 * BILLING MODEL:
 * - FREE: 5 free invoices to start, basic features
 * - STARTER: No monthly fee, buy invoice packs (100 = ₦2,500) + tax features
 * - PRO: ₦5,000/month = 100 invoices included + premium features
 * - BUSINESS: ₦10,000/month = 100 invoices included + all features
 * - All plans can buy additional packs (100 invoices = ₦2,500)
 * 
 * IMPORTANT: Keep in sync with backend app/models/models.py SubscriptionPlan
 */

export type PlanTier = "FREE" | "STARTER" | "PRO" | "BUSINESS";

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
export const INVOICE_PACK_SIZE = 100;
export const INVOICE_PACK_PRICE = 2500;

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
      "Buy more: 100 for ₦2,500",
      "Tax reports & automation",
      "WhatsApp & Email delivery",
      "PDF generation",
      "QR verification",
    ],
  },
  STARTER: {
    id: "STARTER",
    name: "Starter",
    price: 2500,
    priceDisplay: "₦2,500 per 100 invoices",
    invoicesIncluded: 0,
    invoicesDisplay: "Buy invoice packs",
    hasMonthlySubscription: false,
    popular: false, // No longer shown on landing page
    icon: "🚀",
    description: "Pay as you go + Tax features",
    features: [
      "No monthly fee",
      "100 invoices for ₦2,500",
      "Tax reports & automation",
      "WhatsApp & Email delivery",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: 5000,
    priceDisplay: "₦5,000/month",
    invoicesIncluded: 100,
    invoicesDisplay: "100 invoices included",
    hasMonthlySubscription: true,
    popular: true,
    icon: "⭐",
    description: "Premium features for professionals",
    features: [
      "100 invoices/month included",
      "Everything in Starter",
      "Custom logo branding",
      "Inventory management",
      "Team management (3 members)",
      "Priority support",
    ],
  },
  BUSINESS: {
    id: "BUSINESS",
    name: "Business",
    price: 10000,
    priceDisplay: "₦10,000/month",
    invoicesIncluded: 100,
    invoicesDisplay: "100 invoices included",
    hasMonthlySubscription: true,
    icon: "💼",
    description: "All features for scaling businesses",
    features: [
      "100 invoices/month included",
      "Everything in Pro",
      "Voice invoices",
      "Photo OCR (15/mo)",
      "API access",
    ],
  },
};

/**
 * Plans available for paid upgrade selection (excludes FREE and STARTER)
 * STARTER has no monthly subscription - users just buy invoice packs
 */
export const PAID_PLANS: Plan[] = [
  PLANS.PRO,
  PLANS.BUSINESS,
];

/**
 * All plans in order for display
 */
export const ALL_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.STARTER,
  PLANS.PRO,
  PLANS.BUSINESS,
];

/**
 * Landing page pricing display
 * Excludes STARTER - it's not a plan, just a legacy pay-per-invoice tier
 * Users start FREE and can buy packs or upgrade to PRO/BUSINESS for monthly subscription
 */
export const LANDING_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.PRO,
  PLANS.BUSINESS,
];

/**
 * Feature availability by plan tier
 */
export const FEATURE_GATES = {
  TAX_REPORTS: ["STARTER", "PRO", "BUSINESS"] as PlanTier[],
  CUSTOM_BRANDING: ["PRO", "BUSINESS"] as PlanTier[],
  INVENTORY: ["PRO", "BUSINESS"] as PlanTier[],
  TEAM_MANAGEMENT: ["PRO", "BUSINESS"] as PlanTier[],
  PHOTO_OCR: ["BUSINESS"] as PlanTier[],
  API_ACCESS: ["BUSINESS"] as PlanTier[],
} as const;

/**
 * Business plan quota limitations
 */
export const BUSINESS_QUOTA = {
  OCR_LIMIT: 15, // Voice + Photo OCR per month
  INVOICES_INCLUDED: 100,
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
