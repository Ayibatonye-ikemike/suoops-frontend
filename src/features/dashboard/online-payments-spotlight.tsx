"use client";

import { useEffect, useState } from "react";
import { CreditCard, X, ArrowRight, Store } from "lucide-react";
import Link from "next/link";

import { dismiss, isDismissed } from "@/lib/dismissals";

const DISMISSED_KEY = "online-payments-spotlight-dismissed";
const REAPPEAR_DAYS = 10; // re-surface after 10 days until the user enables it

/**
 * "What's new" spotlight nudging established users to turn on online payments
 * (and their storefront). Rendered by DashboardNudges only for users who have
 * NOT yet enabled online payments, so it disappears the moment they do.
 *
 * Dismissible with a 10-day cooldown so we keep the reminder gentle.
 */
export function OnlinePaymentsSpotlight() {
  const [dismissed, setDismissed] = useState(true); // default hidden to avoid flash

  useEffect(() => {
    setDismissed(isDismissed(DISMISSED_KEY, REAPPEAR_DAYS));
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    dismiss(DISMISSED_KEY);
    setDismissed(true);
  };

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded-full p-1 text-emerald-700/60 transition hover:bg-emerald-100 hover:text-emerald-800"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <CreditCard className="h-5 w-5" />
        </div>

        <div className="flex-1 pr-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              New
            </span>
            <h3 className="text-base font-bold text-emerald-900">
              Get paid online 💳
            </h3>
          </div>

          <p className="text-sm leading-relaxed text-emerald-900/80">
            Turn on online payments and customers pay you by{" "}
            <strong>card or bank transfer</strong>. Payment auto-confirms and the
            money settles to your bank the next business day via Paystack — a flat{" "}
            <strong>3% only when you get paid</strong>, no monthly fee. Your manual
            invoices stay exactly the same.
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-900/70">
            <Store className="h-4 w-4 shrink-0" />
            You also get a <strong>&nbsp;shareable storefront</strong>&nbsp;— one link
            of all your products to post on WhatsApp, Instagram or your bio.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/settings#online-payments"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              Set it up
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleDismiss}
              className="text-sm font-medium text-emerald-800/70 transition hover:text-emerald-900"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
