"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Lightbulb, ChevronRight } from "lucide-react";
import Link from "next/link";

const SEEN_KEY = "feature-tips-v2-seen";
const DISMISSED_KEY = "feature-tips-v2-dismissed";

interface FeatureTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export const FEATURE_TIPS: FeatureTip[] = [
  {
    id: "storefront",
    icon: "🛍️",
    title: "Sell from your own online storefront",
    description:
      "Add products or services, publish your shop, and share one link anywhere you sell.",
    action: { label: "Set up Storefront", href: "/dashboard/settings#storefront" },
  },
  {
    id: "buyer-protection-delivery",
    icon: "🛡️",
    title: "Buyer protection and delivery are built in",
    description:
      "Storefront customers pay online and choose delivery. Track protected orders from Invoices.",
    action: { label: "View Orders", href: "/dashboard/invoices" },
  },
  {
    id: "inventory",
    icon: "📦",
    title: "Know what is in stock",
    description:
      "Manage products and services, update quantities, and get low-stock warnings before you run out.",
    action: { label: "Open Inventory", href: "/dashboard/inventory" },
  },
  {
    id: "invoice-verification",
    icon: "🔐",
    title: "Send branded, verifiable invoices",
    description:
      "Your invoices can include your logo, payment details, and a QR code customers can scan to verify them.",
    action: { label: "Open Invoices", href: "/dashboard/invoices" },
  },
  {
    id: "expense-whatsapp",
    icon: "💸",
    title: "Track expenses via WhatsApp",
    description:
      'Text "Expense: ₦5,000 for transport" or snap a receipt photo to the bot — it logs automatically.',
    action: { label: "Open WhatsApp", href: "https://wa.me/2348106865807?text=Hi" },
  },
  {
    id: "analytics",
    icon: "📊",
    title: "See your business insights",
    description:
      "View revenue trends, invoice metrics & top customers on the Insights page.",
    action: { label: "Open Insights", href: "/dashboard/analytics" },
  },
  {
    id: "expense-dashboard",
    icon: "📝",
    title: "Track spending on the Expenses page",
    description:
      "Log expenses with categories & receipts. They're auto-included in your tax reports.",
    action: { label: "Open Expenses", href: "/dashboard/expenses" },
  },
  {
    id: "tax-report",
    icon: "🏛️",
    title: "Download Nigeria-focused tax reports",
    description:
      "See your tax position clearly and download reports without accounting jargon.",
    action: { label: "Open Tax", href: "/dashboard/tax" },
  },
  {
    id: "whatsapp-report",
    icon: "📊",
    title: "Get reports on WhatsApp",
    description:
      'Text "report" to the bot for a 30-day business snapshot. Text "tax report" for your tax summary.',
    action: { label: "Open WhatsApp", href: "https://wa.me/2348106865807?text=report" },
  },
  {
    id: "team",
    icon: "👥",
    title: "Give your team the right access",
    description:
      "Invite team members so they can help run the business without sharing your login.",
    action: { label: "Manage Team", href: "/dashboard/settings#team" },
  },
  {
    id: "currency",
    icon: "💱",
    title: "Switch between Naira & USD",
    description:
      'Text "usd" or "naira" to the WhatsApp bot to change your display currency across reports.',
  },
];

/**
 * Rotating feature discovery tips for existing users.
 * Shows one tip at a time, cycling through unseen tips.
 * Users can dismiss individual tips or hide the whole widget.
 */
export function FeatureDiscoveryTips() {
  const [currentTip, setCurrentTip] = useState<FeatureTip | null>(null);
  const [hidden, setHidden] = useState(true);

  const getSeenTips = useCallback((): string[] => {
    try {
      return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
    } catch {
      return [];
    }
  }, []);

  const pickNextTip = useCallback(() => {
    if (localStorage.getItem(DISMISSED_KEY) === "true") {
      setHidden(true);
      return;
    }
    const seen = getSeenTips();
    const unseen = FEATURE_TIPS.filter((t) => !seen.includes(t.id));
    if (unseen.length === 0) {
      // All seen — hide permanently
      localStorage.setItem(DISMISSED_KEY, "true");
      setHidden(true);
      return;
    }
    setCurrentTip(unseen[0]);
    setHidden(false);
  }, [getSeenTips]);

  useEffect(() => {
    pickNextTip();
  }, [pickNextTip]);

  const handleDismissTip = () => {
    if (!currentTip) return;
    const seen = getSeenTips();
    seen.push(currentTip.id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    pickNextTip();
  };

  const handleDismissAll = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setHidden(true);
  };

  if (hidden || !currentTip) return null;

  return (
    <div className="mb-4 rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50/50 px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-base">
          {currentTip.icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600">
              Did you know?
            </span>
          </div>
          <p className="text-sm font-semibold text-brand-text">
            {currentTip.title}
          </p>
          <p className="mt-0.5 text-xs text-brand-textMuted leading-relaxed">
            {currentTip.description}
          </p>
          {currentTip.action && (
            <Link
              href={currentTip.action.href}
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-jadeText hover:text-brand-jadeHover transition"
            >
              {currentTip.action.label}
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleDismissTip}
            className="rounded-md px-2 py-1 text-[10px] font-semibold text-amber-700 hover:bg-amber-100 transition"
            title="Next tip"
          >
            Next →
          </button>
          <button
            onClick={handleDismissAll}
            className="rounded-md p-1 text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition"
            aria-label="Hide tips"
            title="Hide all tips"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
