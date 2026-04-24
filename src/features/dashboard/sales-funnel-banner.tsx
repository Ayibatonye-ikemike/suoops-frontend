"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Zap,
  FileText,
  Crown,
  ArrowRight,
  ShoppingCart,
  X,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";

const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

interface UserData {
  name?: string;
  phone_verified?: boolean;
  plan?: string;
  invoice_balance?: number;
  invoices_this_month?: number;
  subscription_expires_at?: string | null;
}

/**
 * Sales funnel prompts shown on the dashboard.
 *
 * Three scenarios:
 * 1. Zero-invoice users → "Create your first invoice" CTA
 * 2. Free users with invoices → Plan comparison + upgrade/buy pack CTA
 * 3. Free users with 0 balance → Urgent "buy pack or upgrade" CTA
 *
 * Dismissable per session. Returns on next login.
 */
export function SalesFunnelBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("sales-funnel-dismissed") === "true");
  }, []);

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  if (isLoading || dismissed) return null;

  const plan = (user?.plan || "free").toLowerCase();
  const isPro = plan === "pro";
  const balance = user?.invoice_balance ?? 5;
  const hasInvoices = (user?.invoices_this_month ?? 0) > 0 || balance < 5;
  const hasPhone = Boolean(user?.phone_verified);
  const firstName = user?.name?.split(" ")[0] || "there";

  // Pro users don't need prompts
  if (isPro) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("sales-funnel-dismissed", "true");
    setDismissed(true);
  };

  // ── Scenario 1: Zero-invoice user — prompt to create first invoice ──
  if (!hasInvoices) {
    return (
      <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 relative overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {firstName}, create your first invoice!
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              You have {balance} free invoice{balance !== 1 ? "s" : ""} ready to use.
              Send one now and start collecting payments.
            </p>
            <div className="flex flex-wrap gap-3">
              {hasPhone ? (
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Create via WhatsApp
                </a>
              ) : (
                <button
                  onClick={() => {
                    sessionStorage.setItem("show-dashboard-form", "true");
                    window.location.reload();
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-jade/90"
                >
                  <FileText className="h-4 w-4" />
                  Create Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Scenario 2: Free user with 0 balance — urgent upgrade ──
  if (balance <= 0) {
    return (
      <div className="mb-6 rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5 relative overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-red-400 hover:bg-red-100 hover:text-red-600 transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              You&apos;re out of invoices!
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Choose an option to keep your business running:
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/billing/purchase"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-jade/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy 50 for ₦1,250
              </Link>
              <Link
                href="/dashboard/settings/subscription"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-amber-400 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro — ₦3,250/mo
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Scenario 3: Free user with invoices — show plan comparison ──
  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm relative overflow-hidden">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-lg p-1 text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">
          Choose your plan
        </h3>
        <p className="text-sm text-slate-500">
          You&apos;re on the free plan with {balance} invoice{balance !== 1 ? "s" : ""} left.
          Upgrade or buy more anytime.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Free plan */}
        <div className="rounded-xl border-2 border-brand-jade/30 bg-emerald-50/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🚀</span>
            <span className="text-sm font-bold text-slate-900">Starter (Free)</span>
            <span className="ml-auto rounded-full bg-brand-jade/10 px-2 py-0.5 text-[10px] font-bold text-brand-jade uppercase">Current</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 mb-3">
            <li>✓ 5 invoices to start</li>
            <li>✓ Buy more: 50 for ₦1,250</li>
            <li>✓ WhatsApp & Email delivery</li>
            <li>✓ PDF & QR verification</li>
          </ul>
          <Link
            href="/dashboard/billing/purchase"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-jade bg-white px-3 py-2 text-xs font-semibold text-brand-jade transition hover:bg-emerald-50"
          >
            <ShoppingCart className="h-3 w-3" />
            Buy 50 Invoices — ₦1,250
          </Link>
        </div>

        {/* Pro plan */}
        <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 p-4 relative">
          <div className="absolute -top-1 right-3 rounded-b-lg bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
            Recommended
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⭐</span>
            <span className="text-sm font-bold text-slate-900">Pro</span>
            <span className="ml-auto text-sm font-bold text-amber-700">₦3,250/mo</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-600 mb-3">
            <li>✓ 50 invoices/month included</li>
            <li>✓ Tax reports (PIT + CIT)</li>
            <li>✓ Daily WhatsApp summary</li>
            <li>✓ Customer insights & alerts</li>
            <li>✓ Team management (3 members)</li>
            <li>✓ Priority support</li>
          </ul>
          <Link
            href="/dashboard/settings/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-white transition hover:bg-amber-500"
          >
            <Crown className="h-3 w-3" />
            Upgrade to Pro
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
