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
  KeyRound,
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
  const { token, user } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete admin state
  const [adminToDelete, setAdminToDelete] = useState<AdminMember | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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

    // Validate email domain
    if (!inviteEmail.toLowerCase().endsWith("@suoops.com")) {
      setError("Only @suoops.com email addresses can be invited as admins");
      return;
    }

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

  async function handleDeleteAdmin() {
    if (!adminToDelete || !token) return;

    setIsDeleting(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
      const res = await fetch(`${apiUrl}/admin/auth/admins/${adminToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to remove admin");
      }

      // Refresh admins list
      const adminsRes = await fetch(`${apiUrl}/admin/auth/admins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (adminsRes.ok) {
        setAdmins(await adminsRes.json());
      }

      setAdminToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove admin");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 12) {
      setPasswordError("New password must be at least 12 characters");
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setPasswordError("Password must contain both uppercase and lowercase letters");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setPasswordError("Password must contain at least one digit");
      return;
    }

    setIsChangingPassword(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
      const res = await fetch(`${apiUrl}/admin/auth/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to change password");
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
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
          {user?.is_super_admin && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Invite Admin
            </button>
          )}
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
            {admins
              .filter((admin) => {
                // Non-super admins shouldn't see super admin details
                if (!user?.is_super_admin && admin.is_super_admin) {
                  return false;
                }
                return true;
              })
              .map((admin) => (
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
                  {/* Delete button - only visible to super admins, can't delete self or other super admins */}
                  {user?.is_super_admin && admin.id !== user.id && !admin.is_super_admin && (
                    <button
                      onClick={() => setAdminToDelete(admin)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove admin"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <KeyRound className="h-5 w-5 text-slate-500" />
          <h2 className="font-semibold text-slate-900">Change Password</h2>
        </div>
        <form onSubmit={handleChangePassword} className="p-6 space-y-4 max-w-md">
          {passwordSuccess && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
              <Check className="h-4 w-4 shrink-0" />
              <p className="text-sm">Password changed successfully.</p>
            </div>
          )}
          {passwordError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p className="text-sm">{passwordError}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              At least 12 characters, with upper &amp; lower case letters and a digit.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-60"
          >
            {isChangingPassword ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            {isChangingPassword ? "Changing\u2026" : "Change Password"}
          </button>
        </form>
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

      {/* Delete Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Remove Admin</h3>
                  <p className="text-sm text-slate-500">This action cannot be undone</p>
                </div>
              </div>

              <p className="text-slate-600 mb-6">
                Are you sure you want to remove <strong>{adminToDelete.name}</strong> ({adminToDelete.email}) from the admin team?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setAdminToDelete(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Remove Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
