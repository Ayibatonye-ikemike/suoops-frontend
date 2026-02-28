import { NextResponse, type NextRequest } from "next/server";

/**
 * Security headers middleware.
 *
 * Adds CSP, HSTS, X-Frame-Options, and other hardening headers
 * to every response served by the Next.js application.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const headers = response.headers;

  // -- HSTS --
  headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // -- Prevent clickjacking --
  headers.set("X-Frame-Options", "DENY");

  // -- Prevent MIME-sniffing --
  headers.set("X-Content-Type-Options", "nosniff");

  // -- Referrer policy --
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // -- Restrict browser features --
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // -- Content Security Policy --
  // Allow self, inline styles (Tailwind), Sentry, YouTube embeds, Google OAuth
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https://api.suoops.com https://*.sentry.io https://accounts.google.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
    "frame-src https://www.youtube.com https://accounts.google.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");

  headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  // Match all routes except static files, _next, and monitoring (Sentry tunnel)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|monitoring).*)"],
};
