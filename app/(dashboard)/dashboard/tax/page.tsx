"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";

interface TaxProfile {
  business_size: string;
  is_small_business: boolean;
  annual_turnover: number;
  fixed_assets: number;
  tax_rates: {
    CIT: number;
    CGT: number;
    DEV_LEVY: number;
    VAT: number;
  };
  vat_registered: boolean;
  vat_number: string | null;
  tin: string | null;
}

interface ComplianceSummary {
  compliance_status: string;
  compliance_score: number;
  requirements: {
    tin_registered: boolean;
    vat_registered: boolean;
  };
  next_actions: string[];
  business_size: string;
  small_business_benefits: boolean;
}

interface SmallBusinessEligibility {
  eligible: boolean;
  business_size: string;
  current_turnover: number;
  turnover_limit: number;
  turnover_remaining: number;
  current_assets: number;
  assets_limit: number;
  benefits: string[];
  approaching_limit: boolean;
}

interface MonthlyReportSummary {
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

export default function TaxCompliancePage() {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    annual_turnover: "",
    fixed_assets: "",
    tin: "",
    vat_registration_number: "",
  });
  const now = new Date();
  const [reportMonth, setReportMonth] = useState<number>(now.getMonth() || (now.getMonth() === 0 ? 12 : now.getMonth()));
  const [reportYear, setReportYear] = useState<number>(now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear());
  const [basis, setBasis] = useState<"paid" | "all">("paid");

  // Fetch tax profile
  const { data: profile, isLoading: profileLoading } = useQuery<TaxProfile>({
    queryKey: ["taxProfile"],
    queryFn: async () => {
      const response = await apiClient.get("/tax/profile");
      return response.data;
    },
  });

  // Fetch compliance summary
  const { data: compliance } = useQuery<ComplianceSummary>({
    queryKey: ["taxCompliance"],
    queryFn: async () => {
      const response = await apiClient.get("/tax/compliance");
      return response.data;
    },
  });

  // Fetch small business eligibility
  const { data: eligibility } = useQuery<SmallBusinessEligibility>({
    queryKey: ["smallBusinessEligibility"],
    queryFn: async () => {
      const response = await apiClient.get("/tax/small-business-check");
      return response.data;
    },
  });

  // Fetch monthly tax report (on-demand refresh when params change)
  const { data: monthlyReport, isFetching: reportLoading } = useQuery<MonthlyReportSummary>({
    queryKey: ["monthlyTaxReport", reportYear, reportMonth, basis],
    queryFn: async () => {
      const res = await apiClient.post(`/tax/reports/generate`, null, {
        params: { year: reportYear, month: reportMonth, basis },
      });
      return res.data as MonthlyReportSummary;
    },
    refetchOnWindowFocus: false,
  });

  // Update tax profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: Partial<TaxProfile>) => {
      const response = await apiClient.put("/tax/profile", data);
      return response.data as TaxProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxProfile"] });
      queryClient.invalidateQueries({ queryKey: ["taxCompliance"] });
      queryClient.invalidateQueries({ queryKey: ["smallBusinessEligibility"] });
      setEditMode(false);
    },
  });

  const handleSave = () => {
    const data: Partial<TaxProfile> = {};
    if (formData.annual_turnover) {
      const parsedTurnover = Number(formData.annual_turnover);
      if (!Number.isNaN(parsedTurnover)) data.annual_turnover = parsedTurnover;
    }
    if (formData.fixed_assets) {
      const parsedAssets = Number(formData.fixed_assets);
      if (!Number.isNaN(parsedAssets)) data.fixed_assets = parsedAssets;
    }
    if (formData.tin) data.tin = formData.tin;
    if (formData.vat_registration_number) data.vat_number = formData.vat_registration_number;
    updateProfile.mutate(data);
  };

  const handleDownload = async () => {
    if (!monthlyReport) return;
    if (!monthlyReport.pdf_url) {
      // Force regeneration to attach PDF if missing
      await apiClient.post(`/tax/reports/generate`, null, { params: { year: reportYear, month: reportMonth, basis, force: true } });
      await queryClient.invalidateQueries({ queryKey: ["monthlyTaxReport", reportYear, reportMonth, basis] });
    }
    const updated = await apiClient.get(`/tax/reports/${reportYear}/${reportMonth}/download`);
    const url = updated.data.pdf_url;
    if (url) {
      window.open(url, "_blank");
      toast.success("Monthly tax report opened");
    } else {
      toast.error("PDF not available yet. Try regenerating.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getComplianceColor = (score: number) => {
    if (score === 100) return "text-green-600 bg-green-50";
    if (score >= 66) return "text-blue-600 bg-blue-50";
    if (score >= 33) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-900">Tax Compliance</h1>
      {compliance && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Compliance Status
            </h2>
            <span
              className={`px-4 py-2 rounded-full font-medium ${getComplianceColor(
                compliance.compliance_score
              )}`}
            >
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      compliance.requirements.tin_registered ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm text-gray-700">TIN Registered</span>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      compliance.requirements.vat_registered ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-sm text-gray-700">VAT Registered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-blue-500" />
                  <span className="text-sm text-gray-700">Active Monitoring</span>
                </div>
          </div>

          {compliance.next_actions.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Next Actions Required:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {compliance.next_actions.map((action, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* End header wrapper */}
    </div>

      {/* Small Business Status */}
      {eligibility && (
        <div
          className={`rounded-lg shadow-sm border p-6 mb-6 ${
            eligibility.eligible
              ? "bg-green-50 border-green-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {eligibility.eligible
                ? "🎉 Small Business Status"
                : "Business Classification"}
            </h2>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                eligibility.eligible
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {eligibility.business_size.toUpperCase()}
            </span>
          </div>

          {eligibility.eligible && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Annual Turnover</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(eligibility.current_turnover)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Limit: {formatCurrency(eligibility.turnover_limit)} (
                    {formatCurrency(eligibility.turnover_remaining)} remaining)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fixed Assets</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(eligibility.current_assets)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Limit: {formatCurrency(eligibility.assets_limit)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  You qualify for small business benefits including reduced tax rates and simplified compliance.
                </p>
              </div>

              {eligibility.approaching_limit && (
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800">
                    ⚠️ Warning: You are approaching the small business threshold!
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Consider strategies to optimize your business structure and
                    maintain small business benefits.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Monthly Tax Report */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Monthly Tax Report</h2>
          <div className="flex items-center gap-2">
            <select
              value={reportMonth}
              onChange={(e) => setReportMonth(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              aria-label="Report month"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <select
              value={reportYear}
              onChange={(e) => setReportYear(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
              aria-label="Report year"
            >
              {[reportYear - 1, reportYear, reportYear + 1].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <div className="flex rounded-md overflow-hidden border border-gray-300" role="radiogroup" aria-label="Profit basis">
              {(["paid", "all"] as const).map(opt => {
                const active = basis === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setBasis(opt)}
                    className={`px-3 py-1 text-xs font-medium ${active ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
                  >{opt === "paid" ? "Paid" : "All"}</button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["monthlyTaxReport", reportYear, reportMonth, basis] })}
              className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >Refresh</button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={reportLoading}
              className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >{monthlyReport?.pdf_url ? "Download PDF" : "Generate PDF"}</button>
          </div>
        </div>
        {reportLoading && <div className="text-sm text-gray-500">Generating report...</div>}
        {monthlyReport && !reportLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2 text-sm">
            <div>
              <p className="text-gray-500">Profit ({monthlyReport.basis})</p>
              <p className="font-semibold">₦{monthlyReport.assessable_profit.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Levy</p>
              <p className="font-semibold">₦{monthlyReport.levy_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">VAT Collected</p>
              <p className="font-semibold">₦{monthlyReport.vat_collected.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Taxable Sales</p>
              <p className="font-semibold">₦{monthlyReport.taxable_sales.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Zero-rated Sales</p>
              <p className="font-semibold">₦{monthlyReport.zero_rated_sales.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Exempt Sales</p>
              <p className="font-semibold">₦{monthlyReport.exempt_sales.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tax Profile */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tax Profile</h2>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateProfile.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Annual Turnover */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Turnover
            </label>
            {editMode ? (
              <input
                type="number"
                value={formData.annual_turnover}
                onChange={(e) =>
                  setFormData({ ...formData, annual_turnover: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(profile?.annual_turnover || 0)}
              </p>
            )}
          </div>

          {/* Fixed Assets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fixed Assets
            </label>
            {editMode ? (
              <input
                type="number"
                value={formData.fixed_assets}
                onChange={(e) =>
                  setFormData({ ...formData, fixed_assets: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(profile?.fixed_assets || 0)}
              </p>
            )}
          </div>

          {/* TIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Identification Number (TIN)
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.tin}
                onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                placeholder={profile?.tin || "Enter TIN"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {profile?.tin || "Not registered"}
              </p>
            )}
          </div>

          {/* VAT Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VAT Registration Number
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.vat_registration_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vat_registration_number: e.target.value,
                  })
                }
                placeholder={profile?.vat_number || "Enter VAT Number"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-900">
                {profile?.vat_number || "Not registered"}
              </p>
            )}
          </div>
        </div>

        {/* Tax Rates Display */}
        {profile && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Applicable Tax Rates
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Company Income Tax</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.tax_rates.CIT}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Capital Gains Tax</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.tax_rates.CGT}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Development Levy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.tax_rates.DEV_LEVY}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">VAT</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile.tax_rates.VAT}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}
