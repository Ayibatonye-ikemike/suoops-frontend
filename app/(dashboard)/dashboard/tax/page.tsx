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
  id: number;
  period_type: "day" | "week" | "month" | "year";
  period_label: string;
  start_date: string | null;
  end_date: string | null;
  year: number;
  month: number | null;
  assessable_profit: number;
  levy_amount: number;
  pit_amount: number;
  vat_collected: number;
  taxable_sales: number;
  zero_rated_sales: number;
  exempt_sales: number;
  pdf_url: string | null;
  basis: string;
  user_plan: string;  // free, starter, pro, business
  is_vat_eligible: boolean;  // PRO and BUSINESS plans
  pit_band_info: string;  // e.g., "15% band (₦800K-₦3M)"
  alerts: Array<{
    type: string;
    severity: "info" | "warning" | "error";
    message: string;
  }>;
  annual_revenue_estimate: number;
}

export default function TaxPage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ annual_turnover: "", fixed_assets: "", tin: "", vat_number: "" });
  const now = new Date();
  
  // Period type state
  const [periodType, setPeriodType] = useState<"day" | "week" | "month" | "year">("month");
  const [reportMonth, setReportMonth] = useState(now.getMonth() || 12);
  const [reportYear, setReportYear] = useState(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
  const [reportDay, setReportDay] = useState(1);
  const [reportWeek, setReportWeek] = useState(1);
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
    queryKey: ["taxReport", periodType, reportYear, reportMonth, reportDay, reportWeek, basis],
    queryFn: async () => {
      const params: any = { period_type: periodType, year: reportYear, basis, force: true };
      if (periodType === "month") {
        params.month = reportMonth;
      } else if (periodType === "day") {
        params.month = reportMonth;
        params.day = reportDay;
      } else if (periodType === "week") {
        params.week = reportWeek;
      }
      // year period only needs year parameter
      return (await apiClient.post(`/tax/reports/generate`, null, { params })).data;
    },
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
    if (!report || !report.id) return;
    const res = await apiClient.get(`/tax/reports/${report.id}/download`);
    if (res.data.pdf_url) window.open(res.data.pdf_url, "_blank");
  };

  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-7xl px-6 py-10 text-brand-text">
        <div className="mb-10">
          <h1>Tax Compliance</h1>
          <p className="mt-1 text-sm text-brand-textMuted">Monitor obligations and reports</p>
        </div>

        {compliance && (
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <StatCard label="Compliance Score" value={`${compliance.compliance_score}%`} icon="📊" />
            <StatCard label="Business Size" value={compliance.business_size.toUpperCase()} icon="🏢" />
            <StatCard
              label="Registration"
              value={compliance.requirements.tin_registered && compliance.requirements.vat_registered ? "Complete" : "Pending"}
              icon={compliance.requirements.tin_registered && compliance.requirements.vat_registered ? "✅" : "⚠️"}
            />
          </div>
        )}

        <Card className="mb-8">
          <CardHeader className="border-b border-brand-border/60">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[22px] font-semibold text-brand-text">Tax Report - {report?.period_label}</h2>
              <div className="flex flex-wrap items-center gap-2">
                {/* Period Type Selector */}
                <select
                  value={periodType}
                  onChange={(e) => setPeriodType(e.target.value as any)}
                  className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="day">Daily</option>
                  <option value="week">Weekly</option>
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>

                {/* Year Selector (for all period types) */}
                <select
                  value={reportYear}
                  onChange={(e) => setReportYear(Number(e.target.value))}
                  className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                >
                  {[reportYear - 1, reportYear, reportYear + 1].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                {/* Month Selector (for month and day periods) */}
                {(periodType === "month" || periodType === "day") && (
                  <select
                    value={reportMonth}
                    onChange={(e) => setReportMonth(Number(e.target.value))}
                    className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString("default", { month: "short" })}
                      </option>
                    ))}
                  </select>
                )}

                {/* Day Selector (for day period) */}
                {periodType === "day" && (
                  <select
                    value={reportDay}
                    onChange={(e) => setReportDay(Number(e.target.value))}
                    className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                )}

                {/* Week Selector (for week period) */}
                {periodType === "week" && (
                  <select
                    value={reportWeek}
                    onChange={(e) => setReportWeek(Number(e.target.value))}
                    className="rounded-lg border border-brand-border bg-white px-3 py-1.5 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                  >
                    {Array.from({ length: 53 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Week {i + 1}</option>
                    ))}
                  </select>
                )}

                {/* Basis Selector */}
                <div className="flex overflow-hidden rounded-lg border border-brand-border">
                  {(["paid", "all"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setBasis(opt)}
                      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                        basis === opt ? "bg-brand-primary text-white" : "bg-white text-brand-text"
                      }`}
                    >
                      {opt === "paid" ? "Paid" : "All"}
                    </button>
                  ))}
                </div>
                <Button size="sm" onClick={handleDownload} disabled={reportLoading || !report?.pdf_url}>
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {reportLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-border border-t-brand-primary" />
              </div>
            ) : report ? (
              <>
                {/* Plan-specific alerts */}
                {report.alerts && report.alerts.length > 0 && (
                  <div className="mb-6 space-y-3">
                    {report.alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg border p-4 ${
                          alert.severity === "warning"
                            ? "border-yellow-300 bg-yellow-50"
                            : alert.severity === "error"
                            ? "border-red-300 bg-red-50"
                            : "border-blue-300 bg-blue-50"
                        }`}
                      >
                        <p className={`text-sm ${
                          alert.severity === "warning"
                            ? "text-yellow-800"
                            : alert.severity === "error"
                            ? "text-red-800"
                            : "text-blue-800"
                        }`}>
                          {alert.severity === "warning" ? "⚠️ " : alert.severity === "error" ? "❌ " : "ℹ️ "}
                          {alert.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* PIT Band Information */}
                {report.pit_band_info && (
                  <div className="mb-6 rounded-lg border border-brand-border bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      <strong>Tax Band:</strong> {report.pit_band_info}
                    </p>
                    {report.user_plan === "free" && (
                      <p className="mt-2 text-xs text-gray-600">
                        💡 <strong>Free Plan:</strong> Basic income/expense summary. Upgrade to <strong>Starter</strong> for automated PIT calculations and VAT alerts.
                      </p>
                    )}
                    {report.user_plan === "starter" && (
                      <p className="mt-2 text-xs text-gray-600">
                        🚀 <strong>Starter Plan:</strong> Automated PIT calculation with expense deductions. Upgrade to <strong>Pro</strong> for VAT tracking and custom branding.
                      </p>
                    )}
                    {report.user_plan === "pro" && (
                      <p className="mt-2 text-xs text-gray-600">
                        ⭐ <strong>Pro Plan:</strong> PIT + VAT hybrid reporting. Upgrade to <strong>Business</strong> for CIT/VAT e-invoice compliant reports and API access.
                      </p>
                    )}
                    {report.user_plan === "business" && (
                      <p className="mt-2 text-xs text-gray-600">
                        💼 <strong>Business Plan:</strong> Full CIT + VAT e-invoice compliant reports, ready for FIRS filing.
                      </p>
                    )}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* PIT fields - always shown for all plans */}
                  {[
                    { label: "Profit", value: report.assessable_profit },
                    { label: "Income Tax (PIT)", value: report.pit_amount },
                    { label: "Levy", value: report.levy_amount },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-brand-border bg-brand-background p-4">
                      <p className="text-sm font-medium text-brand-textMuted">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-brand-primary">₦{(item.value || 0).toLocaleString()}</p>
                    </div>
                  ))}
                  
                  {/* VAT fields - only shown for PRO and BUSINESS plans */}
                  {report.is_vat_eligible && [
                    { label: "VAT", value: report.vat_collected },
                    { label: "Taxable", value: report.taxable_sales },
                    { label: "Zero-rated", value: report.zero_rated_sales },
                    { label: "Exempt", value: report.exempt_sales },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-brand-border bg-brand-background p-4">
                      <p className="text-sm font-medium text-brand-textMuted">{item.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-brand-primary">₦{(item.value || 0).toLocaleString()}</p>
                    </div>
                  ))}
                  
                  {/* Show upgrade message for FREE and STARTER users */}
                  {!report.is_vat_eligible && (
                    <div className="col-span-full rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm text-blue-800">
                        <strong>💼 VAT Tracking:</strong> Upgrade to <strong>{report.user_plan === "free" ? "STARTER" : "PRO"}</strong> plan to {report.user_plan === "free" ? "get automated tax reports and " : ""}track VAT, taxable sales, and zero-rated/exempt transactions.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {/* Tax Profile - BUSINESS Plan Only */}
        {report?.user_plan === "business" && (
          <Card>
            <CardHeader className="border-b border-brand-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold text-brand-text">Tax Profile</h2>
                  <p className="mt-1 text-sm text-brand-textMuted">CIT/VAT registration details for FIRS compliance</p>
                </div>
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
                {[{
                  label: "Annual Turnover",
                  key: "annual_turnover",
                  value: formData.annual_turnover,
                  display: fmt(profile?.annual_turnover || 0),
                }, {
                  label: "Fixed Assets",
                  key: "fixed_assets",
                  value: formData.fixed_assets,
                  display: fmt(profile?.fixed_assets || 0),
                }, {
                  label: "TIN",
                  key: "tin",
                  value: formData.tin,
                  display: profile?.tin || "Not set",
                }, {
                  label: "VAT Number",
                  key: "vat_number",
                  value: formData.vat_number,
                  display: profile?.vat_number || "Not set",
                }].map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-semibold text-brand-textMuted uppercase tracking-wide">{field.label}</label>
                    {editMode ? (
                      <input
                        type={field.key === "tin" || field.key === "vat_number" ? "text" : "number"}
                        value={field.value}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.display}
                        className="w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                      />
                    ) : (
                      <p className="text-lg font-semibold text-brand-text">{field.display}</p>
                    )}
                  </div>
                ))}
              </div>

              {profile && (
                <div className="mt-6 border-t border-brand-border/60 pt-6">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-textMuted">Tax Rates</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {Object.entries(profile.tax_rates).map(([key, value]) => (
                      <div key={key} className="rounded-xl border border-brand-border bg-brand-background p-3 text-center">
                        <p className="mb-1 text-xs uppercase tracking-wide text-brand-textMuted">{key}</p>
                        <p className="text-2xl font-semibold text-brand-primary">{value}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
