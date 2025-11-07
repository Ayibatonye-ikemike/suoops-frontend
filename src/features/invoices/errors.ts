// Error helpers for invoice/OCR features
// Detect whether an error indicates a premium feature requirement.
// Supports Axios errors and generic Error objects.

import type { AxiosError } from "axios";

export interface BackendErrorShape {
  code?: string;
  detail?: string;
  message?: string;
}

function extractAxiosParts(err: AxiosError | unknown): {
  status?: number;
  data?: BackendErrorShape;
} {
  const axiosErr = err as AxiosError<BackendErrorShape>;
  if (axiosErr && typeof axiosErr === "object" && "isAxiosError" in axiosErr) {
    return {
      status: axiosErr.response?.status,
      data: axiosErr.response?.data,
    };
  }
  return {};
}

export function isPremiumFeatureError(err: unknown): boolean {
  if (!err) return false;

  // Basic message (works for regular Error or unknown objects with message)
  let baseMessage: string | undefined;
  if (typeof err === "object" && err !== null && "message" in err) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === "string") baseMessage = maybeMsg;
  }

  const { status, data } = extractAxiosParts(err);
  const code = data?.code;
  const detail = data?.detail || data?.message || baseMessage;

  // Explicit backend code markers
  if (code && ["PREMIUM_REQUIRED", "PAYWALL", "SUBSCRIPTION_REQUIRED"].includes(code)) {
    return true;
  }

  // HTTP status heuristic (402 Payment Required or 403 Forbidden)
  if (status && (status === 402 || status === 403)) {
    if (detail && /premium|subscription|plan|upgrade/i.test(detail)) return true;
  }

  // Fallback pattern search
  if (detail && /premium|subscription|upgrade required|paid plan/i.test(detail)) {
    return true;
  }

  return false;
}

export type { AxiosError };

// Provide extra structured information for UI (code + message + upgrade suggestion)
export function getPremiumFeatureInfo(err: unknown): { required: boolean; code?: string; message?: string } {
  if (!isPremiumFeatureError(err)) return { required: false };
  const { data } = extractAxiosParts(err);
  const code = data?.code;
  const detail = data?.detail || data?.message;
  return {
    required: true,
    code,
    message: detail || (code ? `Premium feature (${code})` : 'Premium feature required'),
  };
}
