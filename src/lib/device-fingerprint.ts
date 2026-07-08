"use client";

/**
 * Lightweight, dependency-free device fingerprint for anti-fraud signals.
 *
 * This is NOT a hardened fingerprint (we deliberately avoid heavy third-party
 * libraries). It derives a stable-ish identifier from coarse device/browser
 * attributes and hashes it with SHA-256, producing a 64-char hex string that
 * matches the backend `signup_device_id` column width.
 *
 * Goals:
 *   - Same browser/device → same fingerprint across visits (helps link
 *     multiple accounts created from one device).
 *   - No PII: only coarse, non-identifying attributes are hashed.
 *   - Never throws — returns null if the environment can't produce one.
 */

const STORAGE_KEY = "suoops.device_id";

function collectSignals(): string {
  const nav = typeof navigator !== "undefined" ? navigator : ({} as Navigator);
  const scr = typeof screen !== "undefined" ? screen : ({} as Screen);
  const parts = [
    nav.userAgent ?? "",
    nav.language ?? "",
    (nav.languages ?? []).join(","),
    // platform is deprecated but still widely populated; useful as a coarse signal
    (nav as Navigator & { platform?: string }).platform ?? "",
    String((nav as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? ""),
    String((nav as Navigator & { deviceMemory?: number }).deviceMemory ?? ""),
    String((nav as Navigator & { maxTouchPoints?: number }).maxTouchPoints ?? ""),
    `${scr.width ?? ""}x${scr.height ?? ""}x${scr.colorDepth ?? ""}`,
    String(new Date().getTimezoneOffset()),
    (() => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      } catch {
        return "";
      }
    })(),
  ];
  return parts.join("|");
}

async function sha256Hex(input: string): Promise<string | null> {
  try {
    if (typeof crypto === "undefined" || !crypto.subtle) return null;
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

/**
 * Returns a stable device fingerprint (64-char hex) or null when unavailable
 * (e.g. SSR, insecure context without SubtleCrypto). The result is cached in
 * localStorage so repeat visits are fast and stable.
 */
export async function getDeviceFingerprint(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(STORAGE_KEY);
    if (cached && cached.length === 64) return cached;
  } catch {
    /* localStorage may be unavailable (private mode) — fall through */
  }

  const fingerprint = await sha256Hex(collectSignals());
  if (!fingerprint) return null;

  try {
    window.localStorage.setItem(STORAGE_KEY, fingerprint);
  } catch {
    /* ignore persistence failures */
  }
  return fingerprint;
}
