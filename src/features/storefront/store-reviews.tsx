"use client";

import { useState } from "react";

import { getConfig } from "@/lib/config";

type ReviewSummary = { count: number; average: number | null };
type Review = { rating: number; text: string | null; name: string; created_at: string | null };

/**
 * Storefront reviews: shows the rating summary, lets customers who paid leave a
 * review, and lazy-loads the full list on demand.
 */
export function StoreReviews({ slug, summary }: { slug: string; summary: ReviewSummary }) {
  const { apiBaseUrl } = getConfig();
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [writing, setWriting] = useState(false);

  const loadReviews = async () => {
    setOpen((v) => !v);
    if (reviews) return;
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/reviews`, { cache: "no-store" });
      const data = (await res.json()) as { reviews?: Review[] };
      setReviews(data.reviews ?? []);
    } catch {
      setReviews([]);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900">
          Reviews
          {summary.count > 0 && (
            <span className="ml-2 font-medium text-amber-500">
              ★ {summary.average} ({summary.count})
            </span>
          )}
        </h2>
        <div className="flex items-center gap-3">
          {summary.count > 0 && (
            <button
              type="button"
              onClick={loadReviews}
              className="text-xs font-semibold text-brand-jade hover:underline"
            >
              {open ? "Hide" : "Read reviews"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setWriting(true)}
            className="text-xs font-semibold text-slate-600 hover:underline"
          >
            Leave a review
          </button>
        </div>
      </div>

      {open && reviews && (
        <div className="mt-3 space-y-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400">No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">{r.name}</span>
                  <span className="text-xs text-amber-500">{"★".repeat(r.rating)}</span>
                </div>
                {r.text && <p className="mt-1 text-xs text-slate-600">{r.text}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {writing && (
        <ReviewModal slug={slug} apiBaseUrl={apiBaseUrl} onClose={() => setWriting(false)} />
      )}
    </section>
  );
}

function ReviewModal({
  slug,
  apiBaseUrl,
  onClose,
}: {
  slug: string;
  apiBaseUrl: string;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async () => {
    if (phone.trim().length < 6) return;
    setState("saving");
    try {
      const res = await fetch(`${apiBaseUrl}/public/store/${slug}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ phone: phone.trim(), rating, text: text.trim() || null }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; detail?: string };
      if (!res.ok) throw new Error(data.detail || data.message || "Could not submit your review.");
      setMessage(data.message ?? "Thanks for your review!");
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
          <h3 className="text-base font-bold text-slate-900">Leave a review</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>
        {state === "done" ? (
          <p className="py-4 text-sm text-emerald-700">{message}</p>
        ) : (
          <>
            <p className="mb-3 text-xs text-slate-500">
              Only customers who paid this store can review. Enter the phone you ordered with.
            </p>
            <div className="mb-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-2xl ${n <= rating ? "text-amber-400" : "text-slate-200"}`}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone you ordered with"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Share a few words (optional)"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-brand-jade focus:outline-none focus:ring-2 focus:ring-brand-jade/20"
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
              {state === "saving" ? "Submitting…" : "Submit review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
