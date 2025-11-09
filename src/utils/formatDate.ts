/**
 * Date / time formatting helpers.
 *
 * paid_at timestamps are stored as ISO 8601 UTC strings from the backend.
 * We render a concise local time plus explicit UTC indicator toggle for clarity.
 */
export function formatPaidAt(iso: string | null | undefined, opts?: { mode?: 'local' | 'utc' }) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const mode = opts?.mode || 'local';
  if (mode === 'utc') {
    return d.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
  }
  // Local with short date & time, and append local TZ abbreviation if available
  try {
    const locale = undefined; // use user locale
    const formatted = d.toLocaleString(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    // Optionally add UTC offset label
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${formatted} (${tz})`;
  } catch {
    return d.toISOString();
  }
}

export function formatDateMedium(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
