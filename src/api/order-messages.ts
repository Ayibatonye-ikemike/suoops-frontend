import { apiClient } from "./client";

export interface OrderMessage {
  id: number;
  sender_role: "buyer" | "seller" | "system";
  mine: boolean;
  body: string;
  flagged: boolean;
  created_at: string | null;
}

export interface SendMessageResult {
  ok?: boolean;
  blocked?: boolean;
  message?: OrderMessage | string;
  warning?: string | null;
}

/** Seller (authenticated) — thread for one of their storefront orders. */
export async function getOrderMessages(invoiceId: string): Promise<OrderMessage[]> {
  const res = await apiClient.get<{ messages: OrderMessage[] }>(
    `/inventory/storefront/orders/${invoiceId}/messages`,
  );
  return res.data.messages ?? [];
}

export async function sendOrderMessage(
  invoiceId: string,
  body: string,
): Promise<SendMessageResult> {
  const res = await apiClient.post<SendMessageResult>(
    `/inventory/storefront/orders/${invoiceId}/messages`,
    { body },
  );
  return res.data;
}
