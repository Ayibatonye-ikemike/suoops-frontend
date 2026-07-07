"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, Copy, CreditCard, ExternalLink, Store } from "lucide-react";
import Link from "next/link";

import {
  disableStorefront,
  enableOnlinePayments,
  enableStorefront,
  getStorefront,
  updateStorefront,
} from "@/api/payments-storefront";
import { getBankDetails } from "@/api/bank-details";

// The generated OpenAPI types don't yet include online_payments_enabled on the
// bank-details response; extend locally until types are regenerated.
type BankDetails = Awaited<ReturnType<typeof getBankDetails>> & {
  online_payments_enabled?: boolean;
};

function errorMessage(error: unknown, fallback: string): string {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response
    ?.data?.detail;
  return typeof detail === "string" ? detail : fallback;
}

export function PaymentsStorefrontSection() {
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const storefront = useQuery({
    queryKey: ["storefrontStatus"],
    queryFn: getStorefront,
    retry: false,
    staleTime: 60000,
  });

  // Online-payments state + bank presence both come from the bank-details
  // response, so the settings page doesn't fire a separate (slow) status call.
  const bankDetails = useQuery({
    queryKey: ["bankDetails"],
    queryFn: getBankDetails,
    retry: false,
    staleTime: 60000,
    refetchOnMount: "always",
  });

  const enablePayments = useMutation({
    mutationFn: enableOnlinePayments,
    onSuccess: () => {
      toast.success("Online payments enabled — storefront orders can now be paid online.");
      // The Paystack subaccount is created server-side on success, so flip the
      // card immediately, then reconcile.
      queryClient.setQueryData<BankDetails | undefined>(
        ["bankDetails"],
        (old) => (old ? { ...old, online_payments_enabled: true } : old),
      );
      queryClient.invalidateQueries({ queryKey: ["bankDetails"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not enable online payments.")),
  });

  const enableShop = useMutation({
    mutationFn: () => enableStorefront(),
    onSuccess: () => {
      toast.success("Storefront enabled.");
      queryClient.invalidateQueries({ queryKey: ["storefrontStatus"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not enable your storefront.")),
  });

  const disableShop = useMutation({
    mutationFn: disableStorefront,
    onSuccess: () => {
      toast.success("Storefront hidden.");
      queryClient.invalidateQueries({ queryKey: ["storefrontStatus"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not hide your storefront.")),
  });

  const [desc, setDesc] = useState("");
  useEffect(() => {
    if (storefront.data?.description != null) setDesc(storefront.data.description);
  }, [storefront.data?.description]);

  const saveDesc = useMutation({
    mutationFn: () => updateStorefront(desc.trim()),
    onSuccess: () => {
      toast.success("Storefront description saved.");
      queryClient.invalidateQueries({ queryKey: ["storefrontStatus"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not save the description.")),
  });

  const bank = bankDetails.data as BankDetails | undefined;
  const payEnabled = bank?.online_payments_enabled ?? false;
  const hasBank = Boolean(
    bank?.bank_name && bank?.account_number && bank?.account_name,
  );
  const storeEnabled = storefront.data?.enabled ?? false;
  const link = storefront.data?.link ?? null;
  const productCount = storefront.data?.product_count ?? 0;

  const copyLink = async () => {
    if (!link || typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Online Payments ── */}
      <div className="rounded-xl border border-brand-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-brand-jade" />
            <h3 className="text-sm font-semibold text-brand-text">Online payments</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              payEnabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${payEnabled ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            {payEnabled ? "Enabled" : "Off"}
          </span>
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          Accept card &amp; transfer payments on your storefront. When a customer
          orders from your storefront link they pay instantly and it&apos;s
          confirmed automatically — no pack used, we keep a 3% commission. Your
          manually-created invoices are unaffected: those stay on bank transfer
          and packs.
        </p>

        {payEnabled ? (
          <p className="mt-3 text-xs font-medium text-emerald-700">
            ✓ Storefront orders can be paid online and confirm instantly.
          </p>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => enablePayments.mutate()}
              disabled={!hasBank || enablePayments.isPending || bankDetails.isLoading}
              className="rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enablePayments.isPending ? "Enabling…" : "Enable online payments"}
            </button>
            {!hasBank && (
              <p className="mt-2 text-xs text-amber-600">
                Add your bank details above first — we verify them with your bank
                to set this up.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Public Storefront ── */}
      <div className="rounded-xl border border-brand-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-brand-jade" />
            <h3 className="text-sm font-semibold text-brand-text">Public storefront</h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              storeEnabled
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${storeEnabled ? "bg-emerald-500" : "bg-slate-400"}`}
            />
            {storeEnabled ? "Live" : "Off"}
          </span>
        </div>
        <p className="mt-2 text-xs text-brand-textMuted">
          A shareable page of your products. Customers browse, order, and — with
          online payments on — pay instantly. Share the link on WhatsApp,
          Instagram, or your bio.
        </p>

        {storeEnabled && productCount === 0 ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold text-amber-900">
              Your storefront is empty
            </p>
            <p className="mt-0.5 text-xs text-amber-800">
              Add products to your inventory so customers have something to order
              — until then your storefront link shows nothing. It also boosts your
              professionalism score.
            </p>
            <Link
              href="/dashboard/inventory"
              className="mt-2 inline-flex items-center gap-1 rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
            >
              Add products →
            </Link>
          </div>
        ) : null}

        {storeEnabled && link ? (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <span className="flex-1 truncate text-sm text-brand-text">{link}</span>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View
              </a>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-textMuted">
                What do you sell?{" "}
                <span className="font-normal">(shown in the Shops directory)</span>
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value.slice(0, 160))}
                rows={2}
                maxLength={160}
                placeholder="e.g. Fresh cakes, pastries & small chops for events."
                className="mt-1 block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs text-brand-textMuted">{desc.length}/160</span>
                <button
                  type="button"
                  onClick={() => saveDesc.mutate()}
                  disabled={saveDesc.isPending}
                  className="rounded-md bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jadeHover disabled:opacity-60"
                >
                  {saveDesc.isPending ? "Saving…" : "Save description"}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => disableShop.mutate()}
              disabled={disableShop.isPending}
              className="text-xs font-medium text-brand-textMuted underline-offset-2 hover:text-rose-600 hover:underline disabled:opacity-60"
            >
              {disableShop.isPending ? "Hiding…" : "Hide storefront"}
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => enableShop.mutate()}
              disabled={enableShop.isPending || storefront.isLoading}
              className="rounded-lg bg-brand-jade px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enableShop.isPending ? "Enabling…" : "Enable storefront"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
