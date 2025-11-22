"use client";

import { useEffect, useMemo, useState } from "react";

import { InvoiceDetailPanel } from "./invoice-detail";
import { invoiceStatusLabels } from "./status-map";
import { type Invoice, useInvoices } from "./use-invoices";

export function InvoiceListWithDetail() {
  const { data, isLoading, error } = useInvoices();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const invoices = useMemo(() => data ?? [], [data]);
  
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
      awaiting_confirmation: invoices.filter((inv) => inv.status === "awaiting_confirmation").length,
      paid: invoices.filter((inv) => inv.status === "paid").length,
    };
  }, [invoices]);

  useEffect(() => {
    if (!hasInvoices) {
      setSelectedInvoiceId(null);
      return;
    }
    if (selectedInvoiceId && filteredInvoices.some((invoice) => invoice.invoice_id === selectedInvoiceId)) {
      return;
    }
    if (filteredInvoices.length > 0) {
      setSelectedInvoiceId(filteredInvoices[0].invoice_id);
    } else {
      setSelectedInvoiceId(null);
    }
  }, [hasInvoices, filteredInvoices, selectedInvoiceId]);

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
        <p className="text-sm text-rose-800">Failed to load invoices. Please refresh.</p>
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
        <h2 className="mb-4 text-lg font-bold text-brand-text">Recent Invoices</h2>
        
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
          {([
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "awaiting_confirmation", label: "Awaiting" },
            { key: "paid", label: "Paid" },
          ] as const).map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                statusFilter === filter.key
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-border bg-white text-brand-textMuted hover:border-brand-primary/40"
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
                      ? "border-brand-primary ring-2 ring-brand-primary/20"
                      : "border-brand-border hover:border-brand-primary/40 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-brand-text truncate">{invoice.invoice_id}</p>
                      <p className="mt-0.5 text-sm font-bold text-brand-primary">₦{invoice.amount.toLocaleString()}</p>
                    </div>
                    <span
                      className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeToneClass(status.tone)}`}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })
          ) : hasInvoices ? (
            <div className="rounded-lg border border-dashed border-brand-border bg-brand-background p-6 text-center">
              <p className="text-sm text-brand-textMuted">No invoices match your filters.</p>
              <button
                onClick={() => {
                  setStatusFilter("all");
                  setSearchQuery("");
                }}
                className="mt-4 inline-flex rounded-lg border border-brand-primary bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-brand-primary transition hover:bg-brand-primary hover:text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-brand-border bg-brand-background p-6 text-center text-sm text-brand-textMuted">
              No invoices yet. Create one to see it here.
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  return { selectedInvoiceId, setSelectedInvoiceId };
}
