"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { components } from "@/api/types";
import { formatPaidAt } from "../../../src/utils/formatDate";

type InvoicePublic = components["schemas"]["InvoicePublicOut"] & {
  pdf_url?: string | null;
  receipt_pdf_url?: string | null;
};

type Props = {
  initialInvoice: InvoicePublic;
  invoiceId: string;
  apiBaseUrl: string;
};

const formatCurrency = (value: string | null | undefined) => {
  if (!value) return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

export function InvoiceClient({ initialInvoice, invoiceId, apiBaseUrl }: Props) {
  const [invoice, setInvoice] = useState<InvoicePublic>(initialInvoice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const isPaid = invoice.status === "paid";
  const isAwaiting = invoice.status === "awaiting_confirmation";
  const isClosed = invoice.status === "cancelled";

  const handleConfirmTransfer = useCallback(async () => {
    if (isSubmitting || isPaid || isAwaiting || isClosed) return;

    setIsSubmitting(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch(`${apiBaseUrl}/public/invoices/${invoiceId}/confirm-transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to update invoice. Please try again.");
      }

      const data = (await response.json()) as InvoicePublic;
      setInvoice(data);
      setFeedback("Business notified! You'll receive your receipt once they confirm.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }, [apiBaseUrl, invoiceId, isAwaiting, isClosed, isPaid, isSubmitting]);

  // Poll for status updates
  useEffect(() => {
    if (isPaid || isClosed) return;
    setIsPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/public/invoices/${invoiceId}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as InvoicePublic;
        setInvoice(data);
        if (data.status === "paid" || data.status === "cancelled") {
          clearInterval(interval);
          setIsPolling(false);
        }
      } catch {}
    }, 8000);
    return () => clearInterval(interval);
  }, [apiBaseUrl, invoiceId, isPaid, isClosed]);

  const copyAllDetails = useCallback(async () => {
    const details = `${invoice.bank_name}\n${invoice.account_number}\n${invoice.account_name}`;
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [invoice]);

  // Status indicator
  const statusConfig = useMemo(() => {
    if (isPaid) return { bg: "bg-brand-jade", text: "Payment Confirmed" };
    if (isAwaiting) return { bg: "bg-amber-500", text: "Awaiting Confirmation" };
    if (isClosed) return { bg: "bg-slate-400", text: "Cancelled" };
    return { bg: "bg-brand-primary", text: "Pending Payment" };
  }, [isPaid, isAwaiting, isClosed]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-evergreen to-brand-evergreen/95">
      {/* Header */}
      <header className="px-4 py-6">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">suoops</span>
            <span className="text-xs text-white/60">{invoice.invoice_id}</span>
          </div>
        </div>
      </header>

      {/* Main Card */}
      <main className="px-4 pb-10">
        <div className="mx-auto max-w-lg">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Amount Header */}
            <div className="bg-gradient-to-r from-brand-evergreen to-brand-evergreen/90 px-6 py-8 text-center text-white">
              <p className="text-sm font-medium text-white/70">Amount Due</p>
              <p className="mt-2 text-4xl font-bold">{formatCurrency(invoice.amount)}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1">
                <span className={`h-2 w-2 rounded-full ${statusConfig.bg}`} />
                <span className="text-xs font-medium">{statusConfig.text}</span>
              </div>
              {invoice.due_date && !isPaid && (
                <p className="mt-3 text-xs text-white/60">
                  Due {new Date(invoice.due_date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
              )}
              {isPaid && invoice.paid_at && (
                <p className="mt-3 text-xs text-brand-citrus">
                  Paid {formatPaidAt(invoice.paid_at)}
                </p>
              )}
            </div>

            {/* Bank Details */}
            {!isPaid && !isClosed && (
              <div className="border-b border-slate-100 px-6 py-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Bank Transfer Details</h2>
                  <button
                    onClick={copyAllDetails}
                    className="text-xs font-medium text-brand-primary hover:text-brand-primary/80"
                  >
                    {copied ? "Copied!" : "Copy all"}
                  </button>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Bank</p>
                    <p className="font-semibold text-slate-900">{invoice.bank_name || "—"}</p>
                  </div>
                  
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Account Number</p>
                    <p className="font-mono text-lg font-bold tracking-wider text-slate-900">
                      {invoice.account_number || "—"}
                    </p>
                  </div>
                  
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Account Name</p>
                    <p className="font-semibold text-slate-900">{invoice.account_name || "—"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Messages */}
            {error && (
              <div className="mx-6 mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}
            {feedback && (
              <div className="mx-6 mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedback}
              </div>
            )}

            {/* Action Button */}
            <div className="px-6 py-6">
              {!isPaid && !isClosed && (
                <>
                  <button
                    onClick={handleConfirmTransfer}
                    disabled={isSubmitting || isAwaiting}
                    className="w-full rounded-xl bg-brand-primary py-4 text-base font-semibold text-white shadow-lg transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAwaiting ? "✓ Business Notified" : isSubmitting ? "Notifying..." : "I've sent the transfer"}
                  </button>
                  {isPolling && (
                    <p className="mt-2 text-center text-xs text-slate-400">Auto-checking status...</p>
                  )}
                </>
              )}

              {isPaid && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 px-4 py-4 text-center">
                    <span className="text-2xl">✓</span>
                    <p className="mt-1 font-semibold text-emerald-700">Payment Confirmed</p>
                    <p className="text-sm text-emerald-600">Your receipt has been sent.</p>
                  </div>
                  
                  {(invoice.receipt_pdf_url || invoice.pdf_url) && (
                    <div className="flex gap-2">
                      {invoice.receipt_pdf_url && (
                        <a
                          href={invoice.receipt_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg border border-emerald-200 bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          📄 Receipt
                        </a>
                      )}
                      {invoice.pdf_url && (
                        <a
                          href={invoice.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          🧾 Invoice
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {isClosed && (
                <div className="rounded-xl bg-slate-100 px-4 py-4 text-center">
                  <p className="font-semibold text-slate-700">Invoice Cancelled</p>
                  <p className="text-sm text-slate-500">Contact the business for a new invoice.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/50">
            Having trouble? Contact the business directly.
          </p>
        </div>
      </main>
    </div>
  );
}
