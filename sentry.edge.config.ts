import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,

    environment: process.env.NEXT_PUBLIC_ENV || "development",

    tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,

    // Do NOT send PII — financial app / NDPR compliance
    sendDefaultPii: false,
  });
}
