"use client";

import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/api/client";
import { toast } from "react-hot-toast";
import { TAX_CONFIG } from "@/config/tax";
import { useInvoices } from "@/features/invoices/use-invoices";

interface LevyResponse {
  user_id: number;
  business_size: string;
  is_small_business: boolean;
  assessable_profit: number;
  levy_rate_percent: number;
  levy_applicable: boolean;
  levy_amount: number;
  exemption_reason: string | null;
}

// Simplistic profit placeholder. In future, derive from backend metrics.
// Fallback profit if invoices cannot load
const FALLBACK_PROFIT = 10_000_000; // ₦10M

export function DevelopmentLevyTile() {
  const [data, setData] = useState<LevyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: invoices, isLoading: invoicesLoading, error: invoicesError, refetch: refetchInvoices } = useInvoices();

  // Compute profit as sum of invoice amounts (simplistic assessable profit approximation)
  const computedProfit = useMemo(() => {
    if (!invoices || invoices.length === 0) return FALLBACK_PROFIT;
    return invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  }, [invoices]);

  const [manualProfit, setManualProfit] = useState<number | null>(null);
  const profit = manualProfit !== null ? manualProfit : computedProfit;

  useEffect(() => {
    let cancelled = false;
    async function fetchLevy() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<LevyResponse>(`/tax/levy`, { params: { profit } });
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) {
          setError("Failed to load levy");
          toast.error("Failed to load levy");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchLevy();
    return () => { cancelled = true; };
  }, [profit]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Development Levy</h2>
          <p className="mt-1 text-sm text-slate-500">2026 readiness – {Math.round(TAX_CONFIG.DEVELOPMENT_LEVY_RATE * 100)}% on assessable profits unless small business.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={profit}
            onChange={(e) => setManualProfit(Number(e.target.value) || 0)}
            className="w-36 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            aria-label="Assessable profit"
          />
        </div>
      </div>
      {loading && (
        <div className="mt-4 animate-pulse space-y-3">
          <div className="h-4 w-48 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
        </div>
      )}
      {error && !loading && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setManualProfit(null); // recompute
              setError(null);
            }}
            className="rounded-md bg-rose-600 px-2 py-1 text-xs font-semibold text-white hover:bg-rose-700"
          >Retry</button>
        </div>
      )}
      {!loading && data && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Business Size</p>
            <p className="text-sm font-semibold text-slate-900">{data.business_size}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Levy Rate</p>
            <p className="text-sm font-semibold text-slate-900">{data.levy_rate_percent.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Amount</p>
            <p className="text-sm font-semibold text-slate-900">₦{data.levy_amount.toLocaleString()}</p>
          </div>
          {data.exemption_reason && (
            <div className="col-span-full rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
              Exempt as small business – rate 0%
            </div>
          )}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span>Profit source: {manualProfit !== null ? "Manual override" : invoicesLoading ? "Loading invoices" : invoicesError ? "Fallback (static)" : "Sum of invoices"}</span>
        {invoicesError && (
          <button
            type="button"
            onClick={() => refetchInvoices()}
            className="rounded bg-slate-800 px-2 py-1 text-white hover:bg-slate-700"
          >Retry Invoices</button>
        )}
      </div>
    </section>
  );
}
