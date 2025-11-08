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
      <div className="relative overflow-hidden rounded-2xl border border-brand-accentMuted/60 bg-gradient-to-br from-brand-accent via-brand-accent/95 to-brand-accent p-6 text-brand-primary shadow-lg shadow-brand-surface/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary/20 via-brand-primary/40 to-brand-primary/20" />
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-brand-accentMuted/60" />
          <div className="h-20 w-full rounded bg-brand-accentMuted/60" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-accentMuted/60 bg-gradient-to-br from-brand-accent via-brand-accent/95 to-brand-accent p-6 text-sm text-brand-primary/80 shadow-lg shadow-brand-surface/40">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary/20 via-brand-primary/40 to-brand-primary/20" />
        Unable to load subscription details.
      </div>
    );
  }

  const currentPlan = (user?.plan || "FREE") as SubscriptionPlan;
  const planDetails = PLAN_DETAILS[currentPlan] || PLAN_DETAILS.FREE;
  const invoicesUsed = user?.invoices_this_month || 0;
  const invoiceLimit = currentPlan === "ENTERPRISE" ? "∞" : (planDetails.limit?.split(" ")[0] || "5");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-accentMuted/60 bg-gradient-to-br from-brand-accent via-brand-accent/95 to-brand-accent text-brand-primary shadow-lg shadow-brand-surface/40">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary/15 via-brand-primary/40 to-brand-primary/15" />
      <div className="border-b border-brand-accentMuted/60 px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Subscription Plan</h2>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary/70">
            <span className="block h-1 w-6 rounded-full bg-brand-primary/60" />
            Stay compliant &amp; connected
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-primary/70">Manage your subscription, usage, and upgrade options in one place.</p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/15 shadow-inner shadow-brand-primary/20">
                  <span className="text-2xl">
                    {currentPlan === "FREE" && "🆓"}
                    {currentPlan === "STARTER" && "🚀"}
                    {currentPlan === "PRO" && "⭐"}
                    {currentPlan === "BUSINESS" && "💼"}
                    {currentPlan === "ENTERPRISE" && "👑"}
                  </span>
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
                    Current Plan
                    {planDetails.name !== "Free" && <span className="text-brand-primary/70">•</span>}
                    <span>{planDetails.name}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold leading-tight">{planDetails.price}</p>
                  <p className="text-sm text-brand-primary/70">{planDetails.limit}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-accentMuted/60 bg-brand-accent p-5 shadow-sm shadow-brand-surface/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-primary/80">Invoice usage this month</p>
                  <p className="text-xs text-brand-primary/60">Usage resets on the 1st of every month.</p>
                </div>
                <span className="text-base font-semibold">
                  {invoicesUsed} of {invoiceLimit}
                </span>
              </div>
              {currentPlan !== "ENTERPRISE" && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-primary/15">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all"
                    style={{
                      width: `${Math.min((invoicesUsed / parseInt(invoiceLimit)) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-brand-primary/80">Plan features</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {planDetails.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 rounded-xl border border-brand-accentMuted/60 bg-brand-accent px-3 py-2 text-sm text-brand-primary shadow-sm shadow-brand-surface/10"
                  >
                    <span className="text-brand-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {currentPlan !== "ENTERPRISE" && (
          <div className="mt-8 rounded-2xl border border-brand-accentMuted/60 bg-brand-primary/10 p-5 text-brand-primary shadow-sm shadow-brand-surface/20">
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
                className="w-full md:w-auto"
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
