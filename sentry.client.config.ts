import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://392f23be94c8731f0f45d3059639eda9@o4510345511370752.ingest.us.sentry.io/4510345539289088",
  
  // Set environment
  environment: process.env.NEXT_PUBLIC_ENV || "development",
  
  // Performance Monitoring
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.browserTracingIntegration(),
  ],
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/suoops\.com/,
    /^https:\/\/api\.suoops\.com/,
  ],
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  replaysOnErrorSampleRate: 1.0,
  
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  
  // Send default PII data (IP, user data)
  sendDefaultPii: true,
});
