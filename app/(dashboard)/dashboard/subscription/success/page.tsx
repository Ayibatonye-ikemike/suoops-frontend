"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { verifySubscription } from "@/api/subscription";
import { Button } from "@/components/ui/button";

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("");
  const [planInfo, setPlanInfo] = useState<{
    old_plan?: string;
    new_plan?: string;
    amount_paid?: number;
  } | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      setStatus("error");
      setMessage("Invalid payment reference. Please contact support.");
      return;
    }

    // Verify payment
    verifySubscription(reference)
      .then((data) => {
        if (data.status === "success") {
          setStatus("success");
          setMessage(data.message || "Payment successful!");
          setPlanInfo({
            old_plan: data.old_plan,
            new_plan: data.new_plan,
            amount_paid: data.amount_paid,
          });

          // Invalidate user data cache so settings page shows updated plan
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        } else {
          setStatus("error");
          setMessage(data.message || "Payment verification failed");
        }
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
            "Failed to verify payment. Please contact support."
        );
      });
  }, [searchParams, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-white p-8 text-brand-text shadow-xl shadow-brand-border/20">
        {status === "verifying" && (
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary"></div>
            <h2 className="text-2xl font-semibold">Verifying Payment…</h2>
            <p className="mt-2 text-sm text-brand-textMuted">
              Please wait while we confirm your payment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
              <span className="text-4xl text-brand-primary">✓</span>
            </div>
            <h2 className="text-2xl font-semibold text-brand-primary">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-brand-text">{message}</p>

            {planInfo && (
              <div className="mt-6 rounded-xl border border-brand-border bg-brand-background p-4 text-left">
                <p className="text-sm text-brand-textMuted">
                  <span className="font-semibold text-brand-text">
                    Previous Plan:
                  </span>{" "}
                  {planInfo.old_plan || "N/A"}
                </p>
                <p className="mt-2 text-sm text-brand-textMuted">
                  <span className="font-semibold text-brand-text">
                    New Plan:
                  </span>{" "}
                  <span className="text-brand-primary">
                    {planInfo.new_plan}
                  </span>
                </p>
                {planInfo.amount_paid && (
                  <p className="mt-2 text-sm text-brand-textMuted">
                    <span className="font-semibold text-brand-text">
                      Amount Paid:
                    </span>{" "}
                    ₦{planInfo.amount_paid.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <Button
              className="mt-6 w-full"
              onClick={() => {
                // Invalidate cache again before navigation to ensure fresh data
                queryClient.invalidateQueries({ queryKey: ["currentUser"] });
                router.push("/dashboard/settings");
              }}
            >
              Go to Settings
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-4xl text-red-600">✗</span>
            </div>
            <h2 className="text-2xl font-semibold text-red-700">
              Payment Failed
            </h2>
            <p className="mt-2 text-sm text-brand-text">{message}</p>

            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => router.push("/dashboard/settings")}
              >
                Back to Settings
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                Retry Verification
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
