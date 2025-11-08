"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

interface TaxProfile {
  business_size: string;
  annual_turnover: number;
  fixed_assets: number;
  tax_rates: { CIT: number; CGT: number; DEV_LEVY: number; VAT: number };
  vat_number: string | null;
  tin: string | null;
}

interface ComplianceSummary {
  compliance_score: number;
  requirements: { tin_registered: boolean; vat_registered: boolean };
  business_size: string;
}

interface MonthlyReport {
  year: number;
  month: number;
  assessable_profit: number;
  levy_amount: number;
  vat_collected: number;
  taxable_sales: number;
  zero_rated_sales: number;
  exempt_sales: number;
  pdf_url: string | null;
  basis: string;
}

export default function TaxPage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ annual_turnover: "", fixed_assets: "", tin: "", vat_number: "" });
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth() || 12);
  const [reportYear, setReportYear] = useState(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
  const [basis, setBasis] = useState<"paid" | "all">("paid");

  const { data: profile, isLoading } = useQuery<TaxProfile>({
    queryKey: ["taxProfile"],
    queryFn: async () => (await apiClient.get("/tax/profile")).data,
  });

  const { data: compliance } = useQuery<ComplianceSummary>({
    queryKey: ["taxCompliance"],
    queryFn: async () => (await apiClient.get("/tax/compliance")).data,
  });

  const { data: report, isFetching: reportLoading } = useQuery<MonthlyReport>({
    queryKey: ["monthlyTaxReport", reportYear, reportMonth, basis],
    queryFn: async () => (await apiClient.post(`/tax/reports/generate`, null, { params: { year: reportYear, month: reportMonth, basis } })).data,
    refetchOnWindowFocus: false,
  });

  const updateProfile = useMutation({
    mutationFn: async (data: Partial<TaxProfile>) => (await apiClient.put("/tax/profile", data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxProfile"] });
      queryClient.invalidateQueries({ queryKey: ["taxCompliance"] });
      setEditMode(false);
    },
  });

  const handleSave = () => {
    const data: Partial<TaxProfile> = {};
    if (formData.annual_turnover) data.annual_turnover = Number(formData.annual_turnover);
    if (formData.fixed_assets) data.fixed_assets = Number(formData.fixed_assets);
    if (formData.tin) data.tin = formData.tin;
    if (formData.vat_number) data.vat_number = formData.vat_number;
    updateProfile.mutate(data);
  };

  const handleDownload = async () => {
    if (!report) return;
    const res = await apiClient.get(`/tax/reports/${reportYear}/${reportMonth}/download`);
    if (res.data.pdf_url) window.open(res.data.pdf_url, "_blank");
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tax Compliance</h1>
          <p className="mt-1 text-slate-600">Monitor obligations and reports</p>
        </div>

        {/* Stats */}
        {compliance && (
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <StatCard
              label="Compliance Score"
              value={`${compliance.compliance_score}%`}
              icon="📊"
              className={compliance.compliance_score === 100 ? "border-green-200 bg-green-50" : ""}
            />
            <StatCard
              label="Business Size"
              value={compliance.business_size.toUpperCase()}
              icon="🏢"
            />
            <StatCard
              label="Registration"
              value={compliance.requirements.tin_registered && compliance.requirements.vat_registered ? "Complete" : "Pending"}
              icon={compliance.requirements.tin_registered && compliance.requirements.vat_registered ? "✅" : "⚠️"}
              className={compliance.requirements.tin_registered && compliance.requirements.vat_registered ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}
            />
          </div>
        )}

        {/* Monthly Report */}
        <Card className="mb-6">
          <CardHeader className="border-b border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Monthly Report</h2>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString("default", { month: "short" })}
                    </option>
                  ))}
                </select>
                <select
                  value={reportYear}
                  onChange={(e) => setReportYear(Number(e.target.value))}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  {[reportYear - 1, reportYear, reportYear + 1].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <div className="flex overflow-hidden rounded-lg border border-slate-300">
                  {(["paid", "all"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBasis(opt)}
                      className={`px-3 py-1.5 text-xs font-medium ${basis === opt ? "bg-brand-primary text-white" : "bg-white text-slate-600"}`}
                    >
                      {opt === "paid" ? "Paid" : "All"}
                    </button>
                  ))}
                </div>
                <Button size="sm" onClick={handleDownload} disabled={reportLoading}>
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {reportLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-brand-primary" />
              </div>
            ) : report ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Profit</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.assessable_profit.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Levy</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.levy_amount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">VAT</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.vat_collected.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Taxable</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.taxable_sales.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Zero-rated</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.zero_rated_sales.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Exempt</p>
                  <p className="mt-1 text-2xl font-bold">₦{report.exempt_sales.toLocaleString()}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Profile */}
        <Card>
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
              {!editMode ? (
                <Button onClick={() => setEditMode(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button onClick={handleSave} disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Annual Turnover</label>
                {editMode ? (
                  <input
                    type="number"
                    value={formData.annual_turnover}
                    onChange={(e) => setFormData({ ...formData, annual_turnover: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-lg font-semibold">{fmt(profile?.annual_turnover || 0)}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Fixed Assets</label>
                {editMode ? (
                  <input
                    type="number"
                    value={formData.fixed_assets}
                    onChange={(e) => setFormData({ ...formData, fixed_assets: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-lg font-semibold">{fmt(profile?.fixed_assets || 0)}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">TIN</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.tin}
                    onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                    placeholder={profile?.tin || "Not set"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-lg font-semibold">{profile?.tin || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">VAT Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.vat_number}
                    onChange={(e) => setFormData({ ...formData, vat_number: e.target.value })}
                    placeholder={profile?.vat_number || "Not set"}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                ) : (
                  <p className="text-lg font-semibold">{profile?.vat_number || "Not set"}</p>
                )}
              </div>
            </div>

            {/* Tax Rates */}
            {profile && (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <h3 className="mb-4 text-sm font-medium">Tax Rates</h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(profile.tax_rates).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-slate-50 p-3 text-center">
                      <p className="mb-1 text-xs text-slate-600">{key}</p>
                      <p className="text-2xl font-bold">{value}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
