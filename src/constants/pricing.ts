/**
 * Centralized pricing and plan configuration
 * Single source of truth for all subscription tiers
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
  invoiceLimit: number;
  invoiceLimitDisplay: string;
  features: string[];
  popular?: boolean;
  icon?: string;
  description?: string;
}

/**
 * Complete plan definitions
 * Backend contract: PLAN_PRICES in app/api/routes_subscription.py
 */
export const PLANS: Record<PlanTier, Plan> = {
  FREE: {
    id: "FREE",
    name: "Free",
    price: 0,
    priceDisplay: "₦0",
    invoiceLimit: 5,
    invoiceLimitDisplay: "5 invoices/month",
    description: "Manual invoices only",
    features: [
      "Manual invoices only",
      "WhatsApp & Email",
      "PDF generation",
      "QR verification",
    ],
  },
  STARTER: {
    id: "STARTER",
    name: "Starter",
    price: 4500,
    priceDisplay: "₦4,500",
    invoiceLimit: 100,
    invoiceLimitDisplay: "100 invoices/month",
    popular: true,
    icon: "🚀",
    description: "Tax automation for growing businesses",
    features: [
      "Everything in Free",
      "Tax reports",
      "Monthly tax automation",
    ],
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: 8000,
    priceDisplay: "₦8,000",
    invoiceLimit: 200,
    invoiceLimitDisplay: "200 invoices/month",
    icon: "⭐",
    description: "Professional branding and team management",
    features: [
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
    price: 16000,
    priceDisplay: "₦16,000",
    invoiceLimit: 300,
    invoiceLimitDisplay: "300 invoices/month",
    icon: "💼",
    description: "Advanced features with voice and OCR",
    features: [
      "Everything in Pro",
      "Voice invoices (15/mo)",
      "Photo OCR (15/mo)",
      "API access",
    ],
  },
};

/**
 * Plans available for upgrade selection (excludes FREE)
 */
export const PAID_PLANS: Plan[] = [
  PLANS.STARTER,
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
 */
export const LANDING_PLANS: Plan[] = [
  PLANS.FREE,
  PLANS.STARTER,
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
  VOICE_INVOICES: ["BUSINESS"] as PlanTier[],
  PHOTO_OCR: ["BUSINESS"] as PlanTier[],
  API_ACCESS: ["BUSINESS"] as PlanTier[],
} as const;

/**
 * Business plan quota limitations (5% of invoice limit)
 */
export const BUSINESS_QUOTA = {
  VOICE_OCR_LIMIT: 15, // 5% of 300 invoices
  TOTAL_INVOICES: 300,
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
