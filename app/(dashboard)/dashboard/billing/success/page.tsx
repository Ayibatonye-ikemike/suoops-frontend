"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { trackPurchaseConversion } from "@/lib/gtag-events";
import { ArrowRight, MessageCircle } from "lucide-react";

const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

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
      trackPurchaseConversion();
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
              Your invoice wallet has been topped up.
            </p>

            <div className="mt-6 rounded-xl border border-brand-border bg-brand-background p-4 text-left">
              <p className="text-sm text-brand-textMuted">
                <span className="font-semibold text-brand-text">
                  Reference:
                </span>{" "}
                <code className="text-xs">{reference}</code>
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
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="flex-1"
              >
                Create Invoice
              </Button>
            </div>

            {/* WhatsApp invoice CTA */}
            <div className="mt-6 rounded-2xl border-2 border-[#25D366]/30 bg-[#25D366]/5 p-5 text-left">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-brand-text">
                    Create invoices on WhatsApp — fastest way!
                  </h3>
                  <p className="mt-1 text-xs text-brand-textMuted">
                    Just text what you sold and we build a professional PDF invoice instantly.
                    No app to open, no forms to fill.
                  </p>
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold">Try it:</span> send a message like:
                    </p>
                    <p className="rounded-lg bg-white px-3 py-2 text-xs text-slate-700 border border-slate-200 font-mono">
                      &quot;Invoice Joy 08012345678, 12000 wig&quot;
                    </p>
                  </div>
                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#25D366] transition hover:text-[#1ebe5a]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open WhatsApp
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
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
