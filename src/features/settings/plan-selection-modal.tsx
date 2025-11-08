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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8 sm:px-6">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-brand-border bg-white p-6 text-brand-text shadow-2xl shadow-brand-border/30 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-brand-textMuted transition hover:text-brand-text"
          disabled={initializeMutation.isPending}
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-brand-text">Choose Your Plan</h2>
          <p className="mt-2 text-sm text-brand-textMuted">
            Select a plan and pay securely via Paystack. Your plan will be upgraded immediately after
            payment.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {PLANS.map((plan) => {
            const isCurrent = plan.value === currentPlan;
            const isSelected = plan.value === selectedPlan;

            return (
              <div
                key={plan.value}
                onClick={() => !isCurrent && setSelectedPlan(plan.value)}
                className={`relative flex h-full cursor-pointer flex-col gap-4 rounded-xl border-2 p-4 transition-all ${
                  isCurrent
                    ? "cursor-not-allowed border-brand-border bg-white text-brand-textMuted"
                    : isSelected
                    ? "border-brand-primary bg-brand-primary text-white shadow-xl shadow-brand-border/40"
                    : "border-brand-border bg-brand-background text-brand-text hover:border-brand-primary/40"
                } ${plan.popular ? "ring-2 ring-brand-primary/40 ring-offset-2 ring-offset-white" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4 rounded-full bg-brand-background px-3 py-1 text-xs font-semibold text-brand-text">
                    Current Plan
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    isSelected ? "bg-white/20 text-white" : "bg-brand-background text-brand-text"
                  }`}>{plan.icon}</div>
                  <div>
                    <h3 className={`text-lg font-bold ${isSelected ? "text-white" : "text-brand-text"}`}>{plan.name}</h3>
                    <p className={`text-sm ${isSelected ? "text-white/80" : "text-brand-textMuted"}`}>{plan.limit}</p>
                  </div>
                </div>

                <div>
                  <p className={`text-2xl font-bold ${isSelected ? "text-white" : "text-brand-text"}`}>
                    {plan.price}
                    <span className={`text-sm font-normal ${isSelected ? "text-white/80" : "text-brand-textMuted"}`}>/month</span>
                  </p>
                </div>

                <ul className="flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm ${isSelected ? "text-white/80" : "text-brand-textMuted"}`}>
                      <span className={isSelected ? "text-white" : "text-brand-primary"}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && !isCurrent && (
                  <div className="mt-auto rounded-md bg-white/20 p-2 text-center text-sm font-medium text-white">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-4 border-t border-brand-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-textMuted">
            💳 Secure payment powered by <strong>Paystack</strong>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={initializeMutation.isPending}
              className="rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-text transition hover:bg-brand-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan || initializeMutation.isPending}
              className="rounded-lg bg-brand-primary px-6 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {initializeMutation.isPending ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
