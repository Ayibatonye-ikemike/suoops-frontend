"use client";

import { useEffect, useState } from "react";
import {
  UserPlus,
  Mail,
  Check,
  AlertCircle,
  Loader2,
  Shield,
  Trash2,
  Copy,
  CheckCircle,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface AdminMember {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_super_admin: boolean;
  can_manage_tickets: boolean;
  can_view_users: boolean;
  can_view_analytics: boolean;
  can_invite_admins: boolean;
  last_login: string | null;
  created_at: string;
}

export default function SettingsPage() {
  const { token } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Invite form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePerms, setInvitePerms] = useState({
    can_manage_tickets: true,
    can_view_users: true,
    can_view_analytics: true,
    can_invite_admins: false,
  });
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function fetchAdmins() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const res = await fetch(`${apiUrl}/admin/auth/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch admins");
        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admins");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAdmins();
  }, [token]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setIsInviting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
      const res = await fetch(`${apiUrl}/admin/auth/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          name: inviteName,
          ...invitePerms,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to send invitation");
      }

      const data = await res.json();
      setInviteSuccess(data.invite_link);
      setInviteEmail("");
      setInviteName("");
      setShowInviteForm(false);

      // Refresh admins list
      const adminsRes = await fetch(`${apiUrl}/admin/auth/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (adminsRes.ok) {
        setAdmins(await adminsRes.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite admin");
    } finally {
      setIsInviting(false);
    }
  }

  function copyInviteLink() {
    if (inviteSuccess) {
      navigator.clipboard.writeText(inviteSuccess);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Manage admin team and permissions</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {inviteSuccess && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Invitation sent successfully!
              </p>
              <p className="text-sm text-green-700 mt-1">
                Share this link with the new admin:
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-white rounded-lg text-xs text-slate-600 break-all border border-green-200">
                  {inviteSuccess}
                </code>
                <button
                  onClick={copyInviteLink}
                  className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  {copiedLink ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedLink ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <button
              onClick={() => setInviteSuccess(null)}
              className="text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Admin Team */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Admin Team</h2>
          <button
            onClick={() => setShowInviteForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
          >
            <UserPlus className="h-4 w-4" />
            Invite Admin
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : admins.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-slate-500">No admin users found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <div key={admin.id} className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">
                      {admin.name}
                    </span>
                    {admin.is_super_admin && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Shield className="h-3 w-3" />
                        Super Admin
                      </span>
                    )}
                    {!admin.is_active && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{admin.email}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>
                    Joined {new Date(admin.created_at).toLocaleDateString()}
                  </span>
                  {admin.last_login && (
                    <span>
                      Last login {new Date(admin.last_login).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite Form Modal */}
      {showInviteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Invite Admin</h3>
              <button
                onClick={() => setShowInviteForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Permissions
                </label>
                <div className="space-y-2">
                  {[
                    { key: "can_manage_tickets", label: "Manage Tickets" },
                    { key: "can_view_users", label: "View Users" },
                    { key: "can_view_analytics", label: "View Analytics" },
                    { key: "can_invite_admins", label: "Invite Admins" },
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={invitePerms[perm.key as keyof typeof invitePerms]}
                        onChange={(e) =>
                          setInvitePerms({
                            ...invitePerms,
                            [perm.key]: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-600">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50"
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
