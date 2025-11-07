"use client";

import { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/api/client";
import { toast } from "react-hot-toast";
import { useInvoices } from "@/features/invoices/use-invoices";
import { useQuery } from "@tanstack/react-query";

interface LevyResponse {
  user_id: number;
  business_size: string;
  is_small_business: boolean;
  assessable_profit: number;
  levy_rate_percent: number;
  levy_applicable: boolean;
  levy_amount: number;
  exemption_reason: string | null;
  period?: string | null;
  source?: string | null;
}

// Simplistic profit placeholder. In future, derive from backend metrics.
// Fallback profit if invoices cannot load
const FALLBACK_PROFIT = 10_000_000; // ₦10M

export function DevelopmentLevyTile() {
  const [data, setData] = useState<LevyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: invoices, isLoading: invoicesLoading, error: invoicesError, refetch: refetchInvoices } = useInvoices();
  const { data: taxConfig } = useQuery({
    queryKey: ["tax-config"],
    queryFn: async () => (await apiClient.get<{ [k: string]: number }>("/tax/config")).data,
    staleTime: 1000 * 60 * 5,
  });

  // Compute profit as sum of invoice amounts (simplistic assessable profit approximation)
  const computedProfit = useMemo(() => {
    if (!invoices || invoices.length === 0) return FALLBACK_PROFIT;
    return invoices.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
  }, [invoices]);

  const [manualProfit, setManualProfit] = useState<number | null>(null);
  const [basis, setBasis] = useState<"paid" | "all">("paid");
  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth() + 1); // JS month 0-based
  const profit = manualProfit !== null ? manualProfit : computedProfit;

  useEffect(() => {
    let cancelled = false;
    async function fetchLevy() {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, number | string> = {};
        if (manualProfit !== null) {
          params.profit = profit;
        } else {
          params.year = year;
          params.month = month;
          params.basis = basis;
        }
        const res = await apiClient.get<LevyResponse>(`/tax/levy`, { params });
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
  }, [profit, manualProfit, year, month, basis]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Development Levy</h2>
          <p className="mt-1 text-sm text-slate-500">2026 readiness – {Math.round((taxConfig?.development_levy_rate ?? 0.04) * 100)}% on assessable profits unless small business.</p>
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
          <div className="flex rounded-md border border-slate-200 overflow-hidden text-xs" role="radiogroup" aria-label="Profit basis">
            {(["paid", "all"] as const).map(opt => {
              const active = basis === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={manualProfit !== null}
                  onClick={() => setBasis(opt)}
                  className={`px-2 py-1 font-medium transition-colors ${active ? "bg-green-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"} ${manualProfit !== null ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >{opt === "paid" ? "Paid" : "All"}</button>
              );
            })}
          </div>
          <select
            value={month}
            onChange={(e) => { setMonth(Number(e.target.value)); setManualProfit(null); }}
            disabled={manualProfit !== null}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Month"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => { setYear(Number(e.target.value)); setManualProfit(null); }}
            disabled={manualProfit !== null}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Year"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
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
        <span>Profit source: {manualProfit !== null ? "Manual override" : data?.source === 'paid_invoices' ? `Paid invoices${data?.period ? ' ' + data.period : ''}` : data?.source === 'all_invoices' ? `All invoices${data?.period ? ' ' + data.period : ''}` : invoicesLoading ? "Loading invoices" : invoicesError ? "Fallback (static)" : "Unknown"}</span>
        {manualProfit !== null && (
          <button
            type="button"
            onClick={() => setManualProfit(null)}
            className="rounded bg-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-300"
          >Use invoices</button>
        )}
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
