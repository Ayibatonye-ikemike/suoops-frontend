"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { apiClient } from "@/api/client";

import { OrderMessageThread } from "./order-message-thread";

interface OrderEscrow {
  status: string;
  held: boolean;
  release_due_at: string | null;
  confirmed_at: string | null;
  delivered_at: string | null;
  delivery_proof_note: string | null;
  delivery_proof_url: string | null;
  held_for_review: boolean;
  gross_naira: number;
  payout_naira: number;
  customer_name: string | null;
  customer_phone: string | null;
  dispatched_at: string | null;
  dispatch_tracking: string | null;
  dispatch_note: string | null;
  dispatch_carrier: string | null;
  dispatch_eta: string | null;
  dispatch_proof_url: string | null;
  dispatch_tracking_url: string | null;
  delivery_status: string | null;
  delivery_status_label: string | null;
  delivery_courier: string | null;
  delivery_service_type: string | null;
  delivery_dropoff_station: string | null;
  unread_messages?: number;
}

function timeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "any moment now";
  const totalH = Math.floor(ms / 3_600_000);
  const days = Math.floor(totalH / 24);
  const hours = totalH % 24;
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  return `${totalH}h ${mins}m`;
}

// Format an ISO date (YYYY-MM-DD) as e.g. "Tue 14 Jul".
function formatEta(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Buyer-protection status for a storefront order, shown to the business on the
 * invoice. Renders nothing for non-storefront invoices (no escrow row).
 */
export function StorefrontOrderPanel({ invoiceId }: { invoiceId: string | null }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sentOpen, setSentOpen] = useState(false);
  const [tracking, setTracking] = useState("");
  const [carrier, setCarrier] = useState("");
  const [sentEta, setSentEta] = useState("");
  const [sentNote, setSentNote] = useState("");
  const [sentFile, setSentFile] = useState<File | null>(null);

  const { data: escrow } = useQuery({
    queryKey: ["orderEscrow", invoiceId],
    queryFn: async () => {
      const res = await apiClient.get<{ escrow: OrderEscrow | null }>(
        `/inventory/storefront/orders/${invoiceId}`,
      );
      return res.data.escrow;
    },
    enabled: Boolean(invoiceId),
    retry: false,
  });

  const markDelivered = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (note.trim()) fd.append("note", note.trim());
      if (file) fd.append("file", file);
      const res = await apiClient.post(
        `/inventory/storefront/orders/${invoiceId}/mark-delivered`,
        fd,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Marked as delivered — saved as your proof.");
      setOpen(false);
      setNote("");
      setFile(null);
      qc.invalidateQueries({ queryKey: ["orderEscrow", invoiceId] });
    },
    onError: (err) => {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      toast.error(detail || "Could not mark delivered. Please try again.");
    },
  });

  const markSent = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      if (tracking.trim()) fd.append("tracking", tracking.trim());
      if (carrier.trim()) fd.append("carrier", carrier.trim());
      if (sentEta.trim()) fd.append("eta", sentEta.trim());
      if (sentNote.trim()) fd.append("note", sentNote.trim());
      if (sentFile) fd.append("file", sentFile);
      const res = await apiClient.post(
        `/inventory/storefront/orders/${invoiceId}/mark-sent`,
        fd,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Marked as sent out — the buyer has been notified.");
      setSentOpen(false);
      setTracking("");
      setCarrier("");
      setSentEta("");
      setSentNote("");
      setSentFile(null);
      qc.invalidateQueries({ queryKey: ["orderEscrow", invoiceId] });
    },
    onError: (err) => {
      const detail = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      toast.error(detail || "Could not mark sent out. Please try again.");
    },
  });

  if (!escrow) return null;

  const statusLine = (() => {
    if (escrow.status === "released") return "✓ Released — paid out to you.";
    if (escrow.status === "refunded") return "Refunded to the buyer.";
    if (escrow.status === "disputed" || escrow.held_for_review)
      return "⚠ Under review — our team is checking this order.";
    if (escrow.held && escrow.release_due_at)
      return `Payment held — auto-releases to you in ${timeUntil(escrow.release_due_at)}.`;
    return "Payment is being held safely.";
  })();

  // Delivery-proof uploads are allowed even while an order is under review — the
  // proof (photo/tracking) is exactly what helps our team resolve it. (These
  // actions never release funds; only the window/buyer code/admin do.)
  const showActions = escrow.held;

  return (
    <div className="rounded-lg border border-brand-jade/30 bg-brand-jade/5 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-jade">
          Buyer protection
        </p>
        <span className="text-xs font-medium text-brand-textMuted">
          You get ₦{escrow.payout_naira.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </span>
      </div>
      <p className="mt-2 text-sm text-brand-text">{statusLine}</p>

      {escrow.delivery_status &&
        escrow.delivery_status_label &&
        escrow.delivery_status !== "delivered" && (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800">
            <span className="font-semibold">🚚 {escrow.delivery_status_label}</span>
            {escrow.dispatch_tracking_url && (
              <a
                href={escrow.dispatch_tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 font-semibold underline"
              >
                Track live →
              </a>
            )}
          </div>
        )}

      {escrow.held && !escrow.held_for_review && (
        <p className="mt-1 text-xs text-brand-textMuted">
          You&apos;ll be paid automatically when the window ends — even if the buyer never
          confirms. Marking delivery adds proof in case of a dispute.
        </p>
      )}
      {escrow.held && escrow.held_for_review && (
        <p className="mt-1 text-xs text-brand-textMuted">
          While we review this order, add your dispatch/delivery proof below — a photo and
          tracking help us resolve it faster and protect your payout.
        </p>
      )}

      {/* Step 1 — Sent out (seller protection: dispatch proof before delivery).
          A courier/waybill code + a photo of the packaged item = timestamped
          proof you shipped a quality item, and the buyer is told it's on the way. */}
      {escrow.dispatched_at ? (
        <div className="mt-3 rounded-md bg-sky-50 px-3 py-2 text-xs text-sky-800">
          📦 You marked this sent out
          {escrow.dispatch_carrier ? ` via ${escrow.dispatch_carrier}` : ""}
          {escrow.dispatch_tracking ? ` — tracking ${escrow.dispatch_tracking}` : ""}
          {escrow.dispatch_eta ? ` · arriving ${formatEta(escrow.dispatch_eta)}` : ""}
          {escrow.dispatch_note ? `: “${escrow.dispatch_note}”` : ""}
          {escrow.dispatch_proof_url && (
            <>
              {" "}
              <a
                href={escrow.dispatch_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                view photo
              </a>
            </>
          )}
        </div>
      ) : showActions ? (
        <div className="mt-3">
          {sentOpen ? (
            <div className="space-y-2 rounded-md border border-sky-200 bg-sky-50/50 p-3">
              <p className="text-xs font-semibold text-sky-800">
                Sending it out? Add proof to protect yourself.
              </p>
              {escrow.delivery_courier && (
                <div className="rounded-md bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
                  {escrow.delivery_service_type === "dropoff" ? (
                    <>
                      📦 Drop this package off for{" "}
                      <span className="font-semibold">{escrow.delivery_courier}</span>
                      {escrow.delivery_dropoff_station
                        ? ` at: ${escrow.delivery_dropoff_station}`
                        : ""}
                      . Then save below to book it.
                    </>
                  ) : (
                    <>
                      🚴 <span className="font-semibold">{escrow.delivery_courier}</span>{" "}
                      will pick up from your store address — the buyer paid for this
                      delivery. Pack it, then save below to book the pickup.
                    </>
                  )}
                </div>
              )}
              {/* For automated courier orders, Shipbubble fills in the courier,
                  tracking code and ETA when the pickup is booked — don't ask the
                  seller to type them. Self-shipped orders still show these. */}
              {!escrow.delivery_courier && (
                <>
                  <input
                    type="text"
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value.slice(0, 120))}
                    placeholder="Courier / waybill tracking code (optional)"
                    className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                  />
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value.slice(0, 80))}
                    placeholder="Courier / company name — e.g. GIG Logistics (optional)"
                    className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                  />
                  <label className="block text-[11px] font-medium text-sky-800">
                    Expected delivery date (optional)
                  </label>
                  <input
                    type="date"
                    value={sentEta}
                    onChange={(e) => setSentEta(e.target.value)}
                    className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
                  />
                </>
              )}
              <textarea
                value={sentNote}
                onChange={(e) => setSentNote(e.target.value.slice(0, 255))}
                rows={2}
                placeholder="Dispatch note (optional) — e.g. packed 2 items, sealed blue box"
                className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <label className="block text-[11px] font-semibold text-sky-800">
                Photo of the packaged item <span className="text-rose-600">*</span>
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setSentFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-brand-textMuted"
              />
              <p className="text-[11px] text-brand-textMuted">
                A photo is required — snap the packaged item before it leaves; it proves
                quality and shipment.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markSent.mutate()}
                  disabled={markSent.isPending || !sentFile}
                  className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
                >
                  {markSent.isPending ? "Saving…" : "Save & notify buyer"}
                </button>
                <button
                  type="button"
                  onClick={() => setSentOpen(false)}
                  className="rounded-md border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-textMuted hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSentOpen(true)}
              className="rounded-md border border-sky-600 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              {escrow.delivery_courier
                ? escrow.delivery_service_type === "dropoff"
                  ? "Drop off & mark sent"
                  : "Book courier pickup"
                : "Mark as sent out"}
            </button>
          )}
        </div>
      ) : null}

      {escrow.delivered_at ? (
        <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          ✓ You marked this delivered
          {escrow.delivery_proof_note ? `: “${escrow.delivery_proof_note}”` : ""}
          {escrow.delivery_proof_url && (
            <>
              {" "}
              <a
                href={escrow.delivery_proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                view photo
              </a>
            </>
          )}
        </div>
      ) : showActions ? (
        <div className="mt-3">
          {open ? (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 255))}
                rows={2}
                placeholder="Delivery note (optional) — e.g. handed to customer at their gate"
                className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade"
              />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-xs text-brand-textMuted"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => markDelivered.mutate()}
                  disabled={markDelivered.isPending}
                  className="rounded-md bg-brand-jade px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-jadeHover disabled:opacity-60"
                >
                  {markDelivered.isPending ? "Saving…" : "Save delivery proof"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-textMuted hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md border border-brand-jade px-3 py-1.5 text-xs font-semibold text-brand-jade transition hover:bg-brand-jade/10"
            >
              Mark as delivered
            </button>
          )}
        </div>
      ) : null}
      {invoiceId && escrow.held ? (
        <OrderMessageThread invoiceId={invoiceId} unread={escrow.unread_messages ?? 0} />
      ) : null}
    </div>
  );
}
