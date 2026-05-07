/**
 * Lightweight TTL-aware dismissal helper for in-app nudges/banners.
 *
 * Plain `localStorage.setItem(key, "true")` made dismissals stick forever,
 * so users never saw helpful nudges again even months later. This wraps the
 * value in `{ at: epoch_ms }` so a banner can re-surface after `ttlDays`.
 */

const NS = "sx-dismiss:";

interface DismissPayload {
  at: number;
}

function read(key: string): DismissPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(NS + key);
    if (!raw) return null;
    // Backwards compatibility with the legacy "true" sentinel.
    if (raw === "true") return { at: Date.now() };
    const parsed = JSON.parse(raw) as DismissPayload;
    if (typeof parsed?.at === "number") return parsed;
    return null;
  } catch {
    return null;
  }
}

/** Returns true when the dismissal is still active (within TTL). */
export function isDismissed(key: string, ttlDays = 30): boolean {
  const payload = read(key);
  if (!payload) return false;
  const ageMs = Date.now() - payload.at;
  return ageMs < ttlDays * 24 * 60 * 60 * 1000;
}

export function dismiss(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      NS + key,
      JSON.stringify({ at: Date.now() } satisfies DismissPayload),
    );
  } catch {
    /* quota / private mode — non-fatal */
  }
}

export function clearDismissal(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(NS + key);
  } catch {
    /* non-fatal */
  }
}
