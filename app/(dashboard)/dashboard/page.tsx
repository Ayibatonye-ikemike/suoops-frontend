"use client";

import { Suspense } from "react";
import { InvoiceCreateForm } from "@/features/invoices/invoice-create-form";
import { InvoiceListWithDetail } from "@/features/invoices/invoice-list-with-detail";
import { InvoiceStatusCard } from "@/features/invoices/invoice-status-card";
import { WhatsAppSetupBanner } from "@/features/dashboard/whatsapp-setup-banner";
import { LowBalanceBanner } from "@/features/dashboard/low-balance-banner";
import { CashPositionCard } from "@/features/dashboard/cash-position-card";
import { ProfessionalismScoreCard } from "@/features/dashboard/professionalism-score-card";
import { WelcomeGuide, useShowDashboardForm } from "@/features/dashboard/welcome-guide";
import { SalesFunnelBanner } from "@/features/dashboard/sales-funnel-banner";
import { PhoneRequiredGate } from "@/features/dashboard/phone-required-gate";
import { BankDetailsRequiredGate } from "@/features/dashboard/bank-details-required-gate";
import { NewUserOnboarding } from "@/features/dashboard/new-user-onboarding";
import { FeatureDiscoveryTips } from "@/features/dashboard/feature-discovery-tips";

// Wrap InvoiceListWithDetail in its own Suspense for useSearchParams
function InvoiceListWrapper() {
  return (
    <Suspense
      fallback={
        <div className="h-48 animate-pulse rounded-lg bg-brand-background sm:h-64" />
      }
    >
      <InvoiceListWithDetail />
    </Suspense>
  );
}

export default function DashboardPage() {
  const showForm = useShowDashboardForm();

  return (
    <PhoneRequiredGate>
    <BankDetailsRequiredGate>
    <NewUserOnboarding>
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl  text-white font-bold sm:text-2xl">
            Your Payment Overview
          </h1>
          <p className="mt-1 text-xs text-brand-mint sm:text-sm">
            Your money status at a glance
          </p>
        </div>

        {/* Welcome Guide for first-time users */}
        <WelcomeGuide />

        {/* Sales funnel: plan selector, create invoice prompt, upgrade CTA */}
        <SalesFunnelBanner />

        {/* WhatsApp Setup Banner for new users */}
        <WhatsAppSetupBanner />

        {/* Low Balance Banner for users running low on invoices */}
        <LowBalanceBanner />

        {/* Feature discovery tips for existing users */}
        <FeatureDiscoveryTips />

        <div className="space-y-4 sm:space-y-6">
          {/* Cash-First Position Cards — the numbers that matter most */}
          <CashPositionCard />

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
            {/* Create Invoice - Left side (6 columns) — hidden until onboarding done */}
            {showForm && (
              <div className="lg:col-span-6">
                <div className="rounded-lg border border-brand-border bg-white p-4 shadow-card sm:p-6">
                  <InvoiceCreateForm />
                </div>
              </div>
            )}

            {/* Invoice Status - Middle (3 columns, or wider when form hidden) */}
            <div className={showForm ? "lg:col-span-3" : "lg:col-span-6"}>
              <div className="space-y-4">
                <Suspense
                  fallback={
                    <div className="h-48 animate-pulse rounded-lg bg-brand-background sm:h-64" />
                  }
                >
                  <InvoiceStatusCard />
                </Suspense>

                {/* Professionalism Score — motivational nudge */}
                <ProfessionalismScoreCard />
              </div>
            </div>

            {/* Invoice List - Right side (3 columns, or wider when form hidden) */}
            <div className={showForm ? "lg:col-span-3" : "lg:col-span-6"}>
              <InvoiceListWrapper />
            </div>
          </div>
        </div>
      </div>
    </main>
    </NewUserOnboarding>
    </BankDetailsRequiredGate>
    </PhoneRequiredGate>
  );
}
