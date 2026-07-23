"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Crown, X, ArrowRight, CheckCircle2 } from "lucide-react";

import { apiClient } from "@/api/client";

const PRO_WELCOME_SEEN_KEY = "pro-welcome-seen";

interface UserData {
  plan?: string;
}

const HIGHLIGHTS = [
  "Tax reports (PIT + CIT)",
  "Custom logo branding",
  "Inventory & margin analysis",
  "Team management (5 members)",
  "Cash insights & dormancy alerts",
  "Daily WhatsApp business summary",
];

/**
 * One-time welcome shown right after a user becomes Pro (via Pro Pack or the
 * Pro Features subscription). Points them to the full guide so they actually
 * use what they paid for. Dismissed permanently via localStorage.
 */
export function ProWelcomeModal() {
  const [open, setOpen] = useState(false);

  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isPro = (user?.plan || "free").toLowerCase() === "pro";

  useEffect(() => {
    if (!isPro) return;
    if (localStorage.getItem(PRO_WELCOME_SEEN_KEY) === "true") return;
    setOpen(true);
  }, [isPro]);

  const dismiss = () => {
    localStorage.setItem(PRO_WELCOME_SEEN_KEY, "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-welcome-title"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 px-6 py-6 text-white">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Crown className="h-7 w-7" />
          </span>
          <h2 id="pro-welcome-title" className="mt-3 text-xl font-bold">
            Welcome to Pro! 🎉
          </h2>
          <p className="mt-1 text-sm text-amber-50">
            You&apos;ve unlocked every premium feature. Here&apos;s what you can now do:
          </p>
        </div>

        <div className="px-6 py-5">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-jade" />
                {h}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard/pro"
            onClick={dismiss}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-500"
          >
            Show me how to use Pro
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={dismiss}
            className="mt-2 w-full rounded-lg px-4 py-2 text-sm font-medium text-brand-textMuted transition hover:text-brand-text"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
