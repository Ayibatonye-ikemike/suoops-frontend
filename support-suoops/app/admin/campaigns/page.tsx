"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../layout";
import {
  Megaphone,
  Users,
  Send,
  Eye,
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Target,
  TrendingUp,
  Zap,
  Gift,
  Clock,
  UserPlus,
} from "lucide-react";

interface Campaign {
  type: string;
  template: string;
  description: string;
  parameters: string[];
  goal: string;
}

interface Candidate {
  id: number;
  name: string;
  phone: string;
  email?: string;
  invoice_balance?: number;
  invoice_count?: number;
  plan?: string;
  signed_up?: string;
}

interface CampaignResult {
  success: boolean;
  campaign: string;
  template: string;
  dry_run: boolean;
  candidates: number;
  sent: number;
  failed: number;
  skipped: number;
  message?: string;
  errors?: string[];
  details?: Array<{
    user_id: number;
    name: string;
    phone: string;
    status: string;
    reason?: string;
  }>;
}

const campaignIcons: Record<string, typeof Megaphone> = {
  activation_welcome: UserPlus,
  win_back_reminder: Clock,
  low_balance_reminder: AlertCircle,
  pro_upgrade: TrendingUp,
  invoice_pack_promo: Gift,
  first_invoice_followup: Zap,
};

const campaignColors: Record<string, string> = {
  activation_welcome: "bg-blue-500",
  win_back_reminder: "bg-orange-500",
  low_balance_reminder: "bg-red-500",
  pro_upgrade: "bg-purple-500",
  invoice_pack_promo: "bg-emerald-500",
  first_invoice_followup: "bg-cyan-500",
};

