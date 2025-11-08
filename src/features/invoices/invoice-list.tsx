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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-brand-textMuted">
            <span>Keep invoice statuses in sync after you confirm customer payments.</span>
            <Button
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="ml-auto"
            >
              {isFetching ? "Refreshing…" : "Refresh"}
            </Button>
            {lastUpdated ? <span className="text-xs italic text-brand-textMuted">Updated {lastUpdated}</span> : null}
          </div>
        </div>

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
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition ${
                statusFilter === filter.key
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-border bg-white text-brand-textMuted hover:bg-brand-primary/10"
              }`}
            >
              {filter.label} ({statusCounts[filter.key] as number})
            </button>
          ))}
        </div>

        {hasFilteredInvoices ? (
          <ul className="grid gap-3">
            {filteredInvoices.map((invoice: Invoice) => {
              const status = invoiceStatusLabels[invoice.status] ?? {
                label: invoice.status,
                tone: "neutral" as const,
              };
              const helpText = invoiceStatusHelpText[invoice.status];
              const isSelected = selectedInvoiceId === invoice.invoice_id;

              const selectInvoice = () => setSelectedInvoiceId(invoice.invoice_id);

              return (
                <li key={invoice.invoice_id}>
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
                    className={`rounded-2xl border border-brand-border bg-white p-5 text-left shadow-sm transition ${
                      isSelected ? "ring-2 ring-brand-primary" : "hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 text-sm">
                      <strong className="font-semibold text-brand-text">{invoice.invoice_id}</strong>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeToneClass(status.tone)}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-brand-primary">₦ {invoice.amount}</p>
                    {helpText ? <p className="text-sm text-brand-textMuted">{helpText}</p> : null}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {invoice.pdf_url ? (
                        <Link
                          href={`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/invoices/${invoice.invoice_id}/pdf`}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline"
                          onClick={(event) => event.stopPropagation()}
                        >
                          📄 View PDF
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : hasInvoices ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-brand-background p-6 text-center text-sm text-brand-textMuted">
            No invoices match your filters.
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="mt-3 inline-flex rounded-lg border border-brand-primary px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-border bg-brand-background p-6 text-sm text-brand-textMuted">
            No invoices yet. Create one from WhatsApp or the API to see it here.
          </div>
        )}
      </div>

      <InvoiceDetailPanel invoiceId={hasFilteredInvoices ? selectedInvoiceId : null} />
    </div>
  );
}
