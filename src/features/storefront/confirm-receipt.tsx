"use client";

import { useState } from "react";

import { getConfig } from "@/lib/config";

/**
 * Lets a buyer confirm they received their order, which releases the held
 * payment to the seller straight away (instead of waiting out the protection
 * window). Gated by the phone number the order was placed with.
 */
export function ConfirmReceipt({ slug }: { slug: string }) {
  const { apiBaseUrl } = getConfig();
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState(false);

  return (
    <section className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-brand-jade hover:underline"
      >
        Got your order? Confirm you received it
      </button>
      <button
        type="button"
        onClick={() => setReporting(true)}
        className="text-xs font-semibold text-slate-500 hover:underline"
      >
        Problem with your order? Report it
      </button>
      {open && <ConfirmModal slug={slug} apiBaseUrl={apiBaseUrl} onClose={() => setOpen(false)} />}
      {reporting && (
        <ReportModal slug={slug} apiBaseUrl={apiBaseUrl} onClose={() => setReporting(false)} />
      )}
    </section>
  );
}

function ConfirmModal({
  slug,
  apiBaseUrl,
  onClose,
}: {
  slug: string;
  apiBaseUrl: string;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (phone.trim().length < 6) return;
    setState("saving");
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/order-received`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; detail?: string };
      if (!res.ok) throw new Error(data.detail || data.message || "Could not confirm your order.");
      setMessage(data.message ?? "Thank you for confirming!");
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Confirm you got your order</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {state === "done" ? (
          <p className="py-4 text-sm text-emerald-700">{message}</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-slate-500">
              Only confirm once you actually have your order — this releases your payment to the
              seller. Enter the phone number you ordered with.
            </p>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone you ordered with"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            {state === "error" && message && (
              <p className="mt-2 text-xs text-rose-600">{message}</p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={phone.trim().length < 6 || state === "saving"}
              className="mt-4 w-full rounded-xl bg-brand-jade py-3 text-sm font-semibold text-white transition hover:bg-brand-jadeHover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "saving" ? "Confirming…" : "Yes, I received my order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ReportModal({
  slug,
  apiBaseUrl,
  onClose,
}: {
  slug: string;
  apiBaseUrl: string;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (phone.trim().length < 6 || reason.trim().length < 3) return;
    setState("saving");
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/report-problem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ phone: phone.trim(), reason: reason.trim() }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; detail?: string };
      if (!res.ok) throw new Error(data.detail || data.message || "Could not send your report.");
      setMessage(data.message ?? "Thanks — our team will review this.");
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 sm:rounded-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Report a problem</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {state === "done" ? (
          <p className="py-4 text-sm text-emerald-700">{message}</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-slate-500">
              Your payment is safely held. Tell us what went wrong and our team will step in —
              enter the phone number you ordered with.
            </p>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone you ordered with"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 255))}
              rows={3}
              placeholder="What went wrong? (e.g. never delivered, wrong item)"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            {state === "error" && message && (
              <p className="mt-2 text-xs text-rose-600">{message}</p>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={phone.trim().length < 6 || reason.trim().length < 3 || state === "saving"}
              className="mt-4 w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "saving" ? "Sending…" : "Submit report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
