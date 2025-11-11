import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://490683a93af4c0821f8faccc3a05f22d@o4510345511370752.ingest.us.sentry.io/4510345513205760",
  
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Send default PII data
  sendDefaultPii: true,
  
  // Enable logs
  _experiments: {
    enableLogs: true,
  },
});
