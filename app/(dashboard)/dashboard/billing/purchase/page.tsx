"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { initializeInvoicePackPurchase, initializeSubscription } from "@/api/subscription";
import { apiClient } from "@/api/client";
import { PACK_OPTIONS, PRO_FEATURES_PRICE } from "@/constants/pricing";

export default function PurchaseInvoicePackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPack = searchParams?.get("pack") || "standard";
  const [selectedPack, setSelectedPack] = useState(initialPack);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });

  const invoiceBalance = user?.invoice_balance ?? 0;
  const pack = PACK_OPTIONS.find((p) => p.id === selectedPack) || PACK_OPTIONS[1];
  const totalPrice = pack.price * quantity;
  const totalInvoices = pack.size * quantity;
  const totalProDays = pack.proDays * quantity;
  const isProPack = pack.proDays > 0;

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await initializeInvoicePackPurchase(quantity, selectedPack);
      window.location.href = response.authorization_url;
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
        "Failed to initialize payment. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleSubscribeProFeatures = async () => {
    setIsSubscribing(true);
    setError(null);
    try {
      const response = await initializeSubscription("PRO_FEATURES");
      window.location.href = response.authorization_url;
    } catch (err) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(
        error.response?.data?.detail ||
        "Failed to start subscription. Please try again."
      );
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-text">Buy Invoices &amp; Pro</h1>
          <p className="mt-2 text-brand-textMuted">
            Invoices never expire. The Pro Pack adds 30 days of Pro — or subscribe to
            Pro Features for auto-renewing monthly access.
          </p>
        </div>

        {/* Current Balance */}
        <div className="mb-6 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-textMuted">Current Balance</p>
              <p className="text-2xl font-bold text-brand-primary">{invoiceBalance} invoices</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Pack Selection */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {PACK_OPTIONS.map((p) => {
            const isPro = p.proDays > 0;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPack(p.id)}
                className={`relative rounded-xl border-2 p-4 text-left transition ${
                  selectedPack === p.id
                    ? "border-brand-jade bg-emerald-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {("popular" in p && p.popular) && (
                  <span className="absolute -top-2 right-2 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                    Best value
                  </span>
                )}
                {isPro && (
                  <span className="mb-1 inline-block rounded-full bg-brand-jade/10 px-2 py-0.5 text-[9px] font-bold uppercase text-brand-jade">
                    ⭐ Pro
                  </span>
                )}
                {p.size > 0 ? (
                  <>
                    <p className="text-lg font-bold text-brand-text">{p.size}</p>
                    <p className="text-xs text-brand-textMuted">
                      invoices{isPro ? " + Pro" : ""}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-brand-text">{p.proDays}-day</p>
                    <p className="text-xs text-brand-textMuted">Pro features</p>
                  </>
                )}
                <p className="mt-2 text-base font-bold text-brand-jade">₦{p.price.toLocaleString()}</p>
                {p.size > 0 ? (
                  <p className="text-[10px] text-brand-textMuted">
                    ₦{(p.price / p.size).toFixed(0)}/invoice{isPro ? " + features" : ""}
                  </p>
                ) : (
                  <p className="text-[10px] text-brand-textMuted">features only</p>
                )}
              </button>
            );
          })}
        </div>

        {/* Quantity + Summary */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-brand-text">
            {pack.label}
            {pack.size > 0 ? ` — ${pack.size} invoices` : ""}
            {isProPack ? ` + ${pack.proDays}-day Pro` : ""}
          </h2>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-brand-text">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-white text-lg font-medium transition-colors hover:bg-brand-background disabled:opacity-50"
              >−</button>
              <span className="w-16 text-center text-xl font-bold text-brand-text">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-white text-lg font-medium transition-colors hover:bg-brand-background disabled:opacity-50"
              >+</button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 rounded-xl border border-brand-border bg-brand-background p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-textMuted">{quantity} × ₦{pack.price.toLocaleString()}</span>
                <span className="font-medium">₦{totalPrice.toLocaleString()}</span>
              </div>
              {totalInvoices > 0 && (
                <div className="flex justify-between border-t border-brand-border pt-2">
                  <span className="font-medium">Invoices to add</span>
                  <span className="font-bold text-brand-primary">+{totalInvoices}</span>
                </div>
              )}
              {totalProDays > 0 && (
                <div className="flex justify-between border-t border-brand-border pt-2">
                  <span className="font-medium">Pro features</span>
                  <span className="font-bold text-brand-jade">{totalProDays} days</span>
                </div>
              )}
              {totalInvoices > 0 && (
                <div className="flex justify-between">
                  <span className="text-brand-textMuted">New balance</span>
                  <span className="font-medium text-brand-jade">{invoiceBalance + totalInvoices}</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-brand-primary py-3 text-white hover:bg-brand-primary/90"
            size="lg"
          >
            {isLoading ? "Processing..." : `Pay ₦${totalPrice.toLocaleString()}`}
          </Button>

          <p className="mt-4 text-center text-xs text-brand-textMuted">
            🔒 Secure payment via Paystack · a small processing fee is added at checkout
          </p>
        </div>

        {/* Recurring Pro Features subscription */}
        <div className="mt-6 rounded-2xl border-2 border-brand-jade/40 bg-emerald-50/40 p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-text">Pro Features — Monthly</h2>
            <span className="rounded-full bg-brand-jade/10 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-jade">
              Auto-renew
            </span>
          </div>
          <p className="text-sm text-brand-textMuted">
            All Pro features (custom branding, tax reports, inventory, team, voice) — no
            invoices included. Renews automatically every month until you cancel.
          </p>
          <p className="mt-3 text-2xl font-bold text-brand-jade">
            ₦{PRO_FEATURES_PRICE.toLocaleString()}
            <span className="text-sm font-medium text-brand-textMuted">/month</span>
          </p>
          <p className="mt-1 text-xs text-brand-textMuted">
            + a small payment-processing fee. Cancel anytime from Settings.
          </p>
          <Button
            onClick={handleSubscribeProFeatures}
            disabled={isSubscribing}
            className="mt-4 w-full border-2 border-brand-jade bg-white py-3 text-brand-jade hover:bg-brand-jade hover:text-white"
            size="lg"
          >
            {isSubscribing ? "Processing..." : `Subscribe — ₦${PRO_FEATURES_PRICE.toLocaleString()}/mo`}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => router.back()} className="text-sm text-brand-textMuted hover:text-brand-text">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
