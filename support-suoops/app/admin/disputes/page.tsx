"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Scale, RefreshCw, Undo2, CheckCircle2 } from "lucide-react";
import { useAdminAuth } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

interface Dispute {
  escrow_id: number;
  invoice_id: number;
  invoice_public_id: string | null;
  status: string;
  seller_id: number;
  seller_name: string | null;
  seller_business: string | null;
  seller_store_status: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  gross_naira: number;
  payout_naira: number;
  dispute_reason: string | null;
  held_for_review: boolean;
  review_reason: string | null;
  delivered_at: string | null;
  delivery_proof_note: string | null;
  delivery_proof_url: string | null;
  dispatched_at: string | null;
  dispatch_tracking: string | null;
  dispatch_note: string | null;
  dispatch_proof_url: string | null;
  delivery_location: string | null;
  buyer_disputes: number;
  buyer_false_disputes: number;
  buyer_flagged: boolean;
  seller_circumvention_attempts: number;
  payout_state: string;
  transfer_reference: string | null;
  disputed_at: string | null;
  created_at: string | null;
}

interface DisputeListResponse {
  disputes: Dispute[];
  total: number;
}

type Filter = "disputed" | "review" | "held" | "refunded" | "released" | "all";

const FILTERS: Filter[] = ["disputed", "review", "held", "refunded", "released", "all"];

