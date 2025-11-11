// Unified feature gate error parsing for plan-gated features
// Supports invoice_limit_reached and premium_feature_required errors from backend.

import type { AxiosError } from "axios";

interface RawGateDetail {
  error?: string;
  message?: string;
  detail?: string;
  current_plan?: string;
  currentPlan?: string;
  current_count?: number;
  currentCount?: number;
  limit?: number | null;
  upgrade_url?: string;
  upgradeUrl?: string;
}

export interface FeatureGateParsed {
  type: "invoice_limit" | "premium_required" | "other";
  message: string;
  currentPlan?: string;
  currentCount?: number;
  limit?: number | null;
  upgradeUrl?: string;
  rawCode?: string;
}

function getAxiosParts(err: unknown): { status?: number; data?: unknown } {
  const ax = err as AxiosError;
  if (ax && typeof ax === "object" && "isAxiosError" in ax) {
    return { status: ax.response?.status, data: ax.response?.data };
  }
  return {};
}

export function parseFeatureGateError(err: unknown): FeatureGateParsed | null {
  const { status, data } = getAxiosParts(err);
  if (!status || (status !== 403 && status !== 402)) return null;
  let detail: RawGateDetail | undefined;
  
  // Type guard for data with detail property
  const hasDetail = (obj: unknown): obj is { detail: unknown } => {
    return typeof obj === "object" && obj !== null && "detail" in obj;
  };
  
  if (hasDetail(data) && typeof data.detail === "object") {
    detail = data.detail as RawGateDetail;
  } else if (typeof data === "object" && data !== null) {
    detail = data as RawGateDetail;
  }
  
  if (!detail) return null;

  const code = detail.error;
  const message = detail.message || detail.detail || "Subscription required.";
  const currentPlan = (detail.current_plan || detail.currentPlan)?.toString();
  const currentCount = detail.current_count ?? detail.currentCount;
  const limit = detail.limit;
  const upgradeUrl = detail.upgrade_url || detail.upgradeUrl || "/dashboard/upgrade";

  if (code === "invoice_limit_reached") {
    return {
      type: "invoice_limit",
      message,
      currentPlan,
      currentCount,
      limit,
      upgradeUrl,
      rawCode: code,
    };
  }
  if (code === "premium_feature_required") {
    return {
      type: "premium_required",
      message,
      currentPlan,
      upgradeUrl,
      rawCode: code,
    };
  }
  return {
    type: "other",
    message,
    currentPlan,
    upgradeUrl,
    rawCode: code,
  };
}

export function isInvoiceLimitError(err: unknown): boolean {
  return parseFeatureGateError(err)?.type === "invoice_limit";
}

export function isPremiumRequiredError(err: unknown): boolean {
  return parseFeatureGateError(err)?.type === "premium_required";
}
