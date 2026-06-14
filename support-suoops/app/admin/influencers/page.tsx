"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Copy,
  Check,
  Users,
  TrendingUp,
  DollarSign,
  Link2,
  Edit,
  Megaphone,
  ExternalLink,
  Banknote,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface Influencer {
  id: number;
  code: string;
  custom_slug: string | null;
  influencer_name: string | null;
  influencer_contact: string | null;
  commission_first: number;
  commission_recurring: number;
  commission_months: number;
  commission_perpetual_pct: number;
  bonus_invoices: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  total_signups: number;
  activated_users: number;
  pro_conversions: number;
  total_commission_earned: number;
  signup_link: string;
}

interface PayoutUser {
  user_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  payout_bank_name: string | null;
  payout_account_number: string | null;
  payout_account_name: string | null;
  paid_referrals: number;
  commission_amount: number;
  has_bank_details: boolean;
}

interface PayoutListResponse {
  total_users: number;
  total_amount: number;
  users_with_bank: number;
  users_without_bank: number;
  payouts: PayoutUser[];
}

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

export default function InfluencersPage() {
  const { authFetch } = useAdminAuth();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"partnerships" | "payouts">("partnerships");
  const [payouts, setPayouts] = useState<PayoutListResponse | null>(null);
  const [payoutsLoading, setPayoutsLoading] = useState(false);
  const [payoutMonth, setPayoutMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  // Form state
  const [form, setForm] = useState({
    user_phone: "",
    user_email: "",
    influencer_name: "",
    influencer_contact: "",
    custom_slug: "",
    commission_first: 500,
    commission_recurring: 200,
    commission_months: 2,
    commission_perpetual_pct: 5,
    bonus_invoices: 3,
    notes: "",
  });

  const fetchInfluencers = useCallback(async () => {
    try {
      const res = await authFetch(`${API}/admin/influencers`);
      if (res.ok) {
        const data = await res.json();
        setInfluencers(data.influencers);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  const fetchPayouts = useCallback(async () => {
    setPayoutsLoading(true);
    try {
      const res = await authFetch(
        `${API}/admin/referrals/payouts?month=${payoutMonth.month}&year=${payoutMonth.year}`
      );
      if (res.ok) {
        const data = await res.json();
        setPayouts(data);
      }
    } catch {
      // silent
    } finally {
      setPayoutsLoading(false);
    }
  }, [authFetch, payoutMonth]);

  useEffect(() => {
    fetchInfluencers();
  }, [fetchInfluencers]);

  useEffect(() => {
    if (tab === "payouts") fetchPayouts();
  }, [tab, fetchPayouts]);

  const handleCreate = async () => {
    setError("");
    if (!form.influencer_name.trim() || !form.custom_slug.trim()) {
      setError("Name and slug are required");
      return;
    }
    if (!form.user_phone.trim() && !form.user_email.trim()) {
      setError("Provide the influencer's phone or email so we can link their account");
      return;
    }
    try {
      const res = await authFetch(`${API}/admin/influencers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          custom_slug: form.custom_slug.toLowerCase().trim(),
          user_phone: form.user_phone.trim() || null,
          user_email: form.user_email.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to create");
        return;
      }
      setShowCreate(false);
      setForm({
        user_phone: "",
        user_email: "",
        influencer_name: "",
        influencer_contact: "",
        custom_slug: "",
        commission_first: 500,
        commission_recurring: 200,
        commission_months: 2,
        commission_perpetual_pct: 5,
        bonus_invoices: 3,
        notes: "",
      });
      fetchInfluencers();
    } catch {
      setError("Network error");
    }
  };

  const handleUpdate = async (id: number) => {
    setError("");
    try {
      const res = await authFetch(`${API}/admin/influencers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to update");
        return;
      }
      setEditId(null);
      fetchInfluencers();
    } catch {
      setError("Network error");
    }
  };

  const copyLink = (inf: Influencer) => {
    navigator.clipboard.writeText(inf.signup_link);
    setCopiedId(inf.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (inf: Influencer) => {
    setForm({
      user_phone: "",
      user_email: "",
      influencer_name: inf.influencer_name || "",
      influencer_contact: inf.influencer_contact || "",
      custom_slug: inf.custom_slug || "",
      commission_first: inf.commission_first,
      commission_recurring: inf.commission_recurring,
      commission_months: inf.commission_months,
      commission_perpetual_pct: inf.commission_perpetual_pct,
      bonus_invoices: inf.bonus_invoices,
      notes: inf.notes || "",
    });
    setEditId(inf.id);
    setShowCreate(false);
  };

  // Summary stats
  const totalSignups = influencers.reduce((s, i) => s + i.total_signups, 0);
  const totalActivated = influencers.reduce((s, i) => s + i.activated_users, 0);
  const totalPro = influencers.reduce((s, i) => s + i.pro_conversions, 0);
  const totalCommission = influencers.reduce(
    (s, i) => s + i.total_commission_earned,
    0
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-emerald-600" />
            Influencer Program
          </h1>
          <p className="text-slate-500 mt-1">
            Manage affiliate partnerships and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("partnerships")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "partnerships"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Partnerships
          </button>
          <button
            onClick={() => setTab("payouts")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              tab === "payouts"
                ? "bg-amber-100 text-amber-800"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Banknote className="h-4 w-4" />
            Payouts
          </button>
        </div>
        <button
          onClick={() => {
            setShowCreate(!showCreate);
            setEditId(null);
            setError("");
            setForm({
              user_phone: "",
              user_email: "",
              influencer_name: "",
              influencer_contact: "",
              custom_slug: "",
              commission_first: 500,
              commission_recurring: 200,
              commission_months: 2,
              commission_perpetual_pct: 5,
              bonus_invoices: 3,
              notes: "",
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Partnership
        </button>
      </div>

      {/* Payouts Tab */}
      {tab === "payouts" && (
        <div className="space-y-4">
          {/* Month Picker */}
          <div className="flex items-center gap-3">
            <select
              value={payoutMonth.month}
              onChange={(e) =>
                setPayoutMonth((p) => ({ ...p, month: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ].map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={payoutMonth.year}
              onChange={(e) =>
                setPayoutMonth((p) => ({ ...p, year: parseInt(e.target.value) }))
              }
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {[2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={fetchPayouts}
              className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm hover:bg-slate-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          {payoutsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                ))}
              </div>
              <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
          ) : payouts ? (
            <>
              {/* Payout Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Total to Pay</p>
                  <p className="text-2xl font-bold text-amber-600 mt-1">
                    ₦{payouts.total_amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">{payouts.total_users} users</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Bank Details Set
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{payouts.users_with_bank}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-sm text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    Missing Bank Details
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{payouts.users_without_bank}</p>
                </div>
              </div>

              {/* Payouts Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Name</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Contact</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Bank</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Account</th>
                        <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">Referrals</th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.payouts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                            No payouts due for this period.
                          </td>
                        </tr>
                      ) : (
                        payouts.payouts.map((p) => (
                          <tr key={p.user_id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <p className="font-medium text-slate-900">{p.name}</p>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-slate-600">{p.email || p.phone || "—"}</p>
                            </td>
                            <td className="px-4 py-3">
                              {p.has_bank_details ? (
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{p.payout_bank_name}</p>
                                  <p className="text-xs text-slate-400">{p.payout_account_name}</p>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-red-500 font-medium">
                                  <AlertTriangle className="h-3 w-3" />
                                  Not set
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {p.has_bank_details ? (
                                <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-800">
                                  {p.payout_account_number}
                                </code>
                              ) : (
                                <span className="text-sm text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-slate-900">
                              {p.paid_referrals}
                            </td>
                            <td className="px-4 py-3 text-right font-bold text-amber-600">
                              ₦{p.commission_amount.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {tab === "partnerships" && <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Users className="h-4 w-4" />
            Total Signups
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalSignups}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <TrendingUp className="h-4 w-4" />
            Activated
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalActivated}
          </p>
          <p className="text-xs text-slate-400">
            {totalSignups > 0
              ? `${((totalActivated / totalSignups) * 100).toFixed(1)}% rate`
              : "—"}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <DollarSign className="h-4 w-4" />
            Pro Conversions
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {totalPro}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <DollarSign className="h-4 w-4" />
            Commission Owed
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            ₦{totalCommission.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Create / Edit Form */}
      {(showCreate || editId !== null) && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            {editId ? "Edit Partnership" : "Create New Partnership"}
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User lookup fields — only shown when creating */}
            {!editId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    User Phone *
                  </label>
                  <input
                    type="text"
                    value={form.user_phone}
                    onChange={(e) =>
                      setForm({ ...form, user_phone: e.target.value })
                    }
                    placeholder="e.g. 08012345678 or +2348012345678"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    The influencer must have an existing Suoops account
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Or User Email
                  </label>
                  <input
                    type="email"
                    value={form.user_email}
                    onChange={(e) =>
                      setForm({ ...form, user_email: e.target.value })
                    }
                    placeholder="e.g. coach@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Fallback if phone not provided
                  </p>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Influencer Name *
              </label>
              <input
                type="text"
                value={form.influencer_name}
                onChange={(e) =>
                  setForm({ ...form, influencer_name: e.target.value })
                }
                placeholder="e.g. Coach Ade"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact (social handle / phone)
              </label>
              <input
                type="text"
                value={form.influencer_contact}
                onChange={(e) =>
                  setForm({ ...form, influencer_contact: e.target.value })
                }
                placeholder="e.g. @coachade on Instagram"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Vanity Slug * (suoops.com/join/
                <span className="text-emerald-600">slug</span>)
              </label>
              <input
                type="text"
                value={form.custom_slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    custom_slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, ""),
                  })
                }
                placeholder="e.g. coachade"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {form.custom_slug && (
                <p className="text-xs text-slate-400 mt-1">
                  Link: suoops.com/join/{form.custom_slug}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bonus Free Invoices for Signups
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={form.bonus_invoices}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bonus_invoices: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Extra invoices on top of the default 2
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Purchase Commission (₦)
              </label>
              <input
                type="number"
                min={0}
                value={form.commission_first}
                onChange={(e) =>
                  setForm({
                    ...form,
                    commission_first: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Recurring Commission (₦ / month)
              </label>
              <input
                type="number"
                min={0}
                value={form.commission_recurring}
                onChange={(e) =>
                  setForm({
                    ...form,
                    commission_recurring: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Recurring Months
              </label>
              <input
                type="number"
                min={0}
                max={12}
                value={form.commission_months}
                onChange={(e) =>
                  setForm({
                    ...form,
                    commission_months: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Purchases after first (e.g. 2 = purchases 2–3)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Perpetual Commission (%)
              </label>
              <input
                type="number"
                min={0}
                max={25}
                value={form.commission_perpetual_pct}
                onChange={(e) =>
                  setForm({
                    ...form,
                    commission_perpetual_pct: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                % on every purchase after recurring window (forever)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Notes
              </label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Internal notes..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              <strong>Commission structure:</strong> ₦
              {form.commission_first.toLocaleString()} on first purchase → ₦
              {form.commission_recurring.toLocaleString()}/purchase for{" "}
              {form.commission_months} purchases → then{" "}
              {form.commission_perpetual_pct}% on every purchase forever
            </p>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => (editId ? handleUpdate(editId) : handleCreate())}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {editId ? "Save Changes" : "Create Partnership"}
            </button>
            <button
              onClick={() => {
                setShowCreate(false);
                setEditId(null);
                setError("");
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Influencers Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">
                  Influencer
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">
                  Link
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">
                  Signups
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">
                  Activated
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">
                  Pro
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-600">
                  Commission
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">
                  Perk
                </th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {influencers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No influencer partnerships yet. Create one to get started.
                  </td>
                </tr>
              ) : (
                influencers.map((inf) => (
                  <tr
                    key={inf.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">
                          {inf.influencer_name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {inf.influencer_contact || "—"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-slate-100 px-2 py-1 rounded text-emerald-700">
                          /join/{inf.custom_slug}
                        </code>
                        <button
                          onClick={() => copyLink(inf)}
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Copy link"
                        >
                          {copiedId === inf.id ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-slate-900">
                      {inf.total_signups}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-medium text-slate-900">
                        {inf.activated_users}
                      </span>
                      {inf.total_signups > 0 && (
                        <span className="text-xs text-slate-400 ml-1">
                          (
                          {(
                            (inf.activated_users / inf.total_signups) *
                            100
                          ).toFixed(0)}
                          %)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-emerald-600">
                      {inf.pro_conversions}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-amber-600">
                      ₦{inf.total_commission_earned.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                        +{inf.bonus_invoices} invoices
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => startEdit(inf)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <a
                          href={inf.signup_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="Open link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Structure Info */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-2">
          Default Commission Structure
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500">First Purchase</p>
            <p className="font-medium text-slate-900">₦500 (25%)</p>
          </div>
          <div>
            <p className="text-slate-500">Purchases 2–3</p>
            <p className="font-medium text-slate-900">₦200 each (10%)</p>
          </div>
          <div>
            <p className="text-slate-500">Purchase 4+</p>
            <p className="font-medium text-slate-900">5% forever</p>
          </div>
          <div>
            <p className="text-slate-500">Applies to</p>
            <p className="font-medium text-slate-900">Pro Packs + Invoice Packs</p>
          </div>
        </div>
      </div>
      </>}
    </div>
  );
}
