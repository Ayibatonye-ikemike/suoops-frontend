"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

import { InvoiceDetailPanel } from "./invoice-detail";
import { invoiceStatusHelpText, invoiceStatusLabels } from "./status-map";
import { type Invoice, useInvoices } from "./use-invoices";

export function InvoiceList() {
  const { data, isLoading, error, isFetching, dataUpdatedAt, refetch } = useInvoices();
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

  // Auto-select first filtered invoice
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

  // Determine if auto-refresh should be active (pending or awaiting_confirmation invoices exist)
  const shouldAutoRefresh = useMemo(
    () => invoices.some((inv) => inv.status === "pending" || inv.status === "awaiting_confirmation"),
    [invoices]
  );

  // Interval-based refetch while invoices are in a transitional state
  useEffect(() => {
    if (!shouldAutoRefresh) return;
    const id = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(id);
  }, [shouldAutoRefresh, refetch]);

  const lastUpdated = useMemo(() => {
    if (!dataUpdatedAt) {
      return null;
    }
    return new Date(dataUpdatedAt).toLocaleTimeString();
  }, [dataUpdatedAt]);

  if (isLoading) {
    return <p>Loading invoices...</p>;
  }

  if (error) {
    return <p>Failed to load invoices. Please refresh.</p>;
  }

  const badgeToneClass = (tone: string | undefined) => {
    switch (tone) {
      case "success":
        return "bg-brand-statusPaidBg text-brand-statusPaidText";
      case "warning":
        return "bg-brand-statusPendingBg text-brand-statusPendingText";
      case "danger":
        return "bg-red-100 text-red-700";
      default:
        return "bg-brand-background text-brand-textMuted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview Card */}
      <div className="rounded-xl border border-brand-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-brand-text">Invoice Status</h2>
            <p className="mt-1 text-xs text-brand-textMuted">
              Keep invoice statuses in sync after you confirm customer payments.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
        <div className="space-y-1">
          {lastUpdated && (
            <p className="text-xs italic text-brand-textMuted">Last updated: {lastUpdated}</p>
          )}
          {shouldAutoRefresh && (
            <p className="text-[11px] text-brand-textMuted" aria-live="polite">
              Auto-refresh active (every 5s while pending invoices exist)
            </p>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by invoice ID or amount..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-brand-border bg-white px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />

        <div className="flex flex-wrap gap-2">
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
                  ? "border-brand-jade bg-brand-jade text-white shadow-sm"
                  : "border-brand-jade/50 bg-brand-jade/10 text-brand-evergreen hover:border-brand-jade/70"
              }`}
            >
              {filter.label} ({statusCounts[filter.key] as number})
            </button>
          ))}
        </div>
      </div>

      {/* Invoice List */}
      {hasFilteredInvoices ? (
        <div className="space-y-3">
          {filteredInvoices.map((invoice: Invoice) => {
            const status = invoiceStatusLabels[invoice.status] ?? {
              label: invoice.status,
              tone: "neutral" as const,
            };
            const helpText = invoiceStatusHelpText[invoice.status];
            const isSelected = selectedInvoiceId === invoice.invoice_id;

            const selectInvoice = () => setSelectedInvoiceId(invoice.invoice_id);

            return (
              <div key={invoice.invoice_id}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={selectInvoice}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectInvoice();
                    }
                  }}
                  className={`rounded-xl border bg-white p-5 text-left shadow-sm transition ${
                    isSelected 
                      ? "border-brand-jade ring-2 ring-brand-jade/20" 
                      : "border-brand-border hover:border-brand-jade/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <strong className="text-base font-bold text-brand-text">{invoice.invoice_id}</strong>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeToneClass(status.tone)}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-brand-primary">₦{invoice.amount.toLocaleString()}</p>
                      {helpText && <p className="mt-1 text-sm text-brand-textMuted">{helpText}</p>}
                    </div>
                  </div>
                  {invoice.pdf_url && (
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={invoice.pdf_url}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-jadeHover"
                        onClick={(event) => event.stopPropagation()}
                      >
                        📄 View PDF
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : hasInvoices ? (
        <div className="rounded-xl border border-dashed border-brand-border bg-brand-background p-6 text-center">
          <p className="text-sm text-brand-textMuted">No invoices match your filters.</p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="mt-4 inline-flex rounded-lg border border-brand-jade bg-brand-jade px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-jadeHover"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-brand-border bg-brand-background p-6 text-center text-sm text-brand-textMuted">
          No invoices yet. Create one from WhatsApp or the API to see it here.
        </div>
      )}

      {/* Invoice Detail Panel */}
      {hasFilteredInvoices && selectedInvoiceId && (
        <InvoiceDetailPanel invoiceId={selectedInvoiceId} />
      )}
    </div>
  );
}
