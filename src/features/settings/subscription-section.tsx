"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlanSelectionModal } from "./plan-selection-modal";
import { SubscriptionManagement } from "./subscription-management";
import { type PlanTier, getPlan, getPlanDisplayName, INVOICE_PACK_PRICE, INVOICE_PACK_SIZE } from "../../constants/pricing";

interface SubscriptionSectionProps {
  user?: {
    plan?: string;
    invoice_balance?: number;
    invoices_this_month?: number; // deprecated, kept for backward compat
    subscription_expires_at?: string | null;
    subscription_started_at?: string | null;
  };
}

export function SubscriptionSection({ user }: SubscriptionSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-brand-background" />
          <div className="h-20 w-full rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  const rawPlan = user?.plan?.toUpperCase() || "FREE";
  // Map legacy "STARTER" from backend to "FREE"
  const normalizedPlan = (rawPlan === "STARTER" ? "FREE" : rawPlan) as PlanTier;
  const planDetails = getPlan(normalizedPlan);
  const displayName = getPlanDisplayName(normalizedPlan);
  const invoiceBalance = user?.invoice_balance ?? 0;

  // Format subscription dates
  const subscriptionExpiresAt = user?.subscription_expires_at
    ? new Date(user.subscription_expires_at)
    : null;
  // Only PRO has monthly subscriptions
  const hasMonthlySubscription = normalizedPlan === "PRO";
  const isExpiringSoon =
    subscriptionExpiresAt &&
    subscriptionExpiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-brand-border bg-white text-brand-text shadow-card">
      <div className="border-b border-brand-border px-6 py-5 sm:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-[22px] font-semibold text-brand-text">
            Subscription Plan
          </h2>
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-textMuted">
            <span className="block h-1 w-6 rounded-full bg-brand-jade/60" />
            Stay compliant &amp; connected
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-textMuted">
          Manage your subscription, usage, and upgrade options in one place.
        </p>
      </div>

      <div className="px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-background text-2xl">
                  {normalizedPlan === "FREE" && "🚀"}
                  {normalizedPlan === "PRO" && "⭐"}
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-jade px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    Current Plan
                    {displayName !== "Starter" && (
                      <span className="opacity-70">•</span>
                    )}
                    <span>{displayName}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold leading-tight text-brand-text">
                    {planDetails.priceDisplay}
                  </p>
                  <p className="text-sm text-brand-textMuted">
                    {planDetails.invoicesDisplay}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-brand-border bg-brand-background p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-text">
                    Invoice Balance
                  </p>
                  <p className="text-xs text-brand-textMuted">
                    {invoiceBalance <= 10
                      ? "⚠️ Running low – purchase a pack to continue creating invoices"
                      : "Available invoices for creating revenue invoices"}
                  </p>
                </div>
                <span className={`text-2xl font-bold ${invoiceBalance <= 10 ? 'text-amber-600' : 'text-brand-jade'}`}>
                  {invoiceBalance}
                </span>
              </div>
              
              {/* Buy More Invoices Button */}
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-brand-textMuted">
                  Need more? Buy packs of {INVOICE_PACK_SIZE} invoices for ₦{INVOICE_PACK_PRICE.toLocaleString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "/dashboard/billing/purchase"}
                  className="w-full sm:w-auto"
                >
                  Buy Invoice Pack
                </Button>
              </div>
            </div>

            {/* Subscription Expiry Notice for PRO/BUSINESS Plans Only */}
            {hasMonthlySubscription && subscriptionExpiresAt && (
              <div
                className={`rounded-2xl border p-4 ${
                  isExpiringSoon
                    ? "border-amber-300 bg-amber-50"
                    : "border-brand-border bg-brand-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{isExpiringSoon ? "⚠️" : "📅"}</div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isExpiringSoon ? "text-amber-700" : "text-brand-text"
                      }`}
                    >
                      {isExpiringSoon
                        ? "Pro features expiring soon"
                        : "Pro features active"}
                    </p>
                    <p
                      className={`text-xs ${
                        isExpiringSoon
                          ? "text-amber-600"
                          : "text-brand-textMuted"
                      }`}
                    >
                      {isExpiringSoon
                        ? `Expires on ${formatDate(subscriptionExpiresAt)} – buy a Pro Pack or subscribe to Pro Features to keep your ${planDetails.name} features`
                        : `Pro features active until ${formatDate(subscriptionExpiresAt)}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Subscription Management (Cancel/Status) for Pro users */}
            {hasMonthlySubscription && (
              <SubscriptionManagement />
            )}

            <div>
              <p className="text-sm font-semibold text-brand-text">
                Plan features
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {planDetails.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 rounded-xl border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text"
                  >
                    <span className="text-brand-jade">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {normalizedPlan !== "PRO" && (
            <div className="mt-8 rounded-2xl border border-brand-border bg-brand-background p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-text">
                    Need more headroom?
                  </p>
                  <p className="text-sm text-brand-textMuted">
                    Upgrade to Pro for custom branding,
                    inventory, analytics, and tax reports.
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

        {/* Payment History Link */}
        <div className="mt-6 rounded-lg border border-brand-border bg-brand-background p-4">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-brand-jade hover:text-brand-jade"
            onClick={() =>
              (window.location.href = "/dashboard/subscription/history")
            }
          >
            View Payment History →
          </Button>
        </div>

        <PlanSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          currentPlan={normalizedPlan}
        />
      </div>
    </div>
  );
}
