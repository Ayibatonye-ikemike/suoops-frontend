// Error helpers for invoice/OCR features
// Detect whether an error indicates a premium feature requirement.
// Supports Axios-like errors and generic Error objects.

export interface BackendErrorShape {
  code?: string;
  detail?: string;
  message?: string;
}

export function isPremiumFeatureError(err: unknown): boolean {
  if (!err) return false;
  const anyErr: any = err;

  // Axios style: err.response?.status / data
  const status: number | undefined = anyErr?.response?.status;
  const data: BackendErrorShape | undefined = anyErr?.response?.data || anyErr?.data;
  const code = data?.code || anyErr?.code;
  const detail = data?.detail || data?.message || anyErr?.message;

  // Explicit code gate
  if (code && ["PREMIUM_REQUIRED", "PAYWALL", "SUBSCRIPTION_REQUIRED"].includes(code)) {
    return true;
  }

  // HTTP status heuristic (403 or 402 often used for gated features)
  if (status && (status === 402 || status === 403)) {
    if (detail && /premium|subscription|plan|upgrade/i.test(detail)) return true;
  }

  // Fallback regex on detail/message
  if (detail && /premium|subscription|upgrade required|paid plan/i.test(detail)) {
    return true;
  }

  return false;
}
