"use client";

import { useCallback, useState } from "react";
import { MapPin, LocateFixed, AlertTriangle, CheckCircle2 } from "lucide-react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
// Reject fuzzy fixes (desktop/IP guesses) so we only accept a real GPS lock.
const MAX_ACCURACY_METRES = 1000;

export interface CapturedLocation {
  lat: number;
  lng: number;
  accuracy: number;
}

/**
 * GPS "use my current location" capture — no manual entry (anti-fraud).
 *
 * Uses the browser Geolocation API with high accuracy, rejects low-accuracy
 * (desktop/IP) fixes, and shows a READ-ONLY Mapbox static-image pin to confirm.
 * It emits the coordinates via ``onCapture``; the parent persists them (and the
 * server derives the state).
 */
export function CurrentLocationCapture({
  onCapture,
  busy = false,
  confirmedLabel = null,
  ctaLabel = "Use my current location",
}: {
  onCapture: (loc: CapturedLocation) => void | Promise<void>;
  busy?: boolean;
  confirmedLabel?: string | null;
  ctaLabel?: string;
}) {
  const [coords, setCoords] = useState<CapturedLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    setError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Location isn't supported on this device. Please open on your phone.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > MAX_ACCURACY_METRES) {
          setError(
            "We couldn't get a precise location. Turn on GPS (or open on your phone) and try again.",
          );
          return;
        }
        const loc = { lat: latitude, lng: longitude, accuracy };
        setCoords(loc);
        void onCapture(loc);
      },
      (err) => {
        setLocating(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. Please allow location access to continue."
            : "Couldn't get your location. Please try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }, [onCapture]);

  const staticMap =
    coords && MAPBOX_TOKEN
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+16a34a(${coords.lng},${coords.lat})/${coords.lng},${coords.lat},15,0/480x180@2x?access_token=${MAPBOX_TOKEN}`
      : null;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={locate}
        disabled={locating || busy}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-jade bg-brand-jade/5 px-4 py-2.5 text-sm font-semibold text-brand-evergreen transition hover:bg-brand-jade/10 disabled:opacity-50"
      >
        <LocateFixed className="h-4 w-4" />
        {locating ? "Getting your location…" : coords ? "Update location" : ctaLabel}
      </button>

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-red-600">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}

      {coords && (
        <div className="overflow-hidden rounded-xl border border-brand-border">
          {staticMap ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={staticMap} alt="Your location" className="h-40 w-full object-cover" />
          ) : (
            <div className="flex items-center gap-2 px-3 py-3 text-xs text-brand-textMuted">
              <MapPin className="h-4 w-4" />
              Location captured ({coords.lat.toFixed(5)}, {coords.lng.toFixed(5)})
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs">
            {busy ? (
              <span className="text-brand-textMuted">Saving location…</span>
            ) : confirmedLabel ? (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Location set{confirmedLabel ? ` — ${confirmedLabel}` : ""}
              </span>
            ) : (
              <span className="text-brand-textMuted">Location captured</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
