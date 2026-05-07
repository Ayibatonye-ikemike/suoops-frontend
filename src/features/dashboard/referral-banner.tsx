"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Copy, Gift, X, MessageCircle } from "lucide-react";

import { apiClient } from "@/api/client";

interface ReferralStats {
  referral_code: string;
  referral_link: string;
  total_referrals: number;
  paid_signups: number;
}

const DISMISS_KEY = "referral-banner-dismissed";

/**
 * Compact referral banner shown on the dashboard so the user's code and
 * share link are one tap away. Auto-hides once they've landed at least one
 * paid (Pro) referral, and is dismissible (persisted in localStorage).
 */
export function ReferralBanner() {
  const [dismissed, setDismissed] = useState<boolean>(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  const { data: stats, isLoading } = useQuery<ReferralStats>({
    queryKey: ["referralStats"],
    queryFn: async () => {
      const response = await apiClient.get<ReferralStats>("/referrals/stats");
      return response.data;
    },
    staleTime: 60_000,
  });

  if (isLoading || dismissed || !stats) return null;
  // Once they've earned at least one paid referral, the banner has done its
  // job — hide it so the dashboard doesn't feel cluttered.
  if (stats.paid_signups > 0) return null;

  const code = stats.referral_code;
  const inviteText =
    `Hey! I use SuoOps to send invoices and get paid faster. ` +
    `You get 2 free invoices to try it — no card needed. ` +
    `Sign up with my link and we both win:\n${stats.referral_link}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Referral code copied!");
    } catch {
      toast.error("Couldn't copy — long-press to copy manually.");
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="relative mb-4 overflow-hidden rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 shadow-sm sm:mb-6 sm:p-5">
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss referral banner"
        className="absolute right-2 top-2 rounded p-1 text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-900"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Gift className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900 sm:text-base">
              Earn ₦488 per friend who upgrades to Pro
            </p>
            <p className="mt-0.5 text-xs text-emerald-800/80 sm:text-sm">
              Your code:{" "}
              <code className="rounded border border-emerald-200 bg-white px-1.5 py-0.5 font-mono text-xs tracking-wider text-emerald-900">
                {code}
              </code>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-50 sm:text-sm"
          >
            <Copy className="h-3.5 w-3.5" /> Copy code
          </button>
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1ebe5d] sm:text-sm"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Share on WhatsApp
          </a>
          <Link
            href="/dashboard/referrals"
            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 sm:text-sm"
          >
            Track earnings →
          </Link>
        </div>
      </div>
    </div>
  );
}
