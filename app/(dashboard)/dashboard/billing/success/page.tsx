"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { INVOICE_PACK_SIZE } from "@/constants/pricing";

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  const reference = searchParams.get("reference");

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      return;
    }

    // The webhook handles the actual invoice balance update.
    // We just show success and invalidate the user cache.
    // Give a small delay for the webhook to process.
    const timer = setTimeout(() => {
      // Invalidate user data to refresh invoice balance
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      setStatus("success");
    }, 2000);

    return () => clearTimeout(timer);
  }, [reference, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-white p-8 text-brand-text shadow-xl shadow-brand-border/20">
        {status === "verifying" && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary"></div>
            <h2 className="text-2xl font-semibold">Processing Payment…</h2>
            <p className="mt-2 text-sm text-brand-textMuted">
              Please wait while we confirm your purchase.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
              <span className="text-4xl text-brand-primary">✓</span>
            </div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              Purchase Successful!
            </h2>
            <p className="mt-2 text-sm text-brand-text">
              Your invoice balance has been updated.
            </p>

            <div className="mt-6 rounded-xl border border-brand-border bg-brand-background p-4 text-left">
              <p className="text-sm text-brand-textMuted">
                <span className="font-semibold text-brand-text">
                  Reference:
                </span>{" "}
                <code className="text-xs">{reference}</code>
              </p>
              <p className="mt-2 text-sm text-brand-textMuted">
                <span className="font-semibold text-brand-text">
                  Invoices Added:
                </span>{" "}
                <span className="text-brand-jade font-medium">
                  +{INVOICE_PACK_SIZE}
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => router.push("/dashboard/settings")}
                className="flex-1 bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                View Settings
              </Button>
              <Button
                onClick={() => router.push("/dashboard/invoices")}
                variant="outline"
                className="flex-1"
              >
                Create Invoice
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <span className="text-4xl text-red-500">✗</span>
            </div>
            <h2 className="text-2xl font-semibold text-red-600">
              Something Went Wrong
            </h2>
            <p className="mt-2 text-sm text-brand-textMuted">
              We couldn&apos;t verify your payment. If you were charged, please
              contact support.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => router.push("/dashboard/billing/purchase")}
                className="flex-1 bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/dashboard/settings")}
                variant="outline"
                className="flex-1"
              >
                Go to Settings
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
