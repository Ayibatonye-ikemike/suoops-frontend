// Simple telemetry stub; replace with real analytics provider later.
// Each event is logged to console in development.

export interface TelemetryEvent {
  type: string;
  ts: string; // ISO timestamp
  trace_id?: string;
  detail?: Record<string, unknown>;
}

const ENDPOINT = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/telemetry/frontend`
  : "https://api.suoops.com/telemetry/frontend";

function getTraceId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return sessionStorage.getItem("oauth_client_trace_id") || undefined;
}

export async function emit(event: TelemetryEvent): Promise<void> {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[telemetry]", event);
  }
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
      credentials: "include",
    });
  } catch {
    // swallow
  }
}

export function emitNow(type: string, detail?: Record<string, unknown>) {
  void emit({ type, detail, ts: new Date().toISOString(), trace_id: getTraceId() });
}

export function logFeatureEvent(detail: { feature: string; action: string; [key: string]: unknown }) {
  emitNow("feature_event", detail);
}

export const telemetry = {
  oauthStart(codePresent: boolean, statePresent: boolean) {
    emitNow("oauth_start", { codePresent, statePresent });
  },
  oauthExchangeSuccess(provider: string, attempt: number) {
    emitNow("oauth_exchange_success", { provider, attempt });
  },
  oauthExchangeFailure(provider: string, kind: string, attempt: number, message?: string) {
    emitNow("oauth_exchange_failure", { provider, kind, attempt, message });
  },
  oauthCallbackError(kind: string, message: string) {
    emitNow("oauth_callback_error", { kind, message });
  },
  oauthCallbackSuccess() {
    emitNow("oauth_callback_success");
  },
};
