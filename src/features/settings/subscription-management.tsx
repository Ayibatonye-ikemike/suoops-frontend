"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { getSubscriptionStatus, cancelSubscription } from "@/api/subscription";

interface SubscriptionManagementProps {
  onStatusChange?: () => void;
}

export function SubscriptionManagement({ onStatusChange }: SubscriptionManagementProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: status, isLoading, error } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: getSubscriptionStatus,
    refetchOnWindowFocus: false,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      alert(data.message);
      setShowCancelConfirm(false);
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      onStatusChange?.();
    },
    onError: (error: unknown) => {
      const message = isAxiosError(error)
        ? error.response?.data?.detail || error.message
        : error instanceof Error
        ? error.message
        : null;
      alert(message || "Failed to cancel subscription. Please try again.");
    },
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 rounded bg-brand-background" />
          <div className="h-4 w-1/2 rounded bg-brand-background" />
        </div>
      </div>
    );
  }

  if (error || !status) {
    return null;
  }

  // Only show for PRO/BUSINESS plans with active subscription
  if (!status.is_recurring && status.plan !== "PRO") {
    return null;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border border-brand-border bg-white p-6 shadow-card">
      <h3 className="text-lg font-semibold text-brand-text mb-4">
        Pro Plan — Subscription Billing
      </h3>

      <div className="space-y-4">
        {/* Billing Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-textMuted">Billing Type</span>
          <span className="text-sm font-medium text-brand-text">
            {status.is_recurring ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Auto-Renewing Monthly
              </span>
            ) : (
              <span className="text-amber-600">Manual Renewal</span>
            )}
          </span>
        </div>

        {/* Next Billing Date */}
        {status.expires_at && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-brand-textMuted">
              {status.is_recurring ? "Next Charge" : "Expires On"}
            </span>
            <span className="text-sm font-medium text-brand-text">
              {formatDate(status.expires_at)}
            </span>
          </div>
        )}

        {/* Invoice Balance */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-brand-textMuted">Invoice Balance</span>
          <span className={`text-sm font-medium ${status.invoice_balance <= 10 ? 'text-amber-600' : 'text-brand-jade'}`}>
            {status.invoice_balance} invoices
          </span>
        </div>

        {/* Cost */}
        {status.is_recurring && (
          <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-4">
            <span className="text-sm text-brand-textMuted">Monthly Cost</span>
            <span className="text-lg font-semibold text-brand-text">₦1,500</span>
          </div>
        )}

        {/* Cancel Subscription */}
        {status.is_recurring && (
          <div className="pt-4 border-t border-brand-border">
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                Cancel subscription
              </button>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800 mb-3">
                  Are you sure? You&apos;ll keep your Pro features until{" "}
                  <strong>{formatDate(status.expires_at)}</strong>, then your
                  account will switch to Free (no monthly fee, buy invoice packs as needed).
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCancelConfirm(false)}
                  >
                    Keep Subscription
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Resubscribe prompt for non-recurring */}
        {!status.is_recurring && status.plan === "PRO" && (
          <div className="pt-4 border-t border-brand-border">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800 mb-2">
                ⚠️ Your subscription will expire on{" "}
                <strong>{formatDate(status.expires_at)}</strong>.
              </p>
              <p className="text-xs text-amber-700 mb-3">
                Enable auto-renewal to keep your Pro features without interruption.
              </p>
              <Button
                size="sm"
                onClick={() => window.location.href = "/dashboard/upgrade/pro"}
              >
                Enable Auto-Renewal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
