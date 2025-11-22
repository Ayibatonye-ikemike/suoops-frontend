"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPaymentHistory, type PaymentTransaction } from "@/api/subscription";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, RefreshCw, ArrowLeft } from "lucide-react";

const STATUS_COLORS = {
  success: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-gray-100 text-gray-800 border-gray-200",
  refunded: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_LABELS = {
  success: "✓ Paid",
  pending: "⏳ Pending",
  failed: "✗ Failed",
  cancelled: "⊘ Cancelled",
  refunded: "↩ Refunded",
};

export default function PaymentHistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [summary, setSummary] = useState({
    total_paid: 0,
    successful_count: 0,
    pending_count: 0,
    failed_count: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const pageSize = 20;

  const loadPayments = async (pageNum: number, filter?: string) => {
    try {
      setLoading(true);
      const data = await getPaymentHistory({
        limit: pageSize,
        offset: pageNum * pageSize,
        status_filter: filter || undefined,
      });
      
      setPayments(data.payments);
      setSummary(data.summary);
      setHasMore(data.total > (pageNum + 1) * pageSize);
    } catch (error) {
      console.error("Failed to load payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments(page, statusFilter);
  }, [page, statusFilter]);

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
    setPage(0);
  };

  const handleRefresh = () => {
    loadPayments(page, statusFilter);
  };

  const handleExportCSV = () => {
    // Convert payments to CSV
    const headers = ["Date", "Reference", "Amount", "Status", "Plan", "Payment Method"];
    const rows = payments.map(p => [
      new Date(p.created_at).toLocaleDateString(),
      p.reference,
      `₦${p.amount.toLocaleString()}`,
      p.status,
      `${p.plan_before} → ${p.plan_after}`,
      p.payment_method || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suoops-payment-history-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading && payments.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 rounded bg-brand-background" />
          <div className="h-32 w-full rounded bg-brand-background" />
          <div className="h-64 w-full rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/settings")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-text">Payment History</h1>
            <p className="text-sm text-brand-textMuted">
              View all your subscription payments and transactions
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-brand-border bg-white p-4 shadow-sm">
          <p className="text-sm text-brand-textMuted">Total Paid</p>
          <p className="text-2xl font-bold text-brand-primary">
            ₦{summary.total_paid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-brand-border bg-white p-4 shadow-sm">
          <p className="text-sm text-brand-textMuted">Successful</p>
          <p className="text-2xl font-bold text-green-600">{summary.successful_count}</p>
        </div>
        <div className="rounded-lg border border-brand-border bg-white p-4 shadow-sm">
          <p className="text-sm text-brand-textMuted">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.pending_count}</p>
        </div>
        <div className="rounded-lg border border-brand-border bg-white p-4 shadow-sm">
          <p className="text-sm text-brand-textMuted">Failed</p>
          <p className="text-2xl font-bold text-red-600">{summary.failed_count}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <Button
          variant={statusFilter === "" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("")}
        >
          All
        </Button>
        <Button
          variant={statusFilter === "success" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("success")}
        >
          Successful
        </Button>
        <Button
          variant={statusFilter === "pending" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("pending")}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === "failed" ? "primary" : "outline"}
          size="sm"
          onClick={() => handleFilterChange("failed")}
        >
          Failed
        </Button>
      </div>

      {/* Payment Table */}
      <div className="rounded-lg border border-brand-border bg-white shadow-sm">
        {payments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-brand-textMuted">No payment history found</p>
            <p className="mt-2 text-sm text-brand-textMuted">
              Your subscription payments will appear here
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Plan Upgrade</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Billing Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(payment.created_at).toLocaleDateString()}
                        <div className="text-xs text-brand-textMuted">
                          {new Date(payment.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-brand-background px-2 py-1 text-xs">
                        {payment.reference}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        ₦{payment.amount.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="capitalize text-brand-textMuted">
                          {payment.plan_before}
                        </span>
                        <span className="mx-1">→</span>
                        <span className="font-semibold capitalize text-brand-primary">
                          {payment.plan_after}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.payment_method ? (
                        <div className="text-sm">
                          <span className="capitalize">{payment.payment_method}</span>
                          {payment.card_last4 && (
                            <div className="text-xs text-brand-textMuted">
                              {payment.card_brand} •••• {payment.card_last4}
                            </div>
                          )}
                          {payment.bank_name && (
                            <div className="text-xs text-brand-textMuted">
                              {payment.bank_name}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-brand-textMuted">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[payment.status]}>
                        {STATUS_LABELS[payment.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.billing_start_date && payment.billing_end_date ? (
                        <div className="text-xs text-brand-textMuted">
                          {new Date(payment.billing_start_date).toLocaleDateString()} —{" "}
                          {new Date(payment.billing_end_date).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-sm text-brand-textMuted">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-brand-border px-6 py-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-brand-textMuted">
                Page {page + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
