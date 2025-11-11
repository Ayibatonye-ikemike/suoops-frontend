import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://392f23be94c8731f0f45d3059639eda9@o4510345511370752.ingest.us.sentry.io/4510345539289088",
  
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Performance Monitoring - capture 100% of transactions in development, 10% in production
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Send default PII data
  sendDefaultPii: true,
});
