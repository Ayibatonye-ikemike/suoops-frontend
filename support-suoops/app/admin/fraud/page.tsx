"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
import {
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Users,
  Fingerprint,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAdminAuth } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

// ─── Types ───────────────────────────────────────────────────────

interface RiskUser {
  id: number;
  name: string;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  signup_source: string | null;
  signup_ip: string | null;
  signup_device_id: string | null;
  signup_user_agent: string | null;
  risk_score: number;
  risk_signals: string[];
  flagged_for_review: boolean;
  store_status: string;
  storefront_slug: string | null;
  linked_account_count: number;
}

interface RiskListResponse {
  users: RiskUser[];
  total: number;
  page: number;
  page_size: number;
  counts: Record<string, number>;
}

interface LinkedAccount {
  id: number;
  name: string;
  business_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  risk_score: number;
  flagged_for_review: boolean;
  store_status: string;
  same_ip: boolean;
  same_device: boolean;
}

type ViewMode = "flagged" | "risky" | "all";

// ─── Helpers ─────────────────────────────────────────────────────

const SIGNAL_LABELS: Record<string, string> = {
  disposable_email: "Disposable email",
  ip_velocity: "IP velocity",
  ip_velocity_high: "IP velocity (high)",
  device_reuse: "Device reuse",
  device_reuse_high: "Device reuse (high)",
  no_device_id: "No device ID",
  no_user_agent: "No user-agent",
  bot_user_agent: "Bot user-agent",
};

function riskColor(score: number): string {
  if (score >= 60) return "text-red-700 bg-red-100";
  if (score >= 40) return "text-orange-700 bg-orange-100";
  if (score >= 20) return "text-amber-700 bg-amber-100";
  return "text-slate-600 bg-slate-100";
}

