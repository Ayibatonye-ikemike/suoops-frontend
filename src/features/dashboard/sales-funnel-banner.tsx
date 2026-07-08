"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wallet, FileText, ShoppingCart, X, MessageCircle } from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/api/client";
import { walletNaira } from "@/constants/pricing";

const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

interface UserData {
  name?: string;
  phone_verified?: boolean;
  plan?: string;
  invoice_balance?: number;
  wallet_balance_kobo?: number;
  invoices_this_month?: number;
  subscription_expires_at?: string | null;
  has_invoiced?: boolean;
}

/**
 * Dashboard prompts under the commission model:
 * 1. Users who haven't invoiced yet → "create your first invoice"
 * 2. Users with an empty/low wallet → "top up your wallet"
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

  const wallet = walletNaira(user?.wallet_balance_kobo);
  const hasInvoiced = Boolean(user?.has_invoiced);
  const hasPhone = Boolean(user?.phone_verified);
  const firstName = user?.name?.split(" ")[0] || "there";

  const handleDismiss = () => {
    sessionStorage.setItem("sales-funnel-dismissed", "true");
    setDismissed(true);
  };

  // ── Scenario 1: hasn't created an invoice yet — prompt to create ──
  if (!hasInvoiced) {
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
              Send a professional invoice in seconds — via WhatsApp or right here.
              You only pay a flat 3% when you invoice.
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

  // ── Scenario 2: wallet empty/low — prompt to top up ──
  if (wallet < 500) {
    const isEmpty = wallet <= 0;
    return (
      <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-5 relative overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shrink-0">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {isEmpty ? "Your invoice wallet is empty" : `Wallet low: ₦${wallet.toLocaleString()} left`}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Top up to keep creating manual invoices (3%, min ₦20, ₦2,000 cap up to ₦500k) — or share
              your storefront so customers order and pay online, no wallet needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/billing/purchase"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-jade px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-jade/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Top up wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
