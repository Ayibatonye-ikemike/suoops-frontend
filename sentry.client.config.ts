import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://490683a93af4c0821f8faccc3a05f22d@o4510345511370752.ingest.us.sentry.io/4510345513205760",
  
  // Set environment
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Send default PII data (IP, user data)
  sendDefaultPii: true,
  
  // Enable logs
  _experiments: {
    enableLogs: true,
  },
  
  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Send console.log, console.warn, and console.error calls as logs to Sentry
    Sentry.consoleIntegration({ levels: ["log", "warn", "error"] }),
  ],
});
