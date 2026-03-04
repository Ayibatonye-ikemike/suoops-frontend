"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { InvoiceDetailPanel } from "./invoice-detail";
import { invoiceStatusLabels } from "./status-map";
import { type Invoice, useInvoices } from "./use-invoices";

/** Format an amount using the invoice's own currency (no conversion). */
function formatInvoiceAmount(amount: number, currency: string): string {
  if (currency === "USD") {
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  }
  return `₦${amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function InvoiceListWithDetail() {
  const { data, isLoading, error } = useInvoices();
  const searchParams = useSearchParams();
  const invoiceIdFromUrl = searchParams.get("invoice");
  
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string>("awaiting_confirmation");
  const [searchQuery, setSearchQuery] = useState("");

  const invoices = useMemo(() => Array.isArray(data?.items) ? data.items : [], [data]);

  // Filter invoices by status and search query
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((inv) => inv.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (inv) =>
          inv.invoice_id.toLowerCase().includes(query) ||
          inv.amount.toString().includes(query)
      );
    }

    return filtered;
  }, [invoices, statusFilter, searchQuery]);

  const hasInvoices = invoices.length > 0;
  const hasFilteredInvoices = filteredInvoices.length > 0;

  // Status counts for filter badges
  const statusCounts = useMemo(() => {
    return {
      all: invoices.length,
      pending: invoices.filter((inv) => inv.status === "pending").length,
      awaiting_confirmation: invoices.filter(
        (inv) => inv.status === "awaiting_confirmation"
      ).length,
      paid: invoices.filter((inv) => inv.status === "paid").length,
    };
  }, [invoices]);

  // Auto-select invoice from URL query param or default to first
  useEffect(() => {
    if (!hasInvoices) {
      setSelectedInvoiceId(null);
      return;
    }
    
    // If invoice ID is in URL, select it (even if not in current filter)
    if (invoiceIdFromUrl && invoices.some(inv => inv.invoice_id === invoiceIdFromUrl)) {
      setSelectedInvoiceId(invoiceIdFromUrl);
      // Clear status filter to show the invoice
      setStatusFilter("all");
      return;
    }
    
    if (
      selectedInvoiceId &&
      filteredInvoices.some(
        (invoice) => invoice.invoice_id === selectedInvoiceId
      )
    ) {
      return;
    }
    if (filteredInvoices.length > 0) {
      setSelectedInvoiceId(filteredInvoices[0].invoice_id);
    } else {
      setSelectedInvoiceId(null);
    }
  }, [hasInvoices, filteredInvoices, selectedInvoiceId, invoiceIdFromUrl, invoices]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
        <p className="text-sm text-brand-textMuted">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 shadow-card">
        <p className="text-sm text-rose-800">
          Failed to load invoices. Please refresh.
        </p>
      </div>
    );
  }

  const badgeToneClass = (tone: string | undefined) => {
    switch (tone) {
      case "success":
        return "bg-brand-statusPaidBg text-brand-statusPaidText border border-green-200";
      case "warning":
        return "bg-brand-statusPendingBg text-brand-statusPendingText border border-amber-200";
      case "danger":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-brand-background text-brand-textMuted border border-brand-border";
    }
  };

  return (
    <>
      {/* Invoice List Card */}
      <div className="rounded-lg border border-brand-border bg-white p-5 shadow-card">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-brand-text">
            Track your payments
          </h2>
          <p className="mt-1 text-xs text-brand-textMuted">
            See which invoices are paid and which need follow-up
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by ID or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full rounded-lg border border-brand-border bg-white px-4 py-2.5 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />

        {/* Filter Buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(
            [
              { key: "awaiting_confirmation", label: "Awaiting" },
              { key: "pending", label: "Pending" },
              { key: "paid", label: "Paid" },
              { key: "all", label: "All" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                statusFilter === filter.key
                  ? "border-brand-jade bg-brand-jade text-white shadow-sm"
                  : "border-brand-jade/50 bg-brand-jade/10 text-brand-evergreen hover:border-brand-jade/70"
              }`}
            >
              {filter.label} ({statusCounts[filter.key] as number})
            </button>
          ))}
        </div>

        {/* Invoice List */}
        <div className="max-h-[500px] space-y-2 overflow-y-auto">
          {hasFilteredInvoices ? (
            filteredInvoices.map((invoice: Invoice) => {
              const status = invoiceStatusLabels[invoice.status] ?? {
                label: invoice.status,
                tone: "neutral" as const,
              };
              const isSelected = selectedInvoiceId === invoice.invoice_id;

              return (
                <div
                  key={invoice.invoice_id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedInvoiceId(invoice.invoice_id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedInvoiceId(invoice.invoice_id);
                    }
                  }}
                  className={`cursor-pointer rounded-lg border bg-white p-3 transition ${
                    isSelected
                      ? "border-brand-jade ring-2 ring-brand-jade/20"
                      : "border-brand-border hover:border-brand-jade/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-brand-text truncate">
                        {invoice.invoice_id}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-brand-primary">
                        {formatInvoiceAmount(Number(invoice.amount) || 0, invoice.currency ?? "NGN")}
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeToneClass(
                        status.tone
                      )}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : hasInvoices ? (
            <div className="rounded-lg border border-dashed border-brand-border bg-brand-background p-6 text-center">
              <p className="text-sm text-brand-textMuted">
                No invoices match your filters.
              </p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex rounded-lg border border-brand-jade bg-brand-jade px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-dashed border-brand-jade/30 bg-gradient-to-b from-emerald-50/50 to-white p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-jade/10">
                <svg className="h-6 w-6 text-brand-jade" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-semibold text-brand-text">No invoices yet</p>
              <p className="mt-1 text-xs text-brand-textMuted">Use the form on the left, or text our WhatsApp bot:</p>
              <div className="mt-2 inline-block rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-1.5">
                <p className="text-xs text-emerald-800 font-mono">&quot;Invoice John 50k for design&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invoice Detail Panel - Rendered separately to be placed in parent grid */}
      {hasFilteredInvoices && selectedInvoiceId && (
        <InvoiceDetailPanel invoiceId={selectedInvoiceId} />
      )}
    </>
  );
}

export function useInvoiceSelection() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  return { selectedInvoiceId, setSelectedInvoiceId };
}
