"use client";

import { ChangeEvent, useCallback, useMemo, useState } from "react";

import type { components } from "@/api/types";

import { invoiceStatusHelpText, invoiceStatusLabels } from "./status-map";
import { useInvoiceDetail } from "./use-invoice-detail";
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
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "warning":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "danger":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

export function InvoiceDetailPanel({ invoiceId }: { invoiceId: string | null }) {
  const detailQuery = useInvoiceDetail(invoiceId);
  const mutation = useUpdateInvoiceStatus(invoiceId);
  const [linkCopied, setLinkCopied] = useState(false);
  const invoice = detailQuery.data;

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

  const shareLink = useMemo(() => {
    if (!invoice?.invoice_id) {
      return "";
    }
    const envUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_FRONTEND_URL ?? "";
    const origin = envUrl || (typeof window !== "undefined" ? window.location.origin : "");
    if (!origin) {
      return "";
    }
    return `${origin.replace(/\/$/, "")}/pay/${invoice.invoice_id}`;
  }, [invoice?.invoice_id]);

  const handleCopyLink = useCallback(async () => {
    if (!shareLink || typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (copyError) {
      console.error("Failed to copy invoice link", copyError);
    }
  }, [shareLink]);

  if (!invoiceId) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-accent/30 bg-brand-accent/20 p-6 text-sm text-brand-primary/80">
        Select an invoice to see full details and update its status after confirming payment.
      </div>
    );
  }

  if (detailQuery.isLoading) {
    return <div className="rounded-2xl border border-brand-accent/15 bg-brand-surface/60 p-6 text-brand-accent">Loading invoice…</div>;
  }

  if (detailQuery.isError) {
    return (
      <div className="rounded-2xl border border-rose-300 bg-rose-100/80 p-6 text-sm text-rose-800">
        Failed to load invoice details. Please refresh.
      </div>
    );
  }

  // Type guard: after this point, invoice is defined
  if (!invoice) {
    return <div className="rounded-2xl border border-brand-accent/15 bg-brand-surface/60 p-6 text-brand-accent">No invoice data available.</div>;
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
    <div className="grid gap-6 rounded-2xl border border-brand-accent/15 bg-gradient-to-br from-brand-surface via-brand-primary/90 to-brand-surface p-6 text-brand-accent shadow-2xl shadow-brand-surface/80">
      <header className="flex flex-wrap items-start gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-brand-accent">Invoice {invoice.invoice_id}</h2>
          <p className="text-sm text-brand-accent/70">Created {formatIsoDate(invoice.created_at ?? null)}</p>
        </div>
        <span className={`ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusToneClass(statusMeta.tone)}`}>
          {statusMeta.label}
        </span>
      </header>

      <section className="grid gap-4 text-sm">
        {shareLink ? (
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface/50 p-4 shadow-inner shadow-brand-surface/40">
            <p className="text-sm font-semibold text-brand-accent">Customer link</p>
            <p className="mt-1 text-xs text-brand-accent/70">
              Share this link so your customer can view payment instructions and tap “I&apos;ve sent the transfer”.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="flex-1 truncate rounded-lg bg-brand-surface/80 px-3 py-2 text-xs text-brand-accent shadow-inner shadow-brand-surface/60">
                {shareLink}
              </code>
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full rounded-lg border border-brand-accent/30 px-3 py-2 text-sm font-medium text-brand-accent transition hover:border-brand-accent/50 hover:text-brand-accent sm:w-auto"
              >
                {linkCopied ? "Copied!" : "Copy link"}
              </button>
            </div>
          </div>
        ) : null}

        <dl className="grid gap-3 sm:grid-cols-2 text-brand-accent">
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-accent/70">Amount</dt>
            <dd className="text-base font-semibold">{formatCurrency(invoice.amount)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-accent/70">Discount</dt>
            <dd className="text-sm">{formatCurrency(invoice.discount_amount ?? null)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-accent/70">Due Date</dt>
            <dd className="text-sm">{formatIsoDate(invoice.due_date ?? null)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-brand-accent/70">Status</dt>
            <dd>
              <select
                value={invoice.status}
                onChange={handleStatusChange}
                disabled={mutation.isPending}
                className="mt-1 w-full rounded-lg border border-brand-accent/20 bg-brand-surface/80 px-3 py-2 text-sm font-medium text-brand-accent shadow-inner shadow-brand-surface/60 focus:border-brand-accent focus:outline-none"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {mutation.isPending ? (
                <p className="mt-1 text-xs text-brand-accent/70">Updating status…</p>
              ) : null}
            </dd>
          </div>
        </dl>
        {helpText ? <p className="text-xs text-brand-accent/70">{helpText}</p> : null}
        {invoice.status === "awaiting_confirmation" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-100/80 p-3 text-xs text-amber-900">
            Customer reported that they have transferred the funds. Please check your bank and move the status to
            “Paid” once cleared to automatically send their receipt.
          </div>
        ) : null}
        {invoice.customer ? (
          <div className="rounded-xl border border-brand-accent/20 bg-brand-surface/50 p-3">
            <p className="text-sm font-semibold text-brand-accent">{invoice.customer.name}</p>
            {invoice.customer.phone ? (
              <p className="text-xs text-brand-accent/70">{invoice.customer.phone}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-brand-accent">Line items</h3>
        {!invoice.lines || invoice.lines.length === 0 ? (
          <p className="text-sm text-brand-accent/70">No line items on this invoice.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brand-accent/20">
            <table className="min-w-full divide-y divide-brand-accent/20 text-sm text-brand-accent">
              <thead className="bg-brand-surface/60 text-left text-xs font-semibold uppercase tracking-wide text-brand-accent/70">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Unit price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-accent/15 bg-brand-surface/40">
                {invoice.lines.map((line) => (
                  <tr key={line.id}>
                    <td className="px-4 py-3">{line.description}</td>
                    <td className="px-4 py-3 text-brand-accent/80">{line.quantity}</td>
                    <td className="px-4 py-3 text-brand-accent/80">{formatCurrency(line.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-dashed border-brand-accent/30 bg-brand-surface/40 p-4 text-sm text-brand-accent/80">
        Keep the status in sync as you reconcile payments. Customers can flag transfers via the shared link, and
        marking an invoice as paid automatically triggers the WhatsApp receipt when configured.
      </section>
    </div>
  );
}
