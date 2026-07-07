"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check, Copy, CreditCard, Download, ExternalLink, QrCode, Store } from "lucide-react";
import Link from "next/link";

import {
  disableStorefront,
  enableOnlinePayments,
  enableStorefront,
  getStorefront,
  getStorefrontAnalytics,
  getStorefrontQr,
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
  const [showQr, setShowQr] = useState(false);

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
    onSuccess: (data) => {
      if ((data?.product_count ?? 0) === 0) {
        toast(
          "Storefront enabled — but it's empty. Add products so customers can order.",
          { icon: "🛍️", duration: 6000 },
        );
      } else {
        toast.success("Storefront enabled.");
      }
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
    mutationFn: () => updateStorefront({ description: desc.trim() }),
    onSuccess: () => {
      toast.success("Storefront description saved.");
      queryClient.invalidateQueries({ queryKey: ["storefrontStatus"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not save the description.")),
  });

  // Store details (location, delivery, announcement, custom domain).
  const [details, setDetails] = useState({
    address: "",
    city: "",
    state: "",
    announcement: "",
    delivery_enabled: false,
    pickup_enabled: true,
    delivery_fee: 0,
    custom_domain: "",
  });
  useEffect(() => {
    const d = storefront.data;
    if (!d) return;
    setDetails({
      address: d.address ?? "",
      city: d.city ?? "",
      state: d.state ?? "",
      announcement: d.announcement ?? "",
      delivery_enabled: d.delivery_enabled ?? false,
      pickup_enabled: d.pickup_enabled ?? true,
      delivery_fee: d.delivery_fee ?? 0,
      custom_domain: d.custom_domain ?? "",
    });
  }, [storefront.data]);

  const saveDetails = useMutation({
    mutationFn: () =>
      updateStorefront({
        address: details.address.trim(),
        city: details.city.trim(),
        state: details.state.trim(),
        announcement: details.announcement.trim(),
        delivery_enabled: details.delivery_enabled,
        pickup_enabled: details.pickup_enabled,
        delivery_fee: Number(details.delivery_fee) || 0,
        custom_domain: details.custom_domain.trim(),
      }),
    onSuccess: () => {
      toast.success("Store details saved.");
      queryClient.invalidateQueries({ queryKey: ["storefrontStatus"] });
    },
    onError: (error) => toast.error(errorMessage(error, "Could not save store details.")),
  });

  const analytics = useQuery({
    queryKey: ["storefrontAnalytics"],
    queryFn: getStorefrontAnalytics,
    enabled: storefront.data?.enabled ?? false,
    retry: false,
    staleTime: 60000,
  });

  const bank = bankDetails.data as BankDetails | undefined;
  const payEnabled = bank?.online_payments_enabled ?? false;
  const hasBank = Boolean(
    bank?.bank_name && bank?.account_number && bank?.account_name,
  );
  const storeEnabled = storefront.data?.enabled ?? false;
  const link = storefront.data?.link ?? null;
  const productCount = storefront.data?.product_count ?? 0;

  const storefrontQr = useQuery({
    queryKey: ["storefrontQr"],
    queryFn: getStorefrontQr,
    enabled: showQr && storeEnabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

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
              <button
                type="button"
                onClick={() => setShowQr((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100"
              >
                <QrCode className="h-3.5 w-3.5" />
                {showQr ? "Hide QR" : "QR code"}
              </button>
            </div>
            {showQr ? (
              <div className="rounded-lg border border-brand-border bg-white p-4 text-center">
                {storefrontQr.isLoading ? (
                  <div className="mx-auto h-44 w-44 animate-pulse rounded-xl bg-slate-100" />
                ) : storefrontQr.data ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={storefrontQr.data.qr_png}
                      alt="Storefront QR code"
                      className="mx-auto h-44 w-44"
                    />
                    <p className="mt-2 text-xs text-brand-textMuted">
                      Scan to open your storefront. Print it, put it on your shop,
                      flyers or packaging.
                    </p>
                    <a
                      href={storefrontQr.data.qr_png}
                      download="storefront-qr.png"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-brand-jade px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-jadeHover"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </>
                ) : (
                  <p className="py-6 text-xs text-amber-600">
                    Could not generate the QR code. Try again in a moment.
                  </p>
                )}
              </div>
            ) : null}
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

            {/* Store details: location, announcement, delivery, domain */}
            <div className="space-y-3 rounded-lg border border-brand-border p-3">
              <p className="text-xs font-semibold text-brand-text">Store details</p>

              <input
                type="text"
                value={details.announcement}
                onChange={(e) => setDetails((d) => ({ ...d, announcement: e.target.value.slice(0, 200) }))}
                placeholder="Announcement banner — e.g. 🎉 20% off this week"
                className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <input
                type="text"
                value={details.address}
                onChange={(e) => setDetails((d) => ({ ...d, address: e.target.value }))}
                placeholder="Street address (for “Get directions”)"
                className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={details.city}
                  onChange={(e) => setDetails((d) => ({ ...d, city: e.target.value }))}
                  placeholder="City"
                  className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                />
                <input
                  type="text"
                  value={details.state}
                  onChange={(e) => setDetails((d) => ({ ...d, state: e.target.value }))}
                  placeholder="State"
                  className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-brand-text">
                  <input
                    type="checkbox"
                    checked={details.pickup_enabled}
                    onChange={(e) => setDetails((d) => ({ ...d, pickup_enabled: e.target.checked }))}
                  />
                  Pickup
                </label>
                <label className="flex items-center gap-2 text-xs text-brand-text">
                  <input
                    type="checkbox"
                    checked={details.delivery_enabled}
                    onChange={(e) => setDetails((d) => ({ ...d, delivery_enabled: e.target.checked }))}
                  />
                  Delivery
                </label>
                {details.delivery_enabled && (
                  <div className="flex items-center gap-1 text-xs text-brand-textMuted">
                    <span>Fee ₦</span>
                    <input
                      type="number"
                      min={0}
                      value={details.delivery_fee}
                      onChange={(e) => setDetails((d) => ({ ...d, delivery_fee: Number(e.target.value) }))}
                      className="w-24 rounded-lg border border-brand-border bg-white px-2 py-1 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                    />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={details.custom_domain}
                onChange={(e) => setDetails((d) => ({ ...d, custom_domain: e.target.value }))}
                placeholder="Custom domain (optional) — e.g. shop.yourbrand.com"
                className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <p className="text-[11px] text-brand-textMuted">
                Custom domains need a CNAME pointing to Suoops — contact support to finish setup.
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => saveDetails.mutate()}
                  disabled={saveDetails.isPending}
                  className="rounded-md bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jadeHover disabled:opacity-60"
                >
                  {saveDetails.isPending ? "Saving…" : "Save details"}
                </button>
              </div>
            </div>

            {/* Analytics */}
            {analytics.data && (
              <div className="rounded-lg border border-brand-border p-3">
                <p className="mb-2 text-xs font-semibold text-brand-text">Performance</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "Views", value: analytics.data.views },
                    { label: "Orders", value: analytics.data.orders },
                    { label: "Paid", value: analytics.data.paid_orders },
                    { label: "Conversion", value: `${analytics.data.conversion_rate}%` },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-lg font-bold text-brand-text">{s.value}</p>
                      <p className="text-[11px] text-brand-textMuted">{s.label}</p>
                    </div>
                  ))}
                </div>
                {analytics.data.top_products.length > 0 && (
                  <div className="mt-3 border-t border-brand-border pt-2">
                    <p className="text-[11px] font-semibold text-brand-textMuted">Top sellers</p>
                    <ul className="mt-1 space-y-0.5">
                      {analytics.data.top_products.map((p) => (
                        <li key={p.name} className="flex justify-between text-xs text-brand-text">
                          <span className="truncate">{p.name}</span>
                          <span className="text-brand-textMuted">×{p.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

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
