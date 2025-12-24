"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { initializeSubscription, switchToStarter } from "@/api/subscription";
import { PAID_PLANS, type Plan } from "../../constants/pricing";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

export function PlanSelectionModal({
  isOpen,
  onClose,
  currentPlan,
}: PlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const initializeMutation = useMutation({
    mutationFn: initializeSubscription,
    onSuccess: (data) => {
      // Redirect to Paystack checkout
      window.location.href = data.authorization_url;
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.detail || error.message
        : error instanceof Error
        ? error.message
        : null;
      alert(message || "Failed to initialize payment. Please try again.");
    },
  });

  const starterMutation = useMutation({
    mutationFn: switchToStarter,
    onSuccess: () => {
      alert("Switched to STARTER plan! You can now access tax features.");
      window.location.reload();
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.detail || error.message
        : error instanceof Error
        ? error.message
        : null;
      alert(message || "Failed to switch plan. Please try again.");
    },
  });

  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }
    
    // STARTER uses a different endpoint (no payment required)
    if (selectedPlan === "STARTER") {
      starterMutation.mutate();
    } else {
      initializeMutation.mutate(selectedPlan);
    }
  };

  const isPending = initializeMutation.isPending || starterMutation.isPending;
  const isStarterCurrent = currentPlan === "STARTER";
  const showStarter = currentPlan === "FREE"; // Only show STARTER option for FREE users

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 sm:px-6">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-brand-border bg-white p-6 text-brand-text shadow-2xl shadow-brand-border/30 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 hover:bg-brand-background transition-colors"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Choose Your Plan</h2>
          <p className="mt-2 text-brand-textMuted">
            {showStarter 
              ? "Switch to Starter (free, pay-per-invoice) or upgrade to Pro/Business for premium features"
              : "Upgrade to Pro for custom branding or Business for voice+OCR features"
            }
          </p>
        </div>

        {/* STARTER card for FREE users */}
        {showStarter && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setSelectedPlan("STARTER")}
              className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                selectedPlan === "STARTER"
                  ? "border-brand-jade bg-brand-jade/5 shadow-lg"
                  : "border-brand-border bg-white hover:border-brand-jade/50 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">🚀</div>
                  <h3 className="text-xl font-bold">Starter</h3>
                  <div className="text-2xl font-bold text-brand-jade mt-2">No Monthly Fee</div>
                  <p className="text-sm text-brand-textMuted mt-1">
                    Pay ₦2,500 per 100 invoices • Unlock tax reports & automation
                  </p>
                </div>
                {selectedPlan === "STARTER" && (
                  <svg className="h-8 w-8 text-brand-jade" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-brand-border"></div>
              <span className="px-4 text-sm text-brand-textMuted">or subscribe monthly</span>
              <div className="flex-1 border-t border-brand-border"></div>
            </div>
          </div>
        )}

        {/* Plan grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {PAID_PLANS.map((plan: Plan) => {
            const isCurrent = plan.id === currentPlan;
            const isSelected = selectedPlan === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                disabled={isCurrent}
                onClick={() => setSelectedPlan(plan.id)}
                className={`group relative rounded-xl border-2 p-6 text-left transition-all ${
                  isCurrent
                    ? "border-brand-border bg-brand-background cursor-not-allowed opacity-60"
                    : isSelected
                    ? "border-brand-jade bg-brand-jade/5 shadow-lg"
                    : "border-brand-border bg-white hover:border-brand-jade/50 hover:shadow-md"
                }`}
              >
                {plan.popular && !isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-jade px-3 py-1 text-xs font-semibold text-white">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-textMuted px-3 py-1 text-xs font-semibold text-white">
                      CURRENT PLAN
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-4xl mb-2">{plan.icon}</div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold">{plan.priceDisplay}</div>
                  {plan.hasMonthlySubscription && <div className="text-sm text-brand-textMuted">/month</div>}
                </div>

                <div className="mb-4 text-sm font-semibold text-brand-textMuted">
                  {plan.invoicesDisplay}
                </div>

                <ul className="space-y-2 text-sm text-brand-textMuted">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-brand-success"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {isSelected && !isCurrent && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-jade">
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-brand-border bg-white px-6 py-2.5 text-sm font-semibold text-brand-text hover:bg-brand-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={!selectedPlan || isPending}
            className="rounded-lg bg-brand-jade px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {isPending
              ? "Processing..."
              : selectedPlan === "STARTER"
              ? "Switch to Starter (Free)"
              : "Continue to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