function statusBadge(status: string): string {
  switch (status) {
    case "disputed":
      return "bg-amber-100 text-amber-700";
    case "refunded":
      return "bg-rose-100 text-rose-700";
    case "released":
      return "bg-emerald-100 text-emerald-700";
    case "held":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function money(n: number): string {
  return `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

function payoutLabel(state: string): { text: string; cls: string } {
  switch (state) {
    case "paid":
      return { text: "Payout paid ✓", cls: "bg-emerald-100 text-emerald-700" };
    case "processing":
    case "pending":
      return { text: "Payout processing…", cls: "bg-amber-100 text-amber-700" };
    case "failed":
      return { text: "Payout failed", cls: "bg-rose-100 text-rose-700" };
    case "refunded":
      return { text: "Refunded", cls: "bg-rose-100 text-rose-700" };
    case "unknown":
      return { text: "Payout status unknown", cls: "bg-slate-100 text-slate-600" };
    default:
      return { text: "No payout yet", cls: "bg-slate-100 text-slate-500" };
  }
}

export default function DisputesPage() {
  const { token, authFetch } = useAdminAuth();
  const [data, setData] = useState<DisputeListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("disputed");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [payoutLive, setPayoutLive] = useState<Record<number, string>>({});
  const [payoutBusy, setPayoutBusy] = useState<number | null>(null);

  async function checkPayout(escrowId: number) {
    setPayoutBusy(escrowId);
    try {
      const res = await authFetch(`${API}/admin/disputes/${escrowId}/payout-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not fetch payout status");
      const body = await res.json();
      setPayoutLive((p) => ({ ...p, [escrowId]: body.state }));
      // If the transfer landed, the hold was finalized — refresh so the row
      // moves to Released.
      if (body.escrow_status === "released" || body.state === "paid") {
        await fetchData();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not fetch payout status");
    } finally {
      setPayoutBusy(null);
    }
  }

  async function retryPayout(escrowId: number) {
    if (
      !window.confirm(
        "Retry the seller payout on the correct rail? Safe — it won't double-pay if a transfer already went through.",
      )
    )
      return;
    setPayoutBusy(escrowId);
    try {
      const doPost = (otp?: string) =>
        authFetch(`${API}/admin/disputes/${escrowId}/retry-payout`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ otp }),
        });
      let res = await doPost();
      if (res.status === 401) {
        await authFetch(`${API}/admin/disputes/${escrowId}/step-up-otp`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const otp =
          window.prompt(
            "This is a high-value payout. Enter the confirmation code sent to your admin email:",
          ) || "";
        if (!otp) return;
        res = await doPost(otp);
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.detail || "Retry failed");
      if (body.state) setPayoutLive((p) => ({ ...p, [escrowId]: body.state }));
      await fetchData();
      if (body.message) alert(body.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Retry failed");
    } finally {
      setPayoutBusy(null);
    }
  }

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await authFetch(`${API}/admin/disputes?status_filter=${filter}&limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load disputes");
      setData(await res.json());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading disputes");
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function resolve(escrowId: number, action: "refund" | "release") {
    let suspendSeller = false;
    let blockCard = false;
    let reason: string | null = null;
    if (action === "refund") {
      if (
        !window.confirm(
          "Refund the buyer for this order? The seller will NOT be paid.",
        )
      )
        return;
      suspendSeller = window.confirm(
        "Also SUSPEND the seller's storefront (delist it)? OK = suspend, Cancel = don't.",
      );
      blockCard = window.confirm(
        "Was this CARD FRAUD? OK = block the funding card from new orders, Cancel = don't.",
      );
      reason = window.prompt("Reason (optional):", "") || null;
    } else {
      if (
        !window.confirm(
          "Release the funds to the seller? This sides with the seller and pays them out.",
        )
      )
        return;
      reason = window.prompt("Reason (optional):", "") || null;
    }
    setBusyId(escrowId);
    try {
      const doPost = (otp?: string) =>
        authFetch(`${API}/admin/disputes/${escrowId}/resolve`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            action,
            suspend_seller: suspendSeller,
            block_card: blockCard,
            reason,
            otp,
          }),
        });
      let res = await doPost();
      if (res.status === 401) {
        // High-value action → step-up: send a code to the admin email, then retry.
        await authFetch(`${API}/admin/disputes/${escrowId}/step-up-otp`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        const otp =
          window.prompt(
            "This is a high-value action. Enter the confirmation code sent to your admin email:",
          ) || "";
        if (!otp) return;
        res = await doPost(otp);
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Action failed");
      }
      const body = await res.json().catch(() => ({}));
      await fetchData();
      if (body.message) alert(body.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  if (error && !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const disputes = data?.disputes || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Scale className="h-6 w-6" /> Disputes
          </h1>
          <p className="text-slate-500">
            Buyer-protection holds: refund the buyer or release funds to the seller
          </p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              filter === f
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-slate-400">Loading…</p>
      ) : disputes.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-400">
          <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-400" />
          No {filter === "all" ? "" : filter} orders.
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => (
            <div
              key={d.escrow_id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusBadge(d.status)}`}
                    >
                      {d.status}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {d.invoice_public_id || `#${d.invoice_id}`}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    Seller:{" "}
                    <span className="font-medium">
                      {d.seller_business || d.seller_name || `#${d.seller_id}`}
                    </span>
                    {d.seller_store_status && d.seller_store_status !== "active" && (
                      <span className="ml-1 text-xs text-rose-600">
                        ({d.seller_store_status})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600">
                    Buyer: {d.customer_name || "—"}{" "}
                    {d.customer_phone && (
                      <span className="text-slate-400">({d.customer_phone})</span>
                    )}
                    {(d.buyer_disputes > 0 || d.buyer_flagged) && (
                      <span
                        className={`ml-1 text-xs font-semibold ${
                          d.buyer_flagged ? "text-rose-600" : "text-slate-500"
                        }`}
                      >
                        {d.buyer_flagged ? "⚠ abusive — " : ""}
                        {d.buyer_disputes} dispute{d.buyer_disputes === 1 ? "" : "s"}
                        {d.buyer_false_disputes > 0
                          ? `, ${d.buyer_false_disputes} false`
                          : ""}
                      </span>
                    )}
                  </p>
                  {d.seller_circumvention_attempts > 0 && (
                    <p className="text-xs font-semibold text-rose-600">
                      ⚠ Seller: {d.seller_circumvention_attempts} off-platform message
                      attempt{d.seller_circumvention_attempts === 1 ? "" : "s"}
                    </p>
                  )}
                  {d.dispute_reason && (
                    <p className="mt-1 rounded-lg bg-amber-50 px-2 py-1 text-sm text-amber-800">
                      “{d.dispute_reason}”
                    </p>
                  )}
                  {d.delivery_location && (
                    <p className="mt-1 whitespace-pre-line rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-700">
                      {d.delivery_location}
                    </p>
                  )}
                  {d.dispatched_at && (
                    <p className="mt-1 rounded-lg bg-sky-50 px-2 py-1 text-xs text-sky-800">
                      📦 Seller marked sent out
                      {d.dispatch_tracking ? ` — tracking ${d.dispatch_tracking}` : ""}
                      {d.dispatch_note ? `: “${d.dispatch_note}”` : ""}
                      {d.dispatch_proof_url && (
                        <>
                          {" "}
                          <a
                            href={d.dispatch_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline"
                          >
                            view photo
                          </a>
                        </>
                      )}
                    </p>
                  )}
                  {d.delivered_at && (
                    <p className="mt-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs text-emerald-800">
                      ✓ Seller marked delivered
                      {d.delivery_proof_note ? `: “${d.delivery_proof_note}”` : ""}
                      {d.delivery_proof_url && (
                        <>
                          {" "}
                          <a
                            href={d.delivery_proof_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold underline"
                          >
                            view photo
                          </a>
                        </>
                      )}
                    </p>
                  )}
                  {d.held_for_review && (
                    <p className="mt-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700">
                      ⚠ Flagged for review{d.review_reason ? `: ${d.review_reason}` : ""}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{money(d.gross_naira)}</p>
                  <p className="text-xs text-slate-400">payout {money(d.payout_naira)}</p>
                  {(() => {
                    const st = payoutLive[d.escrow_id] ?? d.payout_state;
                    const b = payoutLabel(st);
                    return (
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${b.cls}`}
                      >
                        {b.text}
                      </span>
                    );
                  })()}
                </div>
              </div>

              {d.payout_state !== "none" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => checkPayout(d.escrow_id)}
                    disabled={payoutBusy === d.escrow_id}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${payoutBusy === d.escrow_id ? "animate-spin" : ""}`}
                    />{" "}
                    Check payout status
                  </button>
                  {d.status === "held" &&
                    ["processing", "unknown", "failed", "pending"].includes(
                      payoutLive[d.escrow_id] ?? d.payout_state,
                    ) && (
                      <button
                        type="button"
                        onClick={() => retryPayout(d.escrow_id)}
                        disabled={payoutBusy === d.escrow_id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Retry payout
                      </button>
                    )}
                </div>
              )}

              {(d.status === "disputed" || d.status === "held") && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    disabled={busyId === d.escrow_id}
                    onClick={() => resolve(d.escrow_id, "refund")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    <Undo2 className="h-4 w-4" /> Refund buyer
                  </button>
                  <button
                    type="button"
                    disabled={busyId === d.escrow_id}
                    onClick={() => resolve(d.escrow_id, "release")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Release to seller
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
