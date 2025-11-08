"use client";

import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";

import { initializeSubscription } from "@/api/subscription";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
}

interface PlanOption {
  name: string;
  value: string;
  price: string;
  limit: string;
  features: string[];
  icon: string;
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    name: "Starter",
    value: "STARTER",
    price: "₦2,500",
    limit: "100 invoices/month",
    icon: "🚀",
    features: ["WhatsApp invoicing", "PDF generation", "Email delivery", "Payment tracking"],
  },
  {
    name: "Pro",
    value: "PRO",
    price: "₦7,500",
    limit: "1,000 invoices/month",
    icon: "⭐",
    popular: true,
    features: ["Everything in Starter", "Logo branding", "Phone verification", "Voice notes"],
  },
  {
    name: "Business",
    value: "BUSINESS",
    price: "₦15,000",
    limit: "3,000 invoices/month",
    icon: "💼",
    features: ["Everything in Pro", "Priority processing", "Email support", "Lower rates"],
  },
  {
    name: "Enterprise",
    value: "ENTERPRISE",
    price: "₦50,000",
    limit: "Unlimited invoices",
    icon: "👑",
    features: ["Everything in Business", "Custom features", "Direct support", "Volume discount"],
  },
];

export function PlanSelectionModal({ isOpen, onClose, currentPlan }: PlanModalProps) {
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

  if (!isOpen) return null;

  const handleUpgrade = () => {
    if (!selectedPlan) {
      alert("Please select a plan");
      return;
    }
    initializeMutation.mutate(selectedPlan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-brand-accentMuted/60 bg-brand-accent/95 p-6 text-brand-primary shadow-2xl shadow-brand-surface/50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-brand-primary/60 transition hover:text-brand-primary"
          disabled={initializeMutation.isPending}
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Choose Your Plan</h2>
          <p className="mt-2 text-sm text-brand-primary/70">
            Select a plan and pay securely via Paystack. Your plan will be upgraded immediately after
            payment.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent = plan.value === currentPlan;
            const isSelected = plan.value === selectedPlan;

            return (
              <div
                key={plan.value}
                onClick={() => !isCurrent && setSelectedPlan(plan.value)}
                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                  isCurrent
                    ? "cursor-not-allowed border-emerald-400 bg-emerald-100/70 opacity-60"
                    : isSelected
                    ? "border-brand-primary bg-brand-primary/15"
                    : "border-brand-accentMuted hover:border-brand-primary"
                } ${plan.popular ? "ring-2 ring-brand-primary/70 ring-offset-2 ring-offset-brand-accent" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-accent">
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-brand-accent">
                    Current Plan
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="text-3xl">{plan.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="text-sm text-brand-primary/70">{plan.limit}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-2xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-brand-primary/60">/month</span>
                  </p>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-brand-primary/80">
                      <span className="text-brand-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && !isCurrent && (
                  <div className="mt-3 rounded-md bg-brand-primary/15 p-2 text-center text-sm font-medium text-brand-primary">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-brand-accentMuted/60 pt-4">
          <p className="text-sm text-brand-primary/70">
            💳 Secure payment powered by <strong>Paystack</strong>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={initializeMutation.isPending}
              className="rounded-lg border border-brand-accentMuted px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-accentMuted/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan || initializeMutation.isPending}
              className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-medium text-brand-accent shadow-md transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {initializeMutation.isPending ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
