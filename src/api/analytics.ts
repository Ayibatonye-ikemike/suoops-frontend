import { apiClient } from "./client";

export interface RevenueMetrics {
  total_revenue: number;
  paid_revenue: number;
  pending_revenue: number;
  overdue_revenue: number;
  growth_rate: number;
  average_invoice_value: number;
}

export interface InvoiceMetrics {
  total_invoices: number;
  paid_invoices: number;
  pending_invoices: number;
  awaiting_confirmation: number;
  failed_invoices: number;
  conversion_rate: number;
}

export interface CustomerMetrics {
  total_customers: number;
  active_customers: number;
  new_customers: number;
  repeat_customer_rate: number;
}

export interface AgingReport {
  current: number;
  days_31_60: number;
  days_61_90: number;
  over_90_days: number;
  total_outstanding: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  invoice_count: number;
}

export interface AnalyticsDashboard {
  period: string;
  currency: string;
  start_date: string;
  end_date: string;
  revenue: RevenueMetrics;
  invoices: InvoiceMetrics;
  customers: CustomerMetrics;
  aging: AgingReport;
  monthly_trends: MonthlyTrend[];
}

export interface TopCustomer {
  name: string;
  total_revenue: number;
  invoice_count: number;
}

export interface ConversionFunnel {
  funnel: {
    created: number;
    sent: number;
    viewed: number;
    awaiting_confirmation: number;
    paid: number;
    failed: number;
  };
  conversion_rates: {
    sent_to_viewed: number;
    viewed_to_paid: number;
    overall: number;
  };
}

export async function getAnalyticsDashboard(
  period: "7d" | "30d" | "90d" | "1y" | "all" = "30d",
  currency: "NGN" | "USD" = "NGN"
): Promise<AnalyticsDashboard> {
  const response = await apiClient.get<AnalyticsDashboard>(
    `/analytics/dashboard?period=${period}&currency=${currency}`
  );
  return response.data;
}

export async function getTopCustomers(
  period: "7d" | "30d" | "90d" | "1y" | "all" = "30d",
  limit: number = 10
): Promise<{ period: string; customers: TopCustomer[] }> {
  const response = await apiClient.get(
    `/analytics/revenue-by-customer?period=${period}&limit=${limit}`
  );
  return response.data;
}

export async function getConversionFunnel(
  period: "7d" | "30d" | "90d" | "1y" | "all" = "30d"
): Promise<{ period: string } & ConversionFunnel> {
  const response = await apiClient.get(
    `/analytics/conversion-funnel?period=${period}`
  );
  return response.data;
}
