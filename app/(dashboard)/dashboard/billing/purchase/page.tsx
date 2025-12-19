"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { initializeInvoicePackPurchase } from "@/api/subscription";
import { apiClient } from "@/api/client";
import { INVOICE_PACK_PRICE, INVOICE_PACK_SIZE } from "@/constants/pricing";

export default function PurchaseInvoicePackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user to show invoice balance
  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/me");
      return response.data;
    },
  });

  const invoiceBalance = user?.invoice_balance ?? 0;
  const totalPrice = INVOICE_PACK_PRICE * quantity;
  const totalInvoices = INVOICE_PACK_SIZE * quantity;

  const handlePurchase = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await initializeInvoicePackPurchase(quantity);
      
      // Redirect to Paystack checkout
      window.location.href = response.authorization_url;
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        "Failed to initialize payment. Please try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background px-4 py-10">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-text">
            Buy Invoice Pack
          </h1>
          <p className="mt-2 text-brand-textMuted">
            Purchase additional invoices for your account
          </p>
        </div>

        {/* Current Balance Card */}
        <div className="mb-6 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-brand-textMuted">
                Current Invoice Balance
              </p>
              <p className="text-2xl font-bold text-brand-primary">
                {invoiceBalance} invoices
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        {/* Pack Selection Card */}
        <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-brand-text">
            Select Pack Quantity
          </h2>

          {/* Pack Info */}
          <div className="mb-6 rounded-xl bg-brand-background p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-textMuted">Pack size</span>
              <span className="font-medium text-brand-text">
                {INVOICE_PACK_SIZE} invoices
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-brand-textMuted">Price per pack</span>
              <span className="font-medium text-brand-text">
                ₦{INVOICE_PACK_PRICE.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-brand-text">
              Number of packs
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-white text-lg font-medium text-brand-text transition-colors hover:bg-brand-background disabled:opacity-50"
              >
                −
              </button>
              <span className="w-16 text-center text-xl font-bold text-brand-text">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                disabled={quantity >= 10}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-white text-lg font-medium text-brand-text transition-colors hover:bg-brand-background disabled:opacity-50"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-brand-textMuted">
              Maximum 10 packs per purchase
            </p>
          </div>

          {/* Order Summary */}
          <div className="mb-6 rounded-xl border border-brand-border bg-brand-background p-4">
            <h3 className="mb-3 text-sm font-semibold text-brand-text">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-textMuted">
                  {quantity} pack{quantity > 1 ? "s" : ""} × ₦{INVOICE_PACK_PRICE.toLocaleString()}
                </span>
                <span className="font-medium text-brand-text">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-brand-border pt-2">
                <span className="font-medium text-brand-text">
                  Total invoices to add
                </span>
                <span className="font-bold text-brand-primary">
                  +{totalInvoices}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-textMuted">
                  New balance after purchase
                </span>
                <span className="font-medium text-brand-jade">
                  {invoiceBalance + totalInvoices} invoices
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Purchase Button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full bg-brand-primary py-3 text-white hover:bg-brand-primary/90"
            size="lg"
          >
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Processing...
              </>
            ) : (
              `Pay ₦${totalPrice.toLocaleString()}`
            )}
          </Button>

          {/* Security Note */}
          <p className="mt-4 text-center text-xs text-brand-textMuted">
            🔒 Secure payment powered by Paystack
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-brand-textMuted hover:text-brand-text"
          >
            ← Back to Settings
          </button>
        </div>
      </div>
    </div>
  );
}
