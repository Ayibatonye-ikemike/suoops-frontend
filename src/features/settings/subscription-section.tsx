"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { PlanSelectionModal } from "./plan-selection-modal";

type SubscriptionPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS" | "ENTERPRISE";

interface PlanDetails {
  name: string;
  price: string;
  limit: string;
  features: string[];
}

const PLAN_DETAILS: Record<SubscriptionPlan, PlanDetails> = {
  FREE: {
    name: "Free",
    price: "₦0/month",
    limit: "5 invoices/month",
    features: ["Basic invoice generation", "PDF exports", "WhatsApp integration"],
  },
  STARTER: {
    name: "Starter",
    price: "₦2,500/month",
    limit: "100 invoices/month",
    features: ["WhatsApp invoicing", "PDF generation", "Email delivery", "Payment tracking"],
  },
  PRO: {
    name: "Pro",
    price: "₦7,500/month",
    limit: "1,000 invoices/month",
    features: ["Everything in Starter", "Logo branding", "Phone verification", "Voice notes"],
  },
  BUSINESS: {
    name: "Business",
    price: "₦15,000/month",
    limit: "3,000 invoices/month",
    features: ["Everything in Pro", "Priority processing", "Email support", "Lower rates"],
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: "₦50,000/month",
    limit: "Unlimited invoices",
    features: ["Everything in Business", "Custom features", "Direct support", "Volume discount"],
  },
};

export function SubscriptionSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-accent/10 bg-gradient-to-br from-brand-surface via-brand-primary/90 to-brand-surface p-6 text-brand-accent shadow-xl shadow-brand-surface/70">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent/30 via-brand-accent/50 to-brand-accent/30" />
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-brand-primary/40" />
          <div className="h-20 w-full rounded bg-brand-primary/40" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-accent/10 bg-gradient-to-br from-brand-surface via-brand-primary/90 to-brand-surface p-6 text-sm text-brand-accent/80 shadow-xl shadow-brand-surface/70">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent/30 via-brand-accent/50 to-brand-accent/30" />
        Unable to load subscription details.
      </div>
    );
  }

  const currentPlan = (user?.plan || "FREE") as SubscriptionPlan;
  const planDetails = PLAN_DETAILS[currentPlan] || PLAN_DETAILS.FREE;
  const invoicesUsed = user?.invoices_this_month || 0;
  const invoiceLimit = currentPlan === "ENTERPRISE" ? "∞" : (planDetails.limit?.split(" ")[0] || "5");
  const invoiceLimitValue = invoiceLimit === "∞" ? Number.POSITIVE_INFINITY : Number(invoiceLimit) || 0;
  const usagePercent = invoiceLimitValue === Number.POSITIVE_INFINITY || invoiceLimitValue === 0
    ? 0
    : Math.min((invoicesUsed / invoiceLimitValue) * 100, 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-accent/10 bg-gradient-to-br from-brand-surface via-brand-primary/90 to-brand-surface text-brand-accent shadow-2xl shadow-brand-surface/80">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent/30 via-brand-accent/50 to-brand-accent/30" />
      <div className="border-b border-brand-accent/10 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-brand-accent">Subscription Plan</h2>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent/70">
            <span className="block h-1 w-6 rounded-full bg-brand-accent/60" />
            Stay compliant &amp; connected
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-accent/70">Manage your subscription, usage, and upgrade options in one place.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent shadow-inner shadow-brand-accent/40">
                  <span className="text-2xl">
                    {currentPlan === "FREE" && "🆓"}
                    {currentPlan === "STARTER" && "🚀"}
                    {currentPlan === "PRO" && "⭐"}
                    {currentPlan === "BUSINESS" && "💼"}
                    {currentPlan === "ENTERPRISE" && "👑"}
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                    Current Plan
                    {planDetails.name !== "Free" && <span className="text-brand-primary/70">•</span>}
                    <span>{planDetails.name}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold leading-tight text-brand-accent">{planDetails.price}</p>
                  <p className="text-sm text-brand-accent/70">{planDetails.limit}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-accent/15 bg-brand-surface/50 p-5 shadow-lg shadow-brand-surface/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-accent">Invoice usage this month</p>
                  <p className="text-xs text-brand-accent/70">Usage resets on the 1st of every month.</p>
                </div>
                <span className="text-base font-semibold text-brand-accent">
                  {invoicesUsed} of {invoiceLimit}
                </span>
              </div>
              {currentPlan !== "ENTERPRISE" && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-accent/25">
                  <div
                    className="h-full rounded-full bg-brand-accent transition-all"
                    style={{
                      width: `${usagePercent}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-brand-accent">Plan features</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {planDetails.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 rounded-xl border border-brand-accent/20 bg-brand-surface/50 px-3 py-2 text-sm text-brand-accent"
                  >
                    <span className="text-brand-accent">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {currentPlan !== "ENTERPRISE" && (
          <div className="mt-8 rounded-2xl border border-brand-accent/15 bg-brand-accent p-5 text-brand-primary shadow-lg shadow-brand-surface/60">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Need more headroom?</p>
                <p className="text-sm text-brand-primary/70">
                  Upgrade your plan to expand invoice limits, unlock automation, and priority support.
                </p>
              </div>
              <Button
                onClick={() => setIsModalOpen(true)}
                size="sm"
                className="w-full bg-brand-primary text-brand-accent hover:bg-brand-primary/90 md:w-auto"
              >
                Choose Your Plan
              </Button>
            </div>
          </div>
        )}

        <PlanSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentPlan={currentPlan}
        />
      </div>
    </div>
  );
}
