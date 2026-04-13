"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  Building2,
  Landmark,
  Image,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";

const ONBOARDING_COMPLETE_KEY = "onboarding-complete";
const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

interface UserData {
  name?: string;
  phone?: string;
  phone_verified?: boolean;
  business_name?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  logo_url?: string | null;
  invoice_balance?: number;
  invoices_this_month?: number;
}

interface SetupStep {
  id: string;
  label: string;
  description: string;
  done: boolean;
  href: string;
  icon: React.ReactNode;
}

/**
 * Onboarding journey and WhatsApp-first experience.
 *
 * Shows for ALL users on every login:
 * - WhatsApp CTA to create invoices via bot (always visible)
 * - Setup checklist for users with incomplete profile
 * - Progress bar for onboarding
 *
 * Hidden only when user clicks "I want to create an invoice from the dashboard instead."
 * That preference persists via localStorage.
 */
export function WelcomeGuide() {
  const [showDashboardForm, setShowDashboardForm] = useState(false);

  useEffect(() => {
    setShowDashboardForm(localStorage.getItem("show-dashboard-form") === "true");
  }, []);

  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const invoiceBalance = user?.invoice_balance ?? 5;
  const hasInvoices = (user?.invoices_this_month ?? 0) > 0 || invoiceBalance < 5;

  // Build setup steps
  const hasPhone = Boolean(user?.phone_verified && user?.phone);
  const hasBusinessName = Boolean(user?.business_name?.trim());
  const hasBankDetails = Boolean(user?.bank_name?.trim() && user?.account_number?.trim());
  const hasLogo = Boolean(user?.logo_url);

  const steps: SetupStep[] = [
    {
      id: "whatsapp",
      label: "Connect WhatsApp",
      description: "Create invoices by texting our bot",
      done: hasPhone,
      href: WHATSAPP_LINK,
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      id: "business_name",
      label: "Set business name",
      description: "Appears on your invoices",
      done: hasBusinessName,
      href: "/dashboard/settings#profile",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: "bank_details",
      label: "Add bank details",
      description: "So customers know where to pay",
      done: hasBankDetails,
      href: "/dashboard/settings#bank-details",
      icon: <Landmark className="h-4 w-4" />,
    },
    {
      id: "logo",
      label: "Upload business logo",
      description: "Look professional on invoices",
      done: hasLogo,
      href: "/dashboard/settings#logo",
      icon: <Image className="h-4 w-4" />,
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;
  const setupReady = hasPhone && hasBusinessName && hasBankDetails;

  // Auto-complete: mark onboarding done if all steps finished
  useEffect(() => {
    if (!isLoading && allDone) {
      localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    }
  }, [allDone, isLoading]);

  // Don't show if loading or user chose dashboard form
  if (isLoading) return null;
  if (showDashboardForm) return null;

  const firstName = user?.name?.split(" ")[0] || "there";
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const firstIncomplete = steps.find((s) => !s.done);

  return (
    <div className="mb-6 rounded-2xl border-2 border-brand-jade/30 bg-gradient-to-br from-white via-emerald-50/50 to-green-50/50 p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-jade/5" />
      <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-emerald-500/5" />

      {/* Header */}
      <div className="relative mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-brand-jade" />
          <h2 className="text-lg sm:text-xl font-bold text-brand-text">
            {allDone ? `Welcome back, ${firstName}!` : `Welcome, ${firstName}! Let\u0027s get you set up`}
          </h2>
        </div>
        <p className="text-sm text-brand-textMuted">
          {allDone
            ? "Create invoices instantly via WhatsApp — just text our bot."
            : "Complete these steps to start sending invoices and collecting payments."}
        </p>
      </div>

      {/* Progress bar — only show if setup incomplete */}
      {!allDone && (
        <div className="relative mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-brand-text">
              {completedCount}/{steps.length} completed
            </span>
            <span className="text-xs text-brand-textMuted">{progressPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-jade transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Setup checklist — only show if incomplete steps remain */}
      {!allDone && (
        <div className="relative space-y-2 mb-5">
        {steps.map((step) => {
          const isNext = firstIncomplete?.id === step.id;
          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                step.done
                  ? "border-emerald-200 bg-emerald-50/50"
                  : isNext
                    ? "border-brand-jade/40 bg-white shadow-sm"
                    : "border-slate-200 bg-white/50"
              }`}
            >
              {step.done ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className={`h-5 w-5 shrink-0 ${isNext ? "text-brand-jade" : "text-slate-300"}`} />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${step.done ? "text-emerald-700 line-through" : "text-brand-text"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-brand-textMuted">{step.description}</p>
              </div>
              {!step.done && (
                step.id === "whatsapp" ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1fb855] shrink-0"
                  >
                    Connect
                    <ArrowRight className="h-3 w-3" />
                  </a>
                ) : (
                  <Link
                    href={step.href}
                    className="flex items-center gap-1 rounded-lg bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jade/90 shrink-0"
                  >
                    Set up
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* WhatsApp CTA — always show for all users */}
      {hasPhone && (
        <div className="relative rounded-xl border-2 border-[#25D366]/30 bg-[#25D366]/5 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-brand-text text-sm mb-1">
                Create invoices via WhatsApp
              </h3>
              <p className="text-xs text-brand-textMuted mb-2">
                Just text: &quot;Invoice Joy 5000 wig&quot; and your invoice goes out instantly.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
              >
                Open WhatsApp Bot
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp connect CTA — show when phone not connected */}
      {!hasPhone && (
        <div className="relative rounded-xl border-2 border-[#25D366]/30 bg-[#25D366]/5 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-brand-text text-sm mb-1">
                Start with WhatsApp — it&apos;s the fastest way
              </h3>
              <p className="text-xs text-brand-textMuted mb-2">
                Just text: &quot;Invoice Joy 5000 wig&quot; and your invoice goes out instantly.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
              >
                Open WhatsApp Bot
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Setup-ready message */}
      {setupReady && !allDone && (
        <div className="relative rounded-xl border border-emerald-200 bg-emerald-50 p-3 mb-4">
          <p className="text-xs text-emerald-700">
            <strong>You&apos;re ready to create invoices!</strong> Complete the remaining
            optional step{steps.filter((s) => !s.done).length > 1 ? "s" : ""} to look even more professional.
          </p>
        </div>
      )}

      {/* Toggle for dashboard form (hidden by default for new users) */}
      {!showDashboardForm ? (
        <button
          onClick={() => {
            setShowDashboardForm(true);
            localStorage.setItem("show-dashboard-form", "true");
          }}
          className="relative flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-brand-textMuted transition hover:bg-slate-50 hover:text-brand-text"
        >
          <ChevronDown className="h-3 w-3" />
          I want to create an invoice from the dashboard instead
        </button>
      ) : (
        <button
          onClick={() => {
            setShowDashboardForm(false);
            localStorage.removeItem("show-dashboard-form");
          }}
          className="relative flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-brand-textMuted transition hover:bg-slate-50 hover:text-brand-text"
        >
          <ChevronUp className="h-3 w-3" />
          Hide dashboard invoice form
        </button>
      )}

      {/* Footer */}
      <p className="mt-3 text-center text-xs text-brand-textMuted">
        You have <strong>{invoiceBalance} invoice{invoiceBalance === 1 ? "" : "s"}</strong> ready to use
      </p>
    </div>
  );
}

/**
 * Hook to check if the dashboard invoice form should be shown.
 * Hidden by default — shown only when user explicitly clicks
 * "I want to create an invoice from the dashboard instead."
 */
export function useShowDashboardForm() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem("show-dashboard-form") === "true");
  }, []);

  return show;
}
