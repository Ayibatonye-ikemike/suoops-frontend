import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://392f23be94c8731f0f45d3059639eda9@o4510345511370752.ingest.us.sentry.io/4510345539289088",
  
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Performance Monitoring
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Send default PII data
  sendDefaultPii: true,
  
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
