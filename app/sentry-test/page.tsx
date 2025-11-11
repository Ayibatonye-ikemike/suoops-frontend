"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const testError = () => {
    throw new Error("This is your first error!");
  };

  const testLog = () => {
    Sentry.captureMessage("Test log message from Sentry", "info");
  };

  const testSpan = () => {
    Sentry.startSpan(
      {
        op: "ui.click",
        name: "Test Span Button Click",
      },
      (span) => {
        span?.setAttribute("test", "value");
        console.log("Test span created");
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-background p-6">
      <div className="rounded-lg border border-brand-border bg-white p-8 shadow-card">
        <h1 className="mb-6 text-2xl font-bold text-brand-text">Sentry Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={testError}
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
          >
            Test Error Tracking
          </button>

          <button
            onClick={testLog}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Test Log Capture
          </button>

          <button
            onClick={testSpan}
            className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Test Performance Span
          </button>
        </div>

        <p className="mt-6 text-sm text-brand-textMuted">
          Click any button above to test Sentry integration. Check your Sentry dashboard for events.
        </p>
      </div>
    </div>
  );
}