function signalBadge(sig: string) {
  const critical = sig.includes("high") || sig === "disposable_email";
  return (
    <span key={sig} className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${critical ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
      {SIGNAL_LABELS[sig] || sig}
    </span>
  );
}

// ─── Page ────────────────────────────────────────────────────────

export default function FraudPage() {
  const { token, authFetch } = useAdminAuth();
  const [data, setData] = useState<RiskListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const [view, setView] = useState<ViewMode>("flagged");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const pageSize = 25;

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [linked, setLinked] = useState<Record<number, LinkedAccount[]>>({});

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        view,
      });
      if (search) params.set("search", search);
      const res = await authFetch(`${API}/admin/fraud/flagged?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load risk data");
      setData(await res.json());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setIsLoading(false);
    }
  }, [token, authFetch, page, view, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function toggleLinked(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!linked[id]) {
      try {
        const res = await authFetch(`${API}/admin/fraud/${id}/linked`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const body = await res.json();
          setLinked((prev) => ({ ...prev, [id]: body.linked || [] }));
        }
      } catch {
        /* ignore */
      }
    }
  }

  async function review(id: number, action: "clear" | "flag" | "ban") {
    let reason: string | null = null;
    if (action === "ban") {
      reason = window.prompt("Reason for banning this account (delists their store):", "");
      if (reason === null) return;
    } else if (action === "clear" && !window.confirm("Mark this account as legitimate?")) {
      return;
    }
    setBusyId(id);
    try {
      const res = await authFetch(`${API}/admin/fraud/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action, reason }),
      });
      if (!res.ok) throw new Error("Action failed");
      await fetchData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;
  const counts = data?.counts || {};

  if (error && !data) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Trust &amp; Safety</h1>
        <p className="text-slate-500">Review flagged signups, risk signals &amp; duplicate-account clusters</p>
      </div>

      {/* Summary + view toggle */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        <button onClick={() => { setView("flagged"); setPage(1); }} className={`rounded-lg border p-4 text-left transition-colors ${view === "flagged" ? "border-red-300 bg-red-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2 text-sm text-red-600"><ShieldAlert className="h-4 w-4" />Flagged for review</div>
          <p className="mt-1 text-xl font-bold text-red-700">{counts.flagged ?? 0}</p>
        </button>
        <button onClick={() => { setView("risky"); setPage(1); }} className={`rounded-lg border p-4 text-left transition-colors ${view === "risky" ? "border-orange-300 bg-orange-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2 text-sm text-orange-600"><AlertCircle className="h-4 w-4" />High risk score</div>
          <p className="mt-1 text-xl font-bold text-orange-700">{counts.high_risk ?? 0}</p>
        </button>
        <button onClick={() => { setView("all"); setPage(1); }} className={`rounded-lg border p-4 text-left transition-colors ${view === "all" ? "border-slate-300 bg-slate-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2 text-sm text-slate-600"><Users className="h-4 w-4" />Search all accounts</div>
          <p className="mt-1 text-xl font-bold text-slate-700">{view === "all" ? data?.total ?? 0 : "—"}</p>
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search name, phone, email, IP or device…"
          className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm focus:border-emerald-400 focus:outline-none"
        />
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Signals</th>
              <th className="px-4 py-3">Signup origin</th>
              <th className="px-4 py-3">Linked</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading…</td></tr>}
            {!isLoading && data?.users.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Nothing to review.</td></tr>}
            {!isLoading && data?.users.map((u) => (
              <Fragment key={u.id}>
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{u.business_name || u.name}</div>
                    <div className="text-xs text-slate-400">{u.phone || u.email || "—"}</div>
                    {u.store_status !== "active" && <span className="mt-0.5 inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700">{u.store_status}</span>}
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${riskColor(u.risk_score)}`}>{u.risk_score}</span></td>
                  <td className="px-4 py-3"><div className="flex max-w-[180px] flex-wrap gap-1">{u.risk_signals.length ? u.risk_signals.map(signalBadge) : <span className="text-[10px] text-slate-400">none</span>}</div></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500"><Globe className="h-3 w-3 text-slate-400" />{u.signup_ip || "—"}</div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400"><Fingerprint className="h-3 w-3" />{u.signup_device_id ? `${u.signup_device_id.slice(0, 10)}…` : "—"}</div>
                  </td>
                  <td className="px-4 py-3">
                    {u.linked_account_count > 0 ? (
                      <button onClick={() => toggleLinked(u.id)} className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 hover:bg-purple-200">
                        <Users className="h-3 w-3" />{u.linked_account_count}
                        {expandedId === u.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    ) : <span className="text-[10px] text-slate-400">0</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {u.flagged_for_review ? (
                        <button disabled={busyId === u.id} onClick={() => review(u.id, "clear")} title="Mark legitimate" className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"><ShieldCheck className="h-4 w-4" /></button>
                      ) : (
                        <button disabled={busyId === u.id} onClick={() => review(u.id, "flag")} title="Flag for review" className="rounded-md p-1.5 text-amber-600 hover:bg-amber-50 disabled:opacity-50"><ShieldAlert className="h-4 w-4" /></button>
                      )}
                      <button disabled={busyId === u.id} onClick={() => review(u.id, "ban")} title="Ban & delist store" className="rounded-md p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"><Ban className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
                {expandedId === u.id && (
                  <tr key={`${u.id}-linked`} className="bg-slate-50">
                    <td colSpan={6} className="px-4 py-3">
                      <p className="mb-2 text-xs font-medium text-slate-500">Accounts sharing this IP / device:</p>
                      {!linked[u.id] ? (
                        <p className="text-xs text-slate-400">Loading…</p>
                      ) : linked[u.id].length === 0 ? (
                        <p className="text-xs text-slate-400">No linked accounts.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {linked[u.id].map((la) => (
                            <div key={la.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs">
                              <div className="font-medium text-slate-800">{la.business_name || la.name}</div>
                              <div className="text-slate-400">{la.phone || la.email || "—"}</div>
                              <div className="mt-1 flex items-center gap-1">
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${riskColor(la.risk_score)}`}>{la.risk_score}</span>
                                {la.same_ip && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">same IP</span>}
                                {la.same_device && <span className="rounded-full bg-purple-100 px-1.5 py-0.5 text-[10px] text-purple-700">same device</span>}
                                {la.flagged_for_review && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] text-red-700">flagged</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {data?.page} of {totalPages} · {data?.total} accounts</p>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
