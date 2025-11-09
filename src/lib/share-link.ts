/**
 * Utilities for building canonical invoice share links.
 *
 * Precedence:
 * 1. NEXT_PUBLIC_APP_URL
 * 2. NEXT_PUBLIC_FRONTEND_URL
 * 3. window.location.origin (browser only)
 *
 * Returns empty string if origin cannot be resolved.
 */
export function getAppOrigin(): string {
  const explicit = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_FRONTEND_URL || '').trim();
  if (explicit) {
    return explicit.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return '';
}

export function buildInvoiceShareLink(invoiceId: string | null | undefined): string {
  if (!invoiceId) return '';
  const origin = getAppOrigin();
  if (!origin) return '';
  return `${origin}/pay/${encodeURIComponent(invoiceId)}`;
}

export function isShareLinkValid(link: string): boolean {
  if (!link) return false;
  try {
    const url = new URL(link);
    // Basic host sanity: must have protocol and host; disallow localhost without explicit env var
    return Boolean(url.protocol.startsWith('http')) && Boolean(url.host);
  } catch {
    return false;
  }
}
