"use client";

import { useState, useCallback } from "react";
import {
  Building2,
  Users,
  Phone,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
  Store,
  Scissors,
  ShoppingBag,
  Briefcase,
  Package,
} from "lucide-react";
import { useAdminAuth } from "../layout";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

const BUSINESS_TYPES = [
  {
    value: "bar_restaurant",
    label: "Bar / Restaurant",
    icon: Store,
    desc: "Drinks, food, customer tabs",
  },
  {
    value: "salon_beauty",
    label: "Salon / Beauty",
    icon: Scissors,
    desc: "Hair, nails, beauty services",
  },
  {
    value: "retail_shop",
    label: "Retail / Shop",
    icon: ShoppingBag,
    desc: "Products, inventory, stock",
  },
  {
    value: "services_freelance",
    label: "Services / Freelance",
    icon: Briefcase,
    desc: "Projects, consulting, contracts",
  },
  {
    value: "general",
    label: "General Business",
    icon: Package,
    desc: "Any other business type",
  },
];

interface OnboardResult {
  user_id: number;
  is_new_user: boolean;
  wallet_credited: boolean;
  team_created: boolean;
  invites_sent: number;
  whatsapp_sent: boolean;
  message: string;
}

export default function SMEOnboardPage() {
  const { authFetch } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OnboardResult | null>(null);

  const [form, setForm] = useState({
    phone: "",
    name: "",
    business_name: "",
    business_type: "general",
    staff_emails: [""],
    notes: "",
  });

  const addEmailField = () => {
    if (form.staff_emails.length < 5) {
      setForm({ ...form, staff_emails: [...form.staff_emails, ""] });
    }
  };

  const removeEmailField = (index: number) => {
    setForm({
      ...form,
      staff_emails: form.staff_emails.filter((_, i) => i !== index),
    });
  };

  const updateEmail = (index: number, value: string) => {
    const emails = [...form.staff_emails];
    emails[index] = value;
    setForm({ ...form, staff_emails: emails });
  };

  const handleSubmit = useCallback(async () => {
    setError("");
    setResult(null);

    if (!form.phone.trim() || !form.name.trim() || !form.business_name.trim()) {
      setError("Phone, name, and business name are required");
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch(`${API}/admin/sme-onboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          staff_emails: form.staff_emails.filter((e) => e.trim()),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Failed to onboard");
        return;
      }
      const data: OnboardResult = await res.json();
      setResult(data);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [authFetch, form]);

  const resetForm = () => {
    setForm({
      phone: "",
      name: "",
      business_name: "",
      business_type: "general",
      staff_emails: [""],
      notes: "",
    });
    setResult(null);
    setError("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-emerald-600" />
          SME Onboarding
        </h1>
        <p className="text-slate-500 mt-1">
          Set up a business with a starter wallet, team, and tailored instructions
          — sent directly to their WhatsApp
        </p>
      </div>

      {/* Success Result */}
      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-emerald-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900">
                Business onboarded successfully!
              </h3>
              <p className="text-sm text-emerald-700 mt-1">{result.message}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-slate-500">User ID</p>
                  <p className="font-medium text-slate-900">{result.user_id}</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-slate-500">New User</p>
                  <p className="font-medium text-slate-900">
                    {result.is_new_user ? "Yes" : "Existing"}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-slate-500">Invites Sent</p>
                  <p className="font-medium text-slate-900">
                    {result.invites_sent}
                  </p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-xs text-slate-500">WhatsApp</p>
                  <p className="font-medium text-slate-900">
                    {result.whatsapp_sent ? "✓ Sent" : "✗ Failed"}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
              >
                Onboard Another Business
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {!result && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Business Owner Info */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="h-5 w-5 text-slate-400" />
              Business Owner
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  WhatsApp Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="08012345678"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Owner Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Chidi Okafor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) =>
                    setForm({ ...form, business_name: e.target.value })
                  }
                  placeholder="e.g. Chidi's Bar & Lounge"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Business Type */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Store className="h-5 w-5 text-slate-400" />
              Business Type
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {BUSINESS_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() =>
                    setForm({ ...form, business_type: type.value })
                  }
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.business_type === type.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <type.icon
                    className={`h-6 w-6 ${
                      form.business_type === type.value
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      form.business_type === type.value
                        ? "text-emerald-900"
                        : "text-slate-700"
                    }`}
                  >
                    {type.label}
                  </span>
                  <span className="text-xs text-slate-400">{type.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-400" />
              Team Members
              <span className="text-xs text-slate-400 font-normal">
                (optional — invite staff via email)
              </span>
            </h2>
            <div className="space-y-2">
              {form.staff_emails.map((email, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(i, e.target.value)}
                      placeholder={`Staff member ${i + 1} email`}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  {form.staff_emails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(i)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {form.staff_emails.length < 5 && (
                <button
                  onClick={addEmailField}
                  className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add staff member
                </button>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Internal Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Met at Lagos Business Fair, has 5 staff, needs inventory setup..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* What will happen */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">
              What happens when you click &ldquo;Onboard&rdquo;:
            </h3>
            <ul className="text-sm text-slate-500 space-y-1">
              <li>
                ✓ Account created (or found if phone exists) — all features are free
              </li>
              <li>✓ Starter wallet balance (₦500) credited to get started</li>
              {form.staff_emails.filter((e) => e.trim()).length > 0 && (
                <li>
                  ✓ Team created +{" "}
                  {form.staff_emails.filter((e) => e.trim()).length} invite(s)
                  sent
                </li>
              )}
              <li>
                ✓ Tailored WhatsApp guide sent (
                {
                  BUSINESS_TYPES.find((t) => t.value === form.business_type)
                    ?.label
                }
                )
              </li>
            </ul>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Onboarding...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Onboard Business
              </>
            )}
          </button>
        </div>
      )}

      {/* USP Reference Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">
          SuoOps Value Proposition for SMEs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium text-blue-900">📱 WhatsApp Invoicing</p>
            <p className="text-blue-700 mt-1">
              Staff create invoices from WhatsApp — no app needed, no training
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium text-green-900">👥 Team Accounts</p>
            <p className="text-green-700 mt-1">
              Up to 3 staff members, each with own login. See who did what
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="font-medium text-amber-900">💰 Payment Tracking</p>
            <p className="text-amber-700 mt-1">
              Know who owes you. Auto-reminders chase payments for you
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="font-medium text-purple-900">📦 Inventory</p>
            <p className="text-purple-700 mt-1">
              Track stock levels, get low-stock alerts, manage suppliers
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg">
            <p className="font-medium text-rose-900">📊 Business Reports</p>
            <p className="text-rose-700 mt-1">
              Revenue dashboards, customer insights, tax reports — all
              automatic
            </p>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg">
            <p className="font-medium text-teal-900">🧾 Professional PDFs</p>
            <p className="text-teal-700 mt-1">
              Branded invoices with logo, sent to customers instantly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
