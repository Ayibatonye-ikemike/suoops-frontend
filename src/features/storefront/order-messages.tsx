"use client";

import { useState } from "react";

import { getConfig } from "@/lib/config";

interface Msg {
  id: number;
  sender_role: "buyer" | "seller" | "system";
  mine: boolean;
  body: string;
  flagged: boolean;
  created_at: string | null;
}

interface OrderView {
  status: string;
  dispatched_at: string | null;
  dispatch_tracking: string | null;
  dispatch_carrier: string | null;
  dispatch_eta: string | null;
  dispatch_proof_url: string | null;
  delivered_at: string | null;
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
 * Buyer-side order chat, authenticated by the buyer-only delivery code. Delivery
 * coordination only — the seller can't share contact/bank details or push an
 * off-platform payment (the backend masks/blocks those). Reassures the buyer to
 * never move the deal off SuoOps.
 */
export function BuyerMessages({ slug }: { slug: string }) {
  const { apiBaseUrl } = getConfig();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-slate-500 hover:underline"
      >
        Message the seller
      </button>
      {open && (
        <MessagesModal slug={slug} apiBaseUrl={apiBaseUrl} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

function MessagesModal({
  slug,
  apiBaseUrl,
  onClose,
}: {
  slug: string;
  apiBaseUrl: string;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [order, setOrder] = useState<OrderView | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    if (code.trim().length < 4) return;
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/messages/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        messages?: Msg[];
        order?: OrderView;
        detail?: string;
      };
      if (!res.ok) throw new Error(data.detail || "That delivery code isn't valid.");
      setMessages(data.messages ?? []);
      setOrder(data.order ?? null);
      setLoaded(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    if (body.trim().length === 0) return;
    setBusy(true);
    setErr(null);
    setNotice(null);
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ code: code.trim(), body: body.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        blocked?: boolean;
        message?: string;
        warning?: string | null;
        detail?: string;
      };
      if (!res.ok) throw new Error(data.detail || "Could not send your message.");
      if (data.blocked) {
        setNotice(
          typeof data.message === "string"
            ? data.message
            : "Keep payments and contact on SuoOps so you stay protected.",
        );
      } else {
        setBody("");
        if (data.warning) setNotice(data.warning);
      }
      await load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="flex w-full max-w-sm flex-col rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Message the seller</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {!loaded ? (
          <>
            <p className="mb-3 text-xs text-slate-500">
              Enter your <span className="font-semibold">delivery code</span> to open your order
              chat. Keep payments and contact on SuoOps — that&apos;s what protects you.
            </p>
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit delivery code"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-center text-lg tracking-[0.3em] focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            {err && <p className="mt-2 text-xs text-rose-600">{err}</p>}
            <button
              type="button"
              onClick={load}
              disabled={code.trim().length < 4 || busy}
              className="mt-4 w-full rounded-xl bg-brand-jade py-3 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Opening…" : "Open chat"}
            </button>
          </>
        ) : (
          <>
            {order?.dispatched_at && (
              <div className="mb-3 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">
                📦 <span className="font-semibold">Your order is on the way.</span>
                {order.dispatch_carrier ? ` Courier: ${order.dispatch_carrier}.` : ""}
                {order.dispatch_tracking ? ` Tracking: ${order.dispatch_tracking}.` : ""}
                {order.dispatch_eta ? ` Expected: ${formatEta(order.dispatch_eta)}.` : ""}
                {order.dispatch_proof_url && (
                  <>
                    {" "}
                    <a
                      href={order.dispatch_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline"
                    >
                      view photo
                    </a>
                  </>
                )}
              </div>
            )}
            <div className="mb-2 max-h-64 space-y-2 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-xs text-slate-500">
                  No messages yet. Ask the seller about your delivery here.
                </p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-1.5 text-sm ${
                        m.mine ? "bg-brand-jade text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                ))
              )}
            </div>
            {notice && <p className="mb-2 text-xs text-amber-600">{notice}</p>}
            {err && <p className="mb-2 text-xs text-rose-600">{err}</p>}
            <div className="flex items-end gap-2">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, 1000))}
                rows={2}
                placeholder="Message about your delivery…"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
              />
              <button
                type="button"
                onClick={send}
                disabled={body.trim().length === 0 || busy}
                className="shrink-0 rounded-md bg-brand-jade px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-jadeHover disabled:opacity-60"
              >
                {busy ? "…" : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
