"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getConfig } from "@/lib/config";

const { apiBaseUrl } = getConfig();

export default function FeedbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-jade border-t-transparent" />
        </div>
      }
    >
      <FeedbackForm />
    </Suspense>
  );
}

function FeedbackForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900">Invalid Link</h1>
          <p className="mt-2 text-slate-600">
            This feedback link is missing or invalid. Please use the link from your email.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-brand-jade px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="text-2xl font-bold text-slate-900">
            Thank you for your feedback!
          </h1>
          <p className="mt-2 text-slate-600">
            Your words mean a lot to us. We may feature your review on our
            website to help other businesses discover SuoOps.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-brand-jade px-6 py-3 text-sm font-semibold text-white hover:bg-brand-teal"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/public/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, text: text.trim() }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.detail || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-evergreen">
            How&apos;s SuoOps working for you?
          </h1>
          <p className="mt-2 text-slate-600">
            Your honest feedback helps us improve and helps other businesses
            discover SuoOps.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Tell us about your experience
          </label>
          <textarea
            id="feedback"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. SuoOps has made invoicing so easy for my business..."
            rows={5}
            maxLength={500}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-jade focus:outline-none focus:ring-1 focus:ring-brand-jade resize-none"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>Minimum 10 characters</span>
            <span>{text.length}/500</span>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || text.trim().length < 10}
            className="mt-4 w-full rounded-lg bg-brand-jade px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-teal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            ⭐ Your feedback may be featured on our website with your business
            name.
          </p>
        </form>
      </div>
    </div>
  );
}
