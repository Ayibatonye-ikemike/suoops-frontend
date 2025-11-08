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
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-brand-accent/15 bg-gradient-to-br from-brand-surface via-brand-primary/90 to-brand-surface p-6 text-brand-accent shadow-2xl shadow-brand-surface/80 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-accent/30 via-brand-accent/50 to-brand-accent/30" />
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-2xl text-brand-accent/70 transition hover:text-brand-accent"
          disabled={initializeMutation.isPending}
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-brand-accent">Choose Your Plan</h2>
          <p className="mt-2 text-sm text-brand-accent/70">
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
                    ? "cursor-not-allowed border-brand-accent/30 bg-brand-surface/40 text-brand-accent/50"
                    : isSelected
                    ? "border-brand-accent bg-brand-accent text-brand-primary shadow-xl shadow-brand-surface/60"
          : "border-brand-accent/20 bg-brand-surface/60 text-brand-accent hover:border-brand-accent"
        } ${plan.popular ? "ring-2 ring-brand-accent/60 ring-offset-2 ring-offset-brand-surface" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-primary">
                    Most Popular
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-brand-primary">
                    Current Plan
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    isSelected ? "bg-brand-primary/10 text-brand-primary" : "bg-brand-accent/10 text-brand-accent"
                  }`}>{plan.icon}</div>
                  <div>
                    <h3 className={`text-lg font-bold ${isSelected ? "text-brand-primary" : "text-brand-accent"}`}>{plan.name}</h3>
                    <p className={`text-sm ${isSelected ? "text-brand-primary/70" : "text-brand-accent/70"}`}>{plan.limit}</p>
                  </div>
                </div>

                <div>
                  <p className={`text-2xl font-bold ${isSelected ? "text-brand-primary" : "text-brand-accent"}`}>
                    {plan.price}
                    <span className={`text-sm font-normal ${isSelected ? "text-brand-primary/60" : "text-brand-accent/60"}`}>/month</span>
                  </p>
                </div>

                <ul className="flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className={`flex items-start gap-2 text-sm ${isSelected ? "text-brand-primary/80" : "text-brand-accent/80"}`}>
                      <span className={isSelected ? "text-brand-primary" : "text-brand-accent"}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isSelected && !isCurrent && (
                  <div className="mt-auto rounded-md bg-brand-primary/10 p-2 text-center text-sm font-medium text-brand-primary">
                    Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-4 border-t border-brand-accent/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-accent/70">
            💳 Secure payment powered by <strong>Paystack</strong>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onClose}
              disabled={initializeMutation.isPending}
              className="rounded-lg border border-brand-accent/30 px-4 py-2 text-sm font-medium text-brand-accent transition hover:bg-brand-surface/60 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpgrade}
              disabled={!selectedPlan || initializeMutation.isPending}
              className="rounded-lg bg-brand-accent px-6 py-2 text-sm font-medium text-brand-primary shadow-md transition hover:bg-brand-accentMuted/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {initializeMutation.isPending ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
