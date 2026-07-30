"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  ArrowRight,
  Zap,
  TrendingUp,
  Bell,
  BarChart3,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/api/client";
import { onboardingCompleteKey } from "@/features/dashboard/new-user-onboarding";

const BOT_NUMBER = "2348106865807";

interface UserData {
  id?: number;
  name?: string;
  business_name?: string | null;
  invoice_balance?: number;
  has_invoiced?: boolean;
}

/**
 * Mark onboarding as complete (per user) so the user is not bounced back here.
 */
function markOnboardingComplete(userId?: number) {
  if (!userId) return;
  try {
    localStorage.setItem(onboardingCompleteKey(userId), "true");
    localStorage.setItem("plan-chosen", "true");
  } catch {
    // non-fatal
  }
}

/**
 * Post-signup welcome screen.
 *
 * Structure (top to bottom):
 *   1. Hero + two equal CTAs above the fold (WhatsApp + Web)
 *   2. How to create an invoice (step-by-step)
 *   3. What SuoOps does for your business (benefits)
 *   4. More commands you can use
 *
 * UX principles:
 *   - NO auto-popups — user chooses when to act
 *   - Both WhatsApp and Web paths are first-class
 *   - CTAs visible without scrolling
 *   - Educational content below as reference
 */
export default function WelcomeOnboardingPage() {
  const router = useRouter();
  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => (await apiClient.get<UserData>("/users/me")).data,
    staleTime: 60_000,
  });

  // If the user has already created an invoice (e.g. via WhatsApp), they're
  // activated — mark onboarding done and send them to the real dashboard so
  // they aren't stranded on this "create your first invoice" screen.
  useEffect(() => {
    if (user?.has_invoiced) {
      markOnboardingComplete(user.id);
      router.replace("/dashboard");
    }
  }, [user, router]);

  const firstName = user?.name?.split(" ")[0] || "there";
  const bizName = user?.business_name || "your business";
  const whatsappLink = `https://wa.me/${BOT_NUMBER}?text=${encodeURIComponent(
    `Hi, I just signed up as ${firstName}. Help me create my first invoice!`
  )}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-evergreen to-brand-teal">
      <div className="mx-auto max-w-2xl w-full px-4 py-8 sm:px-6 sm:py-12">

        {/* ── Above the fold: Hero + CTAs ── */}
        <div className="text-center text-white mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome to SuoOps, {firstName}! 🎉
          </h1>
          <p className="mt-2 text-base text-white/80">
            Send professional invoices and get paid faster — let&apos;s create your first one now
          </p>
        </div>

        {/* Primary CTA — WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markOnboardingComplete(user?.id)}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-5 text-lg font-bold text-white shadow-lg transition hover:bg-[#20bd5a] hover:shadow-xl active:scale-[0.98]"
        >
          <MessageCircle className="h-7 w-7 shrink-0" />
          Create Your First Invoice
        </a>
        <p className="text-center text-xs text-white/50 mt-2">
          Opens WhatsApp — type what you sold, get a PDF
        </p>

        {/* Secondary CTA — Web dashboard */}
        <Link
          href="/dashboard"
          onClick={() => markOnboardingComplete(user?.id)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
        >
          Use the Web Dashboard instead
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-center text-xs text-white/50 mt-6">
          You have <span className="font-semibold text-brand-chartreuse">2 free invoices</span> to start — no card required
        </p>

        {/* ── Below the fold: Education ── */}

        {/* How to create an invoice */}
        <div className="mb-6 rounded-2xl bg-white/10 backdrop-blur p-5 text-white">
          <h2 className="text-base font-bold mb-4">How it works</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xs font-bold">1</div>
              <div>
                <p className="text-sm font-semibold">Type what you sold</p>
                <div className="mt-1.5 rounded-lg bg-white/10 px-3 py-2">
                  <p className="font-mono text-sm text-brand-chartreuse">Invoice Joy 08012345678 5000 for hair installation</p>
                </div>
                <p className="text-xs text-white/50 mt-1">
                  Format: <span className="text-white/70">Invoice [name] [phone] [amount] for [item]</span>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xs font-bold">2</div>
              <div>
                <p className="text-sm font-semibold">SuoOps creates a professional PDF</p>
                <p className="text-xs text-white/60">With your business name, bank details, and a unique invoice number</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-chartreuse text-brand-evergreen text-xs font-bold">3</div>
              <div>
                <p className="text-sm font-semibold">Your customer receives it instantly</p>
                <p className="text-xs text-white/60">Delivered via WhatsApp — they see your bank details and can pay right away</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-6 rounded-2xl bg-white/10 backdrop-blur p-5 text-white">
          <h2 className="text-base font-bold mb-4">What SuoOps does for {bizName}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-brand-chartreuse shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">30-second invoices</p>
                <p className="text-xs text-white/60">No templates, no forms — just type what you sold</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-brand-chartreuse shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Get paid faster</p>
                <p className="text-xs text-white/60">Customers get your bank details on a professional invoice</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-brand-chartreuse shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Auto payment reminders</p>
                <p className="text-xs text-white/60">SuoOps follows up so you don&apos;t have to</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-brand-chartreuse shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold">Track your money</p>
                <p className="text-xs text-white/60">Revenue, expenses, and who still owes you</p>
              </div>
            </div>
          </div>
        </div>

        {/* More commands */}
        <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur p-5 text-white">
          <h2 className="text-base font-bold mb-3">More things you can do</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
              <Smartphone className="h-4 w-4 text-brand-chartreuse shrink-0" />
              <p className="text-xs"><span className="font-mono text-brand-chartreuse">&quot;Mark INV-001 as paid&quot;</span> <span className="text-white/50">— record a payment</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
              <Smartphone className="h-4 w-4 text-brand-chartreuse shrink-0" />
              <p className="text-xs"><span className="font-mono text-brand-chartreuse">&quot;Show my unpaid invoices&quot;</span> <span className="text-white/50">— see who owes you</span></p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2">
              <Smartphone className="h-4 w-4 text-brand-chartreuse shrink-0" />
              <p className="text-xs"><span className="font-mono text-brand-chartreuse">&quot;How much did I make this month?&quot;</span> <span className="text-white/50">— business summary</span></p>
            </div>
          </div>
        </div>

        {/* Bottom CTA — repeat for users who scrolled */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => markOnboardingComplete()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#20bd5a] active:scale-[0.98]"
        >
          <MessageCircle className="h-5 w-5" />
          Create Your First Invoice
        </a>
      </div>
    </main>
  );
}
