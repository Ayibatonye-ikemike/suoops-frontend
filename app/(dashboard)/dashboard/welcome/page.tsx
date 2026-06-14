"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ArrowRight, Crown, ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";
import { PLANS } from "@/constants/pricing";

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
 * Mark onboarding + plan-selection as complete so the user is not bounced
 * back to this screen after they click through pricing.
 */
function markOnboardingComplete() {
  try {
    localStorage.setItem("onboarding-complete", "true");
    localStorage.setItem("plan-chosen", "true");
  } catch {
    // localStorage may be unavailable (private mode, etc.) — non-fatal.
  }
}

/**
 * Standalone onboarding / pricing screen at `/dashboard/welcome`.
 *
 * Shown to brand-new users right after signup so they can pick how to
 * start: stay free, upgrade to Pro, buy a pack, or use WhatsApp. Every
 * card here is a real link — clicking always navigates AWAY from this
 * page, so users can never get stuck in a loop.
 */
export default function WelcomeOnboardingPage() {
  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => (await apiClient.get<UserData>("/users/me")).data,
    staleTime: 60_000,
  });

  const { data: quota } = useQuery<InvoiceQuota>({
    queryKey: ["invoice-quota"],
    queryFn: async () => (await apiClient.get<InvoiceQuota>("/invoices/quota")).data,
    staleTime: 60_000,
  });

  const firstName = user?.name?.split(" ")[0] || "there";
  const bizName = user?.business_name || "your business";

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

        {/* Plans — clickable cards */}
        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          {/* Free / Starter */}
          <Link
            href="/dashboard"
            onClick={() => markOnboardingComplete()}
            className="group block rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
          >
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
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-jade group-hover:gap-2 transition-all">
              Continue Free <ArrowRight className="h-4 w-4" />
            </div>
          </Link>

          {/* Pro — direct upgrade page */}
          <Link
            href="/dashboard/upgrade/pro"
            onClick={() => markOnboardingComplete()}
            className="group block rounded-2xl bg-white p-6 shadow-lg border-2 border-brand-jade transition hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-jade"
          >
            <div className="mb-3 inline-block rounded-full bg-brand-jade/10 px-3 py-1 text-xs font-semibold text-brand-jade">
              RECOMMENDED
            </div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              {PLANS.PRO.displayName}
            </h3>
            <p className="mt-2">
              <span className="text-3xl font-bold text-slate-900">{PLANS.PRO.priceDisplay}</span>
              <span className="text-slate-500"> one-time</span>
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
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-jade group-hover:gap-2 transition-all">
              Upgrade to Pro <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        {/* Invoice Packs — clickable */}
        <div className="rounded-2xl bg-white/10 backdrop-blur p-6 text-white mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="text-lg font-bold">Need more invoices? Buy packs anytime</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link
              href="/dashboard/billing/purchase?pack=small"
              onClick={() => markOnboardingComplete()}
              className="rounded-xl bg-white/10 p-4 text-center transition hover:bg-white/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            >
              <p className="text-2xl font-bold text-brand-chartreuse">25</p>
              <p className="text-sm text-white/80">invoices</p>
              <p className="mt-2 text-lg font-bold">₦625</p>
              <p className="text-xs text-white/60">₦25/invoice</p>
              <p className="mt-2 text-xs font-semibold text-brand-chartreuse">Buy now →</p>
            </Link>
            <Link
              href="/dashboard/billing/purchase?pack=standard"
              onClick={() => markOnboardingComplete()}
              className="rounded-xl bg-white/10 p-4 text-center border border-brand-chartreuse/50 transition hover:bg-white/20 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-chartreuse"
            >
              <div className="text-xs font-bold text-brand-chartreuse mb-1">BEST VALUE</div>
              <p className="text-2xl font-bold text-brand-chartreuse">50</p>
              <p className="text-sm text-white/80">invoices</p>
              <p className="mt-2 text-lg font-bold">₦1,250</p>
              <p className="text-xs text-white/60">₦25/invoice</p>
              <p className="mt-2 text-xs font-semibold text-brand-chartreuse">Buy now →</p>
            </Link>
          </div>
          <p className="text-center text-xs text-white/60 mt-3">No subscription needed — buy as you grow. A small processing fee is added at checkout.</p>
        </div>

        {/* Quick-start CTAs */}
        <div className="rounded-2xl bg-white/10 backdrop-blur p-6 text-white text-center">
          <p className="text-sm text-white/80 mb-4">
            You have {quota?.invoice_balance ?? 2} free invoices to start. Pick how you want to send your first one:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => markOnboardingComplete()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-bold text-white shadow-lg transition hover:bg-[#20bd5a]"
            >
              <MessageCircle className="h-5 w-5" />
              Invoice via WhatsApp
            </a>
            <Link
              href="/dashboard"
              onClick={() => markOnboardingComplete()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-chartreuse px-6 py-3 text-base font-bold text-brand-evergreen shadow-lg transition hover:bg-white"
            >
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
