"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useInvoices } from "./use-invoices";

export function InvoiceStatusCard() {
  const { data, isFetching, dataUpdatedAt, refetch } = useInvoices();

  const invoices = useMemo(() => data ?? [], [data]);

  // Status counts for display
  const statusCounts = useMemo(() => {
    return {
      total: invoices.length,
      pending: invoices.filter((inv) => inv.status === "pending").length,
      awaiting: invoices.filter((inv) => inv.status === "awaiting_confirmation")
        .length,
      paid: invoices.filter((inv) => inv.status === "paid").length,
    };
  }, [invoices]);

  const lastUpdated = useMemo(() => {
    if (!dataUpdatedAt) {
      return null;
    }
    return new Date(dataUpdatedAt).toLocaleTimeString();
  }, [dataUpdatedAt]);

  return (
    <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-brand-text">Invoice Status</h2>
          <p className="mt-1 text-xs text-brand-textMuted">
            Overview of all invoice statuses
          </p>
        </div>
        <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {/* Status Metrics */}
      <div className="space-y-4">
        <div className="rounded-lg border border-brand-border bg-brand-background p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-textMuted">
            Total Invoices
          </p>
          <p className="mt-2 text-3xl font-bold text-brand-primary">
            {statusCounts.total}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-green-200 bg-brand-statusPaidBg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-statusPaidText">
              Paid
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-statusPaidText">
              {statusCounts.paid}
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-brand-statusPendingBg p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-statusPendingText">
              Pending
            </p>
            <p className="mt-1 text-2xl font-bold text-brand-statusPendingText">
              {statusCounts.pending}
            </p>
          </div>
        </div>

        {statusCounts.awaiting > 0 && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
              Awaiting Confirmation
            </p>
            <p className="mt-1 text-2xl font-bold text-blue-800">
              {statusCounts.awaiting}
            </p>
          </div>
        )}
      </div>

      {lastUpdated && (
        <p className="mt-4 text-xs italic text-brand-textMuted">
          Last updated: {lastUpdated}
        </p>
      )}
    </div>
  );
}
