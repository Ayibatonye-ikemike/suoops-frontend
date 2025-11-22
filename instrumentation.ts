import * as Sentry from "@sentry/nextjs";

export function register() {
  if (process.env.NEXT_RUNTIME !== "edge") {
    return;
  }

  Sentry.init({
    dsn:
      process.env.NEXT_PUBLIC_SENTRY_DSN ||
      "https://392f23be94c8731f0f45d3059639eda9@o4510345511370752.ingest.us.sentry.io/4510345539289088",
    environment: process.env.NEXT_PUBLIC_ENV || "development",
    tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
    sendDefaultPii: true,
  });
}
