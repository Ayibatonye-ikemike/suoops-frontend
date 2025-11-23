"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import type { components } from "@/api/types";

import { invoiceStatusHelpText, invoiceStatusLabels } from "./status-map";
import { formatPaidAt } from "../../utils/formatDate";
import { useInvoiceDetail, InvoiceDetail } from "./use-invoice-detail";
import { buildInvoiceShareLink } from "@/lib/share-link";
import { useUpdateInvoiceStatus } from "./use-update-invoice-status";

const STATUS_ORDER = ["pending", "awaiting_confirmation", "paid", "failed"] as const;

const statusOptions = STATUS_ORDER.filter((key) => key in invoiceStatusLabels).map((key) => ({
  value: key,
  label: invoiceStatusLabels[key].label,
}));

type InvoiceStatus = components["schemas"]["InvoiceStatusUpdate"]["status"];

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

function formatCurrency(amount: string | null | undefined) {
  if (!amount) {
    return "—";
  }
  const value = Number(amount);
  if (Number.isNaN(value)) {
    return amount;
  }
  return currencyFormatter.format(value);
}

function formatIsoDate(value: string | null | undefined) {
  if (!value) {
    return "—";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleString();
}

function statusToneClass(tone: string | undefined) {
  switch (tone) {
    case "success":
      return "border border-brand-statusPaidText/20 bg-brand-statusPaidBg text-brand-statusPaidText";
    case "warning":
      return "border border-brand-statusPendingText/20 bg-brand-statusPendingBg text-brand-statusPendingText";
    case "danger":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "border border-brand-border bg-brand-background text-brand-textMuted";
  }
}

export function InvoiceDetailPanel({ invoiceId }: { invoiceId: string | null }) {
  const detailQuery = useInvoiceDetail(invoiceId);
  const mutation = useUpdateInvoiceStatus(invoiceId);
  const [linkCopied, setLinkCopied] = useState(false);
  const invoice = detailQuery.data as InvoiceDetail | undefined;

  // Compute status metadata - must be called before any conditional returns
  const statusMeta = useMemo(() => {
    if (!invoice) {
      return { label: "Unknown", tone: "neutral" as const };
    }
    return (
      invoiceStatusLabels[invoice.status] || {
        label: invoice.status,
        tone: "neutral" as const,
      }
    );
  }, [invoice]);

  const shareLink = invoice?.invoice_id ? buildInvoiceShareLink(invoice.invoice_id) : "";
  const handlePrint = useCallback(() => {
    if (!invoice) return;
    try {
      // Prefer opening the invoice PDF if available for cleaner print formatting
      if (invoice.pdf_url) {
        window.open(invoice.pdf_url, "_blank", "noopener,noreferrer");
        return;
      }
      window.print();
    } catch (err) {
      console.error("Print failed", err);
      toast.error("Unable to initiate print");
    }
  }, [invoice]);

  const handleCopyLink = useCallback(async () => {
    if (!shareLink || typeof navigator === "undefined" || !navigator.clipboard) {
      toast.error("Copy not supported in this environment");
      return;
    }
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      toast.success("Payment link copied");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (copyError) {
      console.error("Failed to copy invoice link", copyError);
      toast.error("Failed to copy link");
    }
  }, [shareLink]);

  if (!invoiceId) {
    return null;
  }

  if (detailQuery.isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 rounded bg-brand-background" />
          <div className="h-20 w-full rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 shadow-card">
        <p className="text-sm text-rose-800">Failed to load invoice details. Please refresh.</p>
      </div>
    );
  }

  // Type guard: after this point, invoice is defined
  if (!invoice) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <p className="text-sm text-brand-textMuted">No invoice data available.</p>
      </div>
    );
  }

  const helpText = invoiceStatusHelpText[invoice.status];
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as InvoiceStatus;
    if (next === invoice.status) {
      return;
    }
    mutation.mutate(next);
  };

  return (
    <div className="space-y-4 sm:space-y-6 rounded-lg border border-brand-border bg-white p-4 sm:p-6 shadow-card">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 border-b border-brand-border pb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-brand-text truncate">
            {invoice.invoice_type === "expense" ? "Expense" : "Invoice"} {invoice.invoice_id}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-brand-textMuted">Created {formatIsoDate(invoice.created_at ?? null)}</p>
          {invoice.paid_at && (
            <p className="mt-1 text-xs font-medium text-emerald-700">Paid {formatPaidAt(invoice.paid_at)}</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${statusToneClass(statusMeta.tone)}`}
            aria-live="polite"
            aria-label={`Invoice status: ${statusMeta.label}`}
          >
            {statusMeta.label}
          </span>
          {invoice.pdf_url && (
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-jade bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jadeHover whitespace-nowrap"
            >
              📄 PDF
            </a>
          )}
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print invoice"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-jade bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jadeHover whitespace-nowrap"
          >
            🖨 Print
          </button>
          {invoice.receipt_pdf_url && invoice.status === "paid" && (
            <a
              href={invoice.receipt_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white whitespace-nowrap"
            >
              ✅ Receipt
            </a>
          )}
        </div>
      </header>

      {/* Body - Key Details */}
      <section className="space-y-3 sm:space-y-5">
        {/* Amount Card */}
        <div className="rounded-lg border border-brand-border bg-brand-background p-3 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Total Amount</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-brand-primary break-words">{formatCurrency(invoice.amount)}</p>
          {invoice.discount_amount && (
            <p className="mt-1 text-sm text-brand-textMuted">Discount: {formatCurrency(invoice.discount_amount)}</p>
          )}
        </div>

        {/* Expense-specific fields */}
        {invoice.invoice_type === "expense" && (
          <>
            {invoice.vendor_name && (
              <div className="rounded-lg border border-brand-border bg-brand-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Vendor</p>
                <p className="mt-2 text-base font-semibold text-brand-text">{invoice.vendor_name}</p>
              </div>
            )}
            {invoice.category && (
              <div className="rounded-lg border border-brand-border bg-brand-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Category</p>
                <p className="mt-2 text-base font-semibold text-brand-text">{invoice.category}</p>
              </div>
            )}
            {invoice.receipt_url && (
              <div className="rounded-lg border border-brand-border bg-brand-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted mb-3">Receipt / Proof of Purchase</p>
                <a
                  href={invoice.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-brand-jade bg-brand-jade px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-jadeHover"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Receipt
                </a>
              </div>
            )}
            {invoice.notes && (
              <div className="rounded-lg border border-brand-border bg-brand-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Notes</p>
                <p className="mt-2 text-sm text-brand-text">{invoice.notes}</p>
              </div>
            )}
          </>
        )}

        {/* Customer Info - Only for revenue invoices */}
        {invoice.invoice_type !== "expense" && invoice.customer && (
          <div className="rounded-lg border border-brand-border bg-brand-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Customer</p>
            <p className="mt-2 text-base font-semibold text-brand-text">{invoice.customer.name}</p>
            {invoice.customer.phone && (
              <p className="mt-1 text-sm text-brand-textMuted">{invoice.customer.phone}</p>
            )}
          </div>
        )}

        {/* Status & Due Date - Hide status selector for expenses (auto-paid) */}
        {invoice.invoice_type === "expense" ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-emerald-900">
              ✅ This expense was automatically marked as paid when recorded for tax tracking purposes.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="status-select" className="block text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
                Status
              </label>
              <select
                id="status-select"
                value={invoice.status}
                onChange={handleStatusChange}
                disabled={mutation.isPending}
                className="mt-2 w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-sm font-medium text-brand-text shadow-sm transition focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {mutation.isPending && (
                <p className="mt-1 text-xs text-brand-textMuted">Updating status…</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">Due Date</p>
              <p className="mt-2 text-sm font-medium text-brand-text break-words">{formatIsoDate(invoice.due_date ?? null)}</p>
            </div>
          </div>
        )}

        {helpText && invoice.invoice_type !== "expense" && (
          <p className="text-xs text-brand-textMuted">{helpText}</p>
        )}

        {/* Awaiting Confirmation Alert - Only for revenue invoices */}
        {invoice.invoice_type !== "expense" && invoice.status === "awaiting_confirmation" && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              ⚠️ Customer reported that they have transferred the funds. Please check your bank and move the status to &ldquo;Paid&rdquo; once cleared to automatically send their receipt.
            </p>
          </div>
        )}

        {/* Share Link - Only for revenue invoices */}
        {invoice.invoice_type !== "expense" && shareLink && (
          <div className="rounded-lg border border-brand-border bg-brand-background p-4">
            <p className="text-sm font-semibold text-brand-text">Customer Payment Link</p>
            <p className="mt-1 text-xs text-brand-textMuted">
              Share this link so your customer can view payment instructions and confirm their transfer.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 truncate rounded-lg border border-brand-border bg-white px-3 py-2 text-xs text-brand-text">
                {shareLink}
              </code>
              <button
                type="button"
                aria-label="Copy customer payment link to clipboard"
                onClick={handleCopyLink}
                className="w-full rounded-lg border border-brand-jade bg-brand-jade px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover sm:w-auto"
              >
                {linkCopied ? "Copied!" : "Copy Link"}
              </button>
              <div aria-live="polite" className="sr-only">
                {linkCopied ? "Payment link copied to clipboard" : ""}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Line Items */}
      <section className="border-t border-brand-border pt-4 sm:pt-5">
        <h3 className="mb-3 sm:mb-4 text-sm sm:text-base font-bold text-brand-text">Line Items</h3>
        {!invoice.lines || invoice.lines.length === 0 ? (
          <p className="text-xs sm:text-sm text-brand-textMuted">No line items on this invoice.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-lg border border-brand-border">
                <table className="min-w-full divide-y divide-brand-border text-xs sm:text-sm">
                  <thead className="bg-brand-background">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
                        Description
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
                        Qty
                      </th>
                      <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold uppercase tracking-wide text-brand-textMuted whitespace-nowrap">
                        Unit Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border bg-white">
                    {invoice.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 font-medium text-brand-text break-words max-w-[200px] sm:max-w-none">{line.description}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-brand-textMuted whitespace-nowrap">{line.quantity}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-brand-textMuted whitespace-nowrap">{formatCurrency(line.unit_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Footer Help Text */}
      <footer className="rounded-lg border border-dashed border-brand-border bg-brand-background p-4">
        <p className="text-xs text-brand-textMuted">
          {invoice.invoice_type === "expense" 
            ? "💡 Expenses are automatically marked as paid for tax tracking. View the QR code verification by clicking the PDF button above."
            : "💡 Keep the status in sync as you reconcile payments. Customers can flag transfers via the shared link, and marking an invoice as paid automatically triggers the WhatsApp receipt when configured."
          }
        </p>
      </footer>
    </div>
  );
}
