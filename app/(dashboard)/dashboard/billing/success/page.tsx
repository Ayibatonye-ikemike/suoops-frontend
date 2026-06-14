"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INVOICE_PACK_SIZE } from "@/constants/pricing";
import { trackPurchaseConversion } from "@/lib/gtag-events";
import { apiClient } from "@/api/client";
import {
  Crown,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const BOT_NUMBER = "2348106865807";
const WHATSAPP_LINK = `https://wa.me/${BOT_NUMBER}?text=Hi`;

interface UserData {
  plan?: string;
}

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );

  const reference = searchParams.get("reference");

  const { data: user } = useQuery<UserData>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get<UserData>("/users/me");
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const isPro = (user?.plan || "free").toLowerCase() === "pro";

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

            {/* Pro Plan CTA — only for non-Pro users */}
            {!isPro && (
              <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 text-left">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-white">
                    <Crown className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-brand-text">
                      Unlock Pro features for ₦1,500/mo
                    </h3>
                    <p className="mt-1 text-xs text-brand-textMuted">
                      Make every invoice look more professional and run your business smarter.
                      Subscribe to the Pro Plan and get:
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      <li className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span><strong>Custom logo branding</strong> — your logo on every invoice</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span><strong>Tax reports (PIT + CIT)</strong> — auto-generated for filing</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span><strong>Inventory &amp; margin analysis</strong> — know your real profit</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span><strong>Team management</strong> — invite 3 staff to help invoice</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span><strong>Daily WhatsApp summary</strong> — know your numbers every morning</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <Link
                        href="/dashboard/billing/purchase"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-500"
                      >
                        <Sparkles className="h-4 w-4" />
                        Subscribe — ₦1,500/mo
                      </Link>
                      <Link
                        href="/dashboard/pro"
                        className="text-xs font-semibold text-amber-700 transition hover:text-amber-900"
                      >
                        See all Pro features →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pro guide link — for Pro Pack buyers */}
            {isPro && (
              <div className="mt-4 rounded-2xl border border-brand-jade/30 bg-emerald-50/50 p-5 text-left">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-jade/10 text-brand-jade">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-brand-text">
                      You&apos;re Pro — here&apos;s how to use every feature
                    </h3>
                    <p className="mt-1 text-xs text-brand-textMuted">
                      Custom branding, tax reports, inventory, team management and more.
                      We&apos;ll show you exactly what to set up first.
                    </p>
                    <Link
                      href="/dashboard/pro"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-jade transition hover:text-emerald-700"
                    >
                      Open your Pro guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
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
