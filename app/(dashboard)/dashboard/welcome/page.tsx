"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, ArrowRight, FileText, Zap, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";

const BOT_NUMBER = "2348106865807";

interface UserData {
  name?: string;
  business_name?: string | null;
  invoice_balance?: number;
}

/**
 * Mark onboarding as complete so the user is not bounced back here.
 */
function markOnboardingComplete() {
  try {
    localStorage.setItem("onboarding-complete", "true");
    localStorage.setItem("plan-chosen", "true");
  } catch {
    // non-fatal
  }
}

/**
 * Post-signup welcome screen — single purpose: get the user to create
 * their first invoice NOW, primarily via WhatsApp.
 *
 * - Auto-opens WhatsApp 2 seconds after page load (mobile-friendly)
 * - One giant WhatsApp CTA dominates the screen
 * - Secondary "use the web" option for desktop users
 * - No pricing, no plans, no distractions
 */
export default function WelcomeOnboardingPage() {
  const [waOpened, setWaOpened] = useState(false);

  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => (await apiClient.get<UserData>("/users/me")).data,
    staleTime: 60_000,
  });

  const firstName = user?.name?.split(" ")[0] || "there";
  const whatsappLink = `https://wa.me/${BOT_NUMBER}?text=${encodeURIComponent(
    `Hi, I just signed up as ${firstName}. Help me create my first invoice!`
  )}`;

  // Auto-open WhatsApp after a short delay (gives page time to render)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!waOpened) {
        setWaOpened(true);
        markOnboardingComplete();
        window.open(whatsappLink, "_blank", "noopener,noreferrer");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [whatsappLink, waOpened]);

  const handleWhatsAppClick = () => {
    setWaOpened(true);
    markOnboardingComplete();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-evergreen to-brand-teal flex items-center">
      <div className="mx-auto max-w-lg w-full px-4 py-10 sm:px-6">
        {/* Hero */}
        <div className="text-center text-white mb-10">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-chartreuse/20 backdrop-blur">
            <FileText className="h-10 w-10 text-brand-chartreuse" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome, {firstName}! 🎉
          </h1>
          <p className="mt-3 text-xl text-white/90 font-medium">
            Let&apos;s create your first invoice
          </p>
          <p className="mt-2 text-sm text-white/60">
            It takes less than 30 seconds
          </p>
        </div>

        {/* How it works — compact */}
        <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur p-5 text-white">
          <p className="text-center text-sm font-semibold text-white/80 mb-4">Just type what you sold:</p>
          <div className="rounded-xl bg-white/10 p-4 text-center">
            <p className="font-mono text-lg text-brand-chartreuse">
              &quot;Invoice Joy 08012345678 5000 for hair installation&quot;
            </p>
          </div>
          <p className="text-center text-xs text-white/60 mt-3">
            We&apos;ll generate a professional PDF invoice and send it to your customer instantly
          </p>
        </div>

        {/* Primary CTA — WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-5 text-xl font-bold text-white shadow-2xl transition hover:bg-[#20bd5a] hover:scale-[1.02] active:scale-[0.98] animate-pulse hover:animate-none"
        >
          <MessageCircle className="h-7 w-7" />
          Generate Invoice on WhatsApp
        </a>
        <p className="text-center text-xs text-white/50 mt-2">
          Opens WhatsApp — your invoicing tool lives in your chat list
        </p>

        {/* Secondary CTA — Web dashboard */}
        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            onClick={() => markOnboardingComplete()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Or use the web dashboard instead
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Value props — minimal */}
        <div className="mt-10 grid grid-cols-3 gap-3 text-center text-white/70">
          <div>
            <Zap className="h-5 w-5 mx-auto mb-1 text-brand-chartreuse" />
            <p className="text-xs font-medium">30-second invoices</p>
          </div>
          <div>
            <Shield className="h-5 w-5 mx-auto mb-1 text-brand-chartreuse" />
            <p className="text-xs font-medium">Professional PDFs</p>
          </div>
          <div>
            <Clock className="h-5 w-5 mx-auto mb-1 text-brand-chartreuse" />
            <p className="text-xs font-medium">Payment tracking</p>
          </div>
        </div>
      </div>
    </main>
  );
}
