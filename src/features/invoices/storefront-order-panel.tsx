"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { apiClient } from "@/api/client";

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

/**
 * Buyer-protection status for a storefront order, shown to the business on the
 * invoice. Renders nothing for non-storefront invoices (no escrow row).
 */
export function StorefrontOrderPanel({ invoiceId }: { invoiceId: string | null }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
    onError: () => toast.error("Could not mark delivered. Please try again."),
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

  const showActions = escrow.held && !escrow.held_for_review;

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

      {escrow.held && (
        <p className="mt-1 text-xs text-brand-textMuted">
          You&apos;ll be paid automatically when the window ends — even if the buyer never
          confirms. Marking delivery adds proof in case of a dispute.
        </p>
      )}

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
    </div>
  );
}
