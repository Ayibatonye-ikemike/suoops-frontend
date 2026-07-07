"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { isDismissed } from "@/lib/dismissals";

import { FeatureDiscoveryTips } from "./feature-discovery-tips";
import { LowBalanceBanner } from "./low-balance-banner";
import { OnlinePaymentsSpotlight } from "./online-payments-spotlight";
import { SalesFunnelBanner } from "./sales-funnel-banner";
import { WhatsAppSetupBanner } from "./whatsapp-setup-banner";

interface UserData {
  plan?: string;
  phone_verified?: boolean;
  invoice_balance?: number;
  invoices_this_month?: number;
  online_payments_enabled?: boolean;
  has_invoiced?: boolean;
}

/**
 * Pick the single most useful nudge to show right now.
 *
 * The dashboard previously stacked 5+ banners simultaneously, burying the
 * actual content. This orchestrator evaluates the user's state and renders
 * exactly one — the highest-priority one that still applies and hasn't
 * been dismissed within its TTL window.
 *
 * Priority order (high → low):
 *   1. WhatsApp setup       — unblocks bot-based invoicing
 *   2. Low balance          — unblocks dashboard-based invoicing
 *   3. Sales funnel         — first-invoice activation prompt
 *   4. Online payments      — "what's new" adoption spotlight
 *   5. Feature tip          — exploration nudge for established users
 *
 * The referral banner is rendered separately on the dashboard so every
 * user (free + Pro) always sees the earn-cash opportunity, not just
 * those past the activation funnel.
 */
export function DashboardNudges() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 60_000,
  });

  // Don't render anything during SSR or while user data is unknown — avoids
  // a flash of the wrong banner before priority is established.
  if (!hydrated || isLoading || !user) return null;

  const plan = (user.plan || "free").toLowerCase();
  const isPro = plan === "pro";
  const balance = user.invoice_balance ?? 2;
  const hasInvoiced = Boolean(user.has_invoiced);

  // 1. WhatsApp setup — every user benefits, regardless of plan
  if (!user.phone_verified && !isDismissed("whatsapp-setup-banner-dismissed")) {
    return <WhatsAppSetupBanner />;
  }

  // 2. Low balance — only relevant to FREE users with ≤2 invoices left
  if (
    !isPro &&
    balance <= 2 &&
    !isDismissed("low-balance-banner-dismissed", balance === 0 ? 0 : 1)
  ) {
    return <LowBalanceBanner />;
  }

  // 3. Sales funnel — first-invoice activation
  if (!isPro && !hasInvoiced) {
    return <SalesFunnelBanner />;
  }

  // 4. Online payments spotlight — adoption nudge for users not yet monetizing
  //    online. Hides automatically once they enable it.
  if (
    !user.online_payments_enabled &&
    !isDismissed("online-payments-spotlight-dismissed", 10)
  ) {
    return <OnlinePaymentsSpotlight />;
  }

  // 5. Feature tip — last priority, exploratory
  return <FeatureDiscoveryTips />;
}
