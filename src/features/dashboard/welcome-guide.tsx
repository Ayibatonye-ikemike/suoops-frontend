"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, MessageCircle, FileText, ArrowRight, Sparkles } from "lucide-react";
import { apiClient } from "@/api/client";
import type { components } from "@/api/types.generated";
import { WhatsAppVerificationModal } from "@/features/settings/whatsapp-verification-modal";

type CurrentUser = components["schemas"]["UserOut"];

const DISMISSED_KEY = "welcome-guide-dismissed";
const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

/**
 * Welcome guide for brand-new users who have 0 invoices.
 * Clearly explains the two ways to create invoices and guides to action.
 * Disappears after user creates their first invoice or dismisses it.
 */
export function WelcomeGuide() {
  const [dismissed, setDismissed] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "true");
  }, []);

  const { data: user, isLoading } = useQuery<CurrentUser>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<CurrentUser>("/users/me");
      return response.data;
    },
    staleTime: 60000,
  });

  const hasVerifiedPhone = Boolean(user?.phone_verified && user?.phone);
  const invoiceBalance = user?.invoice_balance ?? 5;
  const hasInvoices = (user?.invoices_this_month ?? 0) > 0 || invoiceBalance < 5;

  // Don't show if loading, dismissed, or user already has invoices
  if (isLoading || dismissed || hasInvoices) return null;

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <>
      <WhatsAppVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <div className="mb-6 rounded-2xl border-2 border-brand-jade/30 bg-gradient-to-br from-white via-emerald-50/50 to-green-50/50 p-5 sm:p-6 shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-jade/5" />
        <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-emerald-500/5" />

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-brand-textMuted hover:bg-brand-border/30 hover:text-brand-text transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="relative mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-brand-jade" />
            <h2 className="text-lg sm:text-xl font-bold text-brand-text">
              Welcome, {firstName}!
            </h2>
          </div>
          <p className="text-sm text-brand-textMuted">
            Create your first invoice in under 60 seconds — pick your preferred method:
          </p>
        </div>

        {/* Two methods side by side */}
        <div className="relative grid gap-4 sm:grid-cols-2">
          {/* Method 1: WhatsApp */}
          <div className="rounded-xl border border-emerald-200 bg-white p-4 transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-text text-sm">
                  Via WhatsApp
                </h3>
                <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
                  Fastest
                </span>
              </div>
            </div>
            <p className="text-xs text-brand-textMuted mb-3">
              Just text our bot — done in seconds. No forms needed.
            </p>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 mb-3">
              <p className="text-xs text-emerald-800 font-mono">
                &quot;Invoice John 50k for logo design&quot;
              </p>
            </div>
            {hasVerifiedPhone ? (
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
              >
                Open WhatsApp Bot
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1fb855]"
              >
                Connect WhatsApp
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Method 2: Dashboard Form */}
          <div className="rounded-xl border border-blue-200 bg-white p-4 transition hover:shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-text text-sm">
                  Via Dashboard
                </h3>
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase tracking-wide">
                  Full control
                </span>
              </div>
            </div>
            <p className="text-xs text-brand-textMuted mb-3">
              Use the form below to add line items, set due dates, and customize.
            </p>
            <ol className="text-xs text-brand-textMuted space-y-1.5 mb-3 list-decimal list-inside">
              <li>Enter customer name &amp; phone</li>
              <li>Add items with prices</li>
              <li>Hit <strong>&quot;Create Invoice&quot;</strong></li>
            </ol>
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">
              <ArrowRight className="h-3 w-3 shrink-0" />
              Scroll down to the invoice form
            </div>
          </div>
        </div>

        {/* Footer hint */}
        <p className="mt-4 text-center text-xs text-brand-textMuted">
          You have <strong>{invoiceBalance} invoice{invoiceBalance === 1 ? '' : 's'}</strong> ready to use
        </p>
      </div>
    </>
  );
}
