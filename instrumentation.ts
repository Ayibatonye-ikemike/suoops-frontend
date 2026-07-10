import * as Sentry from "@sentry/nextjs";

export function register() {
  if (process.env.NEXT_RUNTIME !== "edge") {
    return;
  }

  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NEXT_PUBLIC_ENV || "development",
    tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
    // Never auto-attach PII (IPs, headers, bodies) — this is a payments app.
    sendDefaultPii: false,
    beforeSend(event) {
      // Belt-and-suspenders: scrub auth/session material from any captured request.
      const headers = event.request?.headers as Record<string, unknown> | undefined;
      if (headers) {
        for (const key of Object.keys(headers)) {
          if (["authorization", "cookie", "x-csrf-token"].includes(key.toLowerCase())) {
            delete headers[key];
          }
        }
      }
      return event;
    },
  });
}

export const onRequestError = Sentry.captureRequestError;
