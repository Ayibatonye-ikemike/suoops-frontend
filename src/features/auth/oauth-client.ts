"use client";

// Reusable OAuth exchange client with retry, timeout, state integrity & trace id.

export type OAuthExchangeResult = {
  access_token: string;
  access_expires_at: string;
  refresh_token?: string | null;
  token_type?: string;
};

export type OAuthErrorKind =
  | "provider_cancelled"
  | "invalid_state"
  | "missing_params"
  | "network"
  | "server"
  | "client"
  | "unknown";

export class OAuthExchangeError extends Error {
  kind: OAuthErrorKind;
  status?: number;
  constructor(kind: OAuthErrorKind, message: string, status?: number) {
    super(message);
    this.kind = kind;
    this.status = status;
  }
}

export interface ExchangeOptions {
  timeoutMs?: number; // request timeout
  retries?: number;   // number of additional retries on transient failure
  backoffBaseMs?: number; // base backoff
  provider: string; // e.g. 'google'
  apiBaseUrl?: string; // override base URL
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getExpectedState(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("oauth_expected_state");
}

function getOrCreateTraceId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("oauth_client_trace_id");
  if (!id) {
    id = (globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    sessionStorage.setItem("oauth_client_trace_id", id);
  }
  return id;
}

import { telemetry } from "@/lib/telemetry";

export async function exchangeOAuthCode(
  code: string | null,
  state: string | null,
  opts: ExchangeOptions
): Promise<OAuthExchangeResult> {
  const { timeoutMs = 12000, retries = 2, backoffBaseMs = 400, provider, apiBaseUrl } = opts;

  if (!code || !state) {
    throw new OAuthExchangeError("missing_params", "Missing code/state parameters.");
  }

  const expectedState = getExpectedState();
  if (expectedState && expectedState !== state) {
    throw new OAuthExchangeError("invalid_state", "State mismatch. Possible CSRF/expired flow.");
  }

  const baseUrl = apiBaseUrl || process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
  const traceId = getOrCreateTraceId();
  const endpoint = `${baseUrl}/auth/oauth/${encodeURIComponent(provider)}/callback?code=${encodeURIComponent(
    code
  )}&state=${encodeURIComponent(state)}`;

  let attempt = 0;
  let lastError: unknown;

  telemetry.oauthStart(!!code, !!state);
  while (attempt <= retries) {
    attempt += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Client-Trace": traceId,
        },
        credentials: "include",
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const status = res.status;
        let detail: string | undefined;
        try {
          const body = await res.json();
          detail = body?.detail;
        } catch {
          /* ignore */
        }
        if (status >= 500) {
          throw new OAuthExchangeError("server", detail || `Server error (${status})`, status);
        }
        if (status === 400 || status === 422) {
          throw new OAuthExchangeError("client", detail || "Invalid request", status);
        }
        if (status === 401 || status === 403) {
          throw new OAuthExchangeError("client", detail || "Unauthorized", status);
        }
        throw new OAuthExchangeError("unknown", detail || `Unexpected error (${status})`, status);
      }

      const data = (await res.json()) as OAuthExchangeResult;
      // Success - clear expected state to prevent replay
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("oauth_expected_state");
      }
      telemetry.oauthExchangeSuccess(provider, attempt);
      return data;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;
      // Abort classification
      if (err instanceof DOMException && err.name === "AbortError") {
        // treat as network for retry
        if (attempt <= retries) {
          await sleep(backoffBaseMs * attempt);
          continue;
        }
        throw new OAuthExchangeError("network", "Request timed out.");
      }
      if (err instanceof OAuthExchangeError) {
        // Retry only on network/server kinds
        if ((err.kind === "server" || err.kind === "network") && attempt <= retries) {
          await sleep(backoffBaseMs * attempt);
          continue;
        }
        telemetry.oauthExchangeFailure(provider, err.kind, attempt, err.message);
        throw err;
      }
      // Unknown error
      if (attempt <= retries) {
        await sleep(backoffBaseMs * attempt);
        continue;
      }
      throw new OAuthExchangeError("network", "Network failure during OAuth exchange.");
      telemetry.oauthExchangeFailure(provider, "network", attempt, (err as Error)?.message);
      throw new OAuthExchangeError("network", "Network failure during OAuth exchange.");
    }
  }

  if (lastError instanceof OAuthExchangeError) {
    telemetry.oauthExchangeFailure(provider, lastError.kind, attempt, lastError.message);
    throw lastError;
  }
  telemetry.oauthExchangeFailure(provider, "unknown", attempt, "Final failure without classification");
  throw new OAuthExchangeError("unknown", "OAuth exchange failed after retries.");
}
