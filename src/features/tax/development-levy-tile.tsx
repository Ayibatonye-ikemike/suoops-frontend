"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/api/client";
import { toast } from "react-hot-toast";

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
const DEFAULT_PROFIT = 10_000_000; // ₦10M

export function DevelopmentLevyTile() {
  const [data, setData] = useState<LevyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [profit, setProfit] = useState<number>(DEFAULT_PROFIT);

  useEffect(() => {
    let cancelled = false;
    async function fetchLevy() {
      setLoading(true);
      try {
        const res = await apiClient.get<LevyResponse>(`/tax/levy`, { params: { profit } });
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) toast.error("Failed to load levy");
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
          <p className="mt-1 text-sm text-slate-500">2026 readiness – 4% on assessable profits unless small business.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={profit}
            onChange={(e) => setProfit(Number(e.target.value) || 0)}
            className="w-36 rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
            aria-label="Assessable profit"
          />
        </div>
      </div>
      {loading && <p className="mt-4 text-sm text-slate-500">Computing...</p>}
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
    </section>
  );
}
