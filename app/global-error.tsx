"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
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
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-brand-evergreen px-6 py-12 text-white">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-brand-mint/80">
            Unexpected error
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold">We hit a snag</h1>
          <p className="mt-3 text-sm text-white/80">
            Our team has been notified and is looking into it. You can try again,
            or head back to the previous screen.
          </p>
          {error.digest && (
            <p className="mt-4 text-xs text-white/60">Reference: {error.digest}</p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-brand-evergreen transition hover:bg-brand-mint/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
