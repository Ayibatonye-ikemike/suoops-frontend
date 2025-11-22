import { apiClient } from "./client";

export interface InitializeSubscriptionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  amount: number;
  plan: string;
}

export interface VerifySubscriptionResponse {
  status: string;
  message: string;
  old_plan?: string;
  new_plan?: string;
  amount_paid?: number;
}

/**
 * Initialize Paystack payment for subscription upgrade.
 */
export async function initializeSubscription(
  plan: string
): Promise<InitializeSubscriptionResponse> {
  const response = await apiClient.post("/subscriptions/initialize", null, {
    params: { plan },
  });
  return response.data;
}

/**
 * Verify subscription payment after Paystack redirect.
 */
export async function verifySubscription(
  reference: string
): Promise<VerifySubscriptionResponse> {
  const response = await apiClient.get(`/subscriptions/verify/${reference}`);
  return response.data;
}

export interface PaymentTransaction {
  id: number;
  reference: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "cancelled" | "refunded";
  plan_before: string;
  plan_after: string;
  payment_method?: string;
  card_last4?: string;
  card_brand?: string;
  bank_name?: string;
  created_at: string;
  paid_at?: string;
  billing_start_date?: string;
  billing_end_date?: string;
  failure_reason?: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentTransaction[];
  total: number;
  limit: number;
  offset: number;
  summary: {
    total_paid: number;
    successful_count: number;
    pending_count: number;
    failed_count: number;
  };
}

export interface PaymentDetailResponse extends PaymentTransaction {
  provider: string;
  customer_email: string;
  customer_phone?: string;
  paystack_transaction_id?: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}

/**
 * Get payment history for current user.
 */
export async function getPaymentHistory(params?: {
  limit?: number;
  offset?: number;
  status_filter?: string;
}): Promise<PaymentHistoryResponse> {
  const response = await apiClient.get("/subscriptions/history", { params });
  return response.data;
}

/**
 * Get detailed information about a specific payment.
 */
export async function getPaymentDetail(
  paymentId: number
): Promise<PaymentDetailResponse> {
  const response = await apiClient.get(`/subscriptions/history/${paymentId}`);
  return response.data;
}
