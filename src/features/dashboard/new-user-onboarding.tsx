"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ArrowRight, Crown, ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";
import { PLANS, PACK_OPTIONS, INVOICE_PACK_PRICE, INVOICE_PACK_SIZE } from "@/constants/pricing";

const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

interface UserData {
  name?: string;
  business_name?: string | null;
  invoice_balance?: number;
}

interface InvoiceQuota {
  invoice_balance: number;
  total_invoices: number;
}

/**
 * New user onboarding — replaces the cluttered dashboard for users with 0 invoices.
 *
 * Flow:
 * 1. Pricing page (plans + packs) — "Here's how SuoOps works"
 * 2. After "Got it" → WhatsApp CTA + create first invoice
 *
 * Returns null (renders children/dashboard) if user has 1+ invoices.
 */
export function NewUserOnboarding({ children }: { children: React.ReactNode }) {
  const [seenPricing, setSeenPricing] = useState(false);

  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => (await apiClient.get<UserData>("/users/me")).data,
    staleTime: 60000,
  });

  const { data: quota, isLoading } = useQuery<InvoiceQuota>({
    queryKey: ["invoice-quota"],
    queryFn: async () => (await apiClient.get<InvoiceQuota>("/invoices/quota")).data,
    staleTime: 60000,
  });

  // Loading — show dashboard
  if (isLoading) return <>{children}</>;

  // Has invoices — show regular dashboard
  if (quota && quota.total_invoices > 0) return <>{children}</>;

  const firstName = user?.name?.split(" ")[0] || "there";
  const bizName = user?.business_name || "your business";

  // Step 1: Pricing page
  if (!seenPricing) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-brand-evergreen to-brand-teal">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="text-center text-white mb-8">
            <h1 className="text-3xl font-bold sm:text-4xl">Welcome, {firstName}! 🎉</h1>
            <p className="mt-3 text-lg text-white/80">
              Here&apos;s how {bizName} gets paid with SuoOps
            </p>
          </div>

          {/* How it works */}
          <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur p-6 text-white">
            <h2 className="text-lg font-bold mb-4">How it works</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xl font-bold">1</div>
                <p className="text-sm font-semibold">Type what you sold</p>
                <p className="text-xs text-white/70 mt-1">&quot;Invoice Joy 5000 hair&quot;</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xl font-bold">2</div>
                <p className="text-sm font-semibold">We create a PDF invoice</p>
                <p className="text-xs text-white/70 mt-1">Professional, with your bank details</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xl font-bold">3</div>
                <p className="text-sm font-semibold">Customer gets it instantly</p>
                <p className="text-xs text-white/70 mt-1">Via WhatsApp or email</p>
              </div>
            </div>
          </div>

          {/* Plans */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {/* Free / Starter */}
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                YOUR CURRENT PLAN
              </div>
              <h3 className="text-lg font-bold text-slate-900">{PLANS.FREE.displayName}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">Free</p>
              <p className="text-sm text-emerald-600 font-medium mt-1">{PLANS.FREE.invoicesDisplay}</p>
              <ul className="mt-4 space-y-2">
                {PLANS.FREE.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-2xl bg-white p-6 shadow-lg border-2 border-brand-jade">
              <div className="mb-3 inline-block rounded-full bg-brand-jade/10 px-3 py-1 text-xs font-semibold text-brand-jade">
                RECOMMENDED
              </div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                {PLANS.PRO.displayName}
              </h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-slate-900">{PLANS.PRO.priceDisplay}</span>
                <span className="text-slate-500">/month</span>
              </p>
              <p className="text-sm text-emerald-600 font-medium mt-1">{PLANS.PRO.invoicesDisplay}</p>
              <ul className="mt-4 space-y-2">
                {PLANS.PRO.features.slice(0, 6).map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-brand-jade mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
                <li className="text-xs text-slate-400">+ {PLANS.PRO.features.length - 6} more features</li>
              </ul>
            </div>
          </div>

          {/* Invoice Packs */}
          <div className="rounded-2xl bg-white/10 backdrop-blur p-6 text-white mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <ShoppingCart className="h-5 w-5" />
              <h3 className="text-lg font-bold">Need more invoices? Buy packs anytime</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="rounded-xl bg-white/10 p-4 text-center">
                <p className="text-2xl font-bold text-brand-chartreuse">25</p>
                <p className="text-sm text-white/80">invoices</p>
                <p className="mt-2 text-lg font-bold">₦625</p>
                <p className="text-xs text-white/60">₦25/invoice</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4 text-center border border-brand-chartreuse/50">
                <div className="text-xs font-bold text-brand-chartreuse mb-1">BEST VALUE</div>
                <p className="text-2xl font-bold text-brand-chartreuse">50</p>
                <p className="text-sm text-white/80">invoices</p>
                <p className="mt-2 text-lg font-bold">₦1,250</p>
                <p className="text-xs text-white/60">₦25/invoice</p>
              </div>
            </div>
            <p className="text-center text-xs text-white/60 mt-3">No subscription needed — buy as you grow</p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setSeenPricing(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-chartreuse px-8 py-4 text-lg font-bold text-brand-evergreen shadow-lg transition-all hover:scale-105 hover:bg-white"
            >
              Got it — let&apos;s create my first invoice
              <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-3 text-sm text-white/60">
              You have {quota?.invoice_balance ?? 2} free invoices to start
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Step 2: Create first invoice CTA
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-evergreen to-brand-teal">
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold">Create your first invoice</h1>
          <p className="mt-2 text-white/80">
            Send a professional invoice to your customer in seconds
          </p>
        </div>

        {/* WhatsApp CTA — primary */}
        <div className="rounded-2xl bg-white p-8 shadow-xl text-center mb-6">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/10">
            <MessageCircle className="h-8 w-8 text-[#25D366]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Invoice via WhatsApp</h2>
          <p className="mt-2 text-sm text-slate-500">
            Just text our bot what you sold — we&apos;ll create and send the invoice automatically.
          </p>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-left">
            <p className="text-xs font-semibold text-slate-400 mb-1">Example message:</p>
            <p className="text-sm text-slate-700 italic">
              &quot;Invoice Joy 08012345678, 5000 hair, 3000 nails&quot;
            </p>
          </div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3.5 text-base font-bold text-white transition hover:bg-[#20bd5a]"
          >
            <MessageCircle className="h-5 w-5" />
            Open WhatsApp Bot
          </a>
        </div>

        {/* Dashboard CTA — secondary */}
        <div className="text-center">
          <p className="text-sm text-white/70 mb-3">Or create from the dashboard</p>
          <Link
            href="/dashboard"
            onClick={() => {
              // Set localStorage flag so WelcomeGuide doesn't show
              localStorage.setItem("onboarding-complete", "true");
              // Force reload to show full dashboard
              window.location.href = "/dashboard";
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Use Dashboard Instead
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
