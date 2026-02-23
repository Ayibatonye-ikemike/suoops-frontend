"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-semibold text-white">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-white/70">
          We ran into an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-white/50">Ref: {error.digest}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-brand-jade px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