export default function CampaignsPage() {
  const { token } = useAdminAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [result, setResult] = useState<CampaignResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [sending, setSending] = useState(false);
  const [limit, setLimit] = useState(20);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

  // Fetch available campaigns
  useEffect(() => {
    async function fetchCampaigns() {
      if (!token) return;
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/admin/campaigns/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, [token, apiUrl]);

  // Fetch candidates for selected campaign
  async function fetchCandidates(campaignType: string) {
    if (!token) return;
    setLoadingCandidates(true);
    setError(null);
    try {
      const res = await fetch(
        `${apiUrl}/admin/campaigns/candidates/${campaignType}?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch candidates");
      const data = await res.json();
      setCandidates(data.candidates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load candidates");
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  }

  // Preview campaign (dry run)
  async function previewCampaign() {
    if (!token || !selectedCampaign) return;
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${apiUrl}/admin/campaigns/preview`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_type: selectedCampaign,
          dry_run: true,
          limit,
        }),
      });
      if (!res.ok) throw new Error("Preview failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setSending(false);
    }
  }

  // Send campaign (actually sends messages!)
  async function sendCampaign() {
    if (!token || !selectedCampaign) return;
    
    const confirmed = window.confirm(
      `⚠️ You are about to send REAL WhatsApp messages to up to ${limit} users.\n\nThis will use your WhatsApp Business API quota.\n\nAre you sure you want to proceed?`
    );
    if (!confirmed) return;

    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${apiUrl}/admin/campaigns/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaign_type: selectedCampaign,
          dry_run: false,
          limit,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed");
    } finally {
      setSending(false);
    }
  }

  // Select a campaign
  function handleSelectCampaign(campaignType: string) {
    setSelectedCampaign(campaignType);
    setResult(null);
    setCandidates([]);
    fetchCandidates(campaignType);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing Campaigns</h1>
          <p className="text-slate-600 mt-1">
            Send WhatsApp marketing messages to engage and convert users
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => {
          const Icon = campaignIcons[campaign.type] || Megaphone;
          const colorClass = campaignColors[campaign.type] || "bg-slate-500";
          const isSelected = selectedCampaign === campaign.type;

          return (
            <button
              key={campaign.type}
              onClick={() => handleSelectCampaign(campaign.type)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50 shadow-lg"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 capitalize">
                    {campaign.type.replace(/_/g, " ")}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {campaign.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                    <Target className="h-3 w-3" />
                    {campaign.goal}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Campaign Details */}
      {selectedCampaign && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Campaign Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = campaignIcons[selectedCampaign] || Megaphone;
                  const colorClass = campaignColors[selectedCampaign] || "bg-slate-500";
                  return (
                    <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="font-semibold text-slate-900 capitalize">
                    {selectedCampaign.replace(/_/g, " ")}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {candidates.length} candidates found
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Limit:</span>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </label>

                <button
                  onClick={() => fetchCandidates(selectedCampaign)}
                  disabled={loadingCandidates}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingCandidates ? "animate-spin" : ""}`} />
                  Refresh
                </button>

                <button
                  onClick={previewCampaign}
                  disabled={sending || candidates.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>

                <button
                  onClick={sendCampaign}
                  disabled={sending || candidates.length === 0}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="overflow-x-auto">
            {loadingCandidates ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No candidates found for this campaign</p>
                <p className="text-sm mt-1">Try adjusting the criteria or check back later</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    {selectedCampaign === "pro_upgrade" && (
                      <>
                        <th className="px-4 py-3 text-left font-medium">Plan</th>
                        <th className="px-4 py-3 text-left font-medium">Invoices</th>
                      </>
                    )}
                    {(selectedCampaign === "low_balance_reminder" || 
                      selectedCampaign === "invoice_pack_promo") && (
                      <th className="px-4 py-3 text-left font-medium">Balance</th>
                    )}
                    {selectedCampaign === "activation_welcome" && (
                      <th className="px-4 py-3 text-left font-medium">Signed Up</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {candidate.name || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                        {candidate.phone}
                      </td>
                      {selectedCampaign === "pro_upgrade" && (
                        <>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-slate-100 rounded text-xs uppercase">
                              {candidate.plan}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {candidate.invoice_count}
                          </td>
                        </>
                      )}
                      {(selectedCampaign === "low_balance_reminder" || 
                        selectedCampaign === "invoice_pack_promo") && (
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            (candidate.invoice_balance || 0) === 0 
                              ? "bg-red-100 text-red-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {candidate.invoice_balance} left
                          </span>
                        </td>
                      )}
                      {selectedCampaign === "activation_welcome" && (
                        <td className="px-4 py-3 text-slate-500 text-xs">
                          {candidate.signed_up 
                            ? new Date(candidate.signed_up).toLocaleDateString()
                            : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Results Panel */}
      {result && (
        <div className={`rounded-xl border-2 p-6 ${
          result.dry_run 
            ? "bg-blue-50 border-blue-200" 
            : result.failed > 0 
              ? "bg-yellow-50 border-yellow-200"
              : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-start gap-4">
            {result.dry_run ? (
              <Eye className="h-6 w-6 text-blue-500 flex-shrink-0" />
            ) : result.failed > 0 ? (
              <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">
                {result.dry_run ? "Preview Results" : "Campaign Sent!"}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {result.message || `Template: ${result.template}`}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-slate-900">{result.candidates}</div>
                  <div className="text-xs text-slate-500">Candidates</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{result.sent}</div>
                  <div className="text-xs text-slate-500">Sent</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                  <div className="text-xs text-slate-500">Failed</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-slate-400">{result.skipped}</div>
                  <div className="text-xs text-slate-500">Skipped</div>
                </div>
              </div>

              {/* Error Details */}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-4 bg-white rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-700 mb-2">Errors:</h4>
                  <ul className="text-xs text-red-600 space-y-1">
                    {result.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li className="text-slate-500">
                        ...and {result.errors.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <h4 className="font-medium text-slate-700 mb-2">📋 Before Running Campaigns</h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li>• Templates must be approved in Meta Business Suite before sending</li>
          <li>• Marketing messages require user opt-in within 24 hours</li>
          <li>• Rate limited to ~2 messages/second to avoid WhatsApp blocks</li>
          <li>• Always preview before sending to verify candidate list</li>
          <li>• Maximum 100 messages per campaign run</li>
        </ul>
      </div>
    </div>
  );
}
