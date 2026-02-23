import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    // Set environment
    environment: process.env.NEXT_PUBLIC_ENV || "development",

    // Performance Monitoring
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],

    tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,

    tracePropagationTargets: [
      "localhost",
      /^https:\/\/suoops\.com/,
      /^https:\/\/api\.suoops\.com/,
    ],

    debug: false,

    replaysOnErrorSampleRate: 1.0,
    // Keep replay sampling reasonable in all environments
    replaysSessionSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 0.1,

    // Do NOT send PII (IP, cookies, user-agent) — financial app / NDPR compliance
    sendDefaultPii: false,
  });
}
