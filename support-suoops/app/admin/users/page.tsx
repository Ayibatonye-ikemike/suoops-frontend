"use client";

import { useEffect, useState } from "react";
import {
  Search,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  CreditCard,
  Receipt,
  AlertCircle,
  ChevronRight,
  Crown,
} from "lucide-react";
import { useAdminAuth } from "../layout";

interface UserInfo {
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  role: string;
  plan: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  business_name?: string;
  business_id?: number;
  total_invoices?: number;
  total_revenue?: number;
  subscription_status?: string;
}

const planColors: Record<string, string> = {
  free: "bg-slate-100 text-slate-700",
  starter: "bg-blue-100 text-blue-700",
  professional: "bg-purple-100 text-purple-700",
  enterprise: "bg-amber-100 text-amber-700",
};

export default function UsersPage() {
  const { token } = useAdminAuth();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Search
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch users when search changes
  useEffect(() => {
    async function searchUsers() {
      if (!token || !searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        const res = await fetch(
          `${apiUrl}/admin/users?search=${encodeURIComponent(searchQuery)}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error("Failed to search users");
        const data = await res.json();
        setUsers(data.items || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setIsLoading(false);
      }
    }

    searchUsers();
  }, [token, searchQuery]);

  // Fetch user details
  async function fetchUserDetails(userId: number) {
    if (!token) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
      const res = await fetch(`${apiUrl}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      setSelectedUser(data);
    } catch (err) {
      console.error("Failed to fetch user details:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Lookup</h1>
        <p className="text-slate-500">Search and view customer details</p>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by email, name, or phone..."
            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Type at least 2 characters to search
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Search results */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <h2 className="font-medium text-slate-700 text-sm">
                {isLoading
                  ? "Searching..."
                  : users.length > 0
                  ? `${users.length} Results`
                  : searchQuery
                  ? "No Results"
                  : "Search Results"}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">
                  {searchQuery
                    ? "No users found matching your search"
                    : "Enter a search query to find users"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user);
                      fetchUserDetails(user.id);
                    }}
                    className={`w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors ${
                      selectedUser?.id === user.id ? "bg-emerald-50" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 truncate">
                          {user.full_name || "No Name"}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            planColors[user.plan] || planColors.free
                          }`}
                        >
                          {user.plan}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User details */}
        <div className="lg:col-span-2">
          {selectedUser ? (
            <div className="space-y-6">
              {/* Profile card */}
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                      {(selectedUser.full_name || selectedUser.email)
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedUser.full_name || "No Name"}
                        </h2>
                        {selectedUser.role === "admin" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <Crown className="h-3 w-3" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500">{selectedUser.email}</p>

                      <div className="flex items-center gap-4 mt-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium capitalize ${
                            planColors[selectedUser.plan] || planColors.free
                          }`}
                        >
                          {selectedUser.plan} Plan
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            selectedUser.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedUser.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact & Business info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact */}
                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">
                      Contact Information
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <a
                          href={`mailto:${selectedUser.email}`}
                          className="text-sm text-emerald-600 hover:text-emerald-700"
                        >
                          {selectedUser.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="text-sm text-slate-700">
                          {selectedUser.phone_number || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Joined</p>
                        <p className="text-sm text-slate-700">
                          {new Date(selectedUser.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {selectedUser.last_login && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Last Login</p>
                          <p className="text-sm text-slate-700">
                            {new Date(
                              selectedUser.last_login
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Business */}
                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">
                      Business & Usage
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedUser.business_name && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Business</p>
                          <p className="text-sm text-slate-700">
                            {selectedUser.business_name}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Subscription</p>
                        <p className="text-sm text-slate-700 capitalize">
                          {selectedUser.subscription_status || "N/A"}
                        </p>
                      </div>
                    </div>

                    {selectedUser.total_invoices !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            Total Invoices
                          </p>
                          <p className="text-sm text-slate-700">
                            {selectedUser.total_invoices.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedUser.total_revenue !== undefined && (
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <Receipt className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">
                            Total Revenue
                          </p>
                          <p className="text-sm font-medium text-emerald-600">
                            ₦
                            {(selectedUser.total_revenue || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <User className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No User Selected
              </h3>
              <p className="text-sm text-slate-500">
                Search for a user and select them to view their details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
