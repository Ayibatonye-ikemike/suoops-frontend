"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  UserCheck,
  CreditCard,
  TrendingUp,
  Calendar,
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface UserStats {
  total_users: number;
  verified_users: number;
  users_by_plan: {
    FREE: number;
    STARTER: number;
    PRO: number;
    BUSINESS: number;
  };
  users_registered_today: number;
  users_registered_this_week: number;
  users_registered_this_month: number;
  active_last_30_days: number;
}

interface User {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  phone_verified: boolean;
  plan: string;
  created_at: string;
  last_login: string | null;
  role: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("");
  const [skip, setSkip] = useState(0);
  const limit = 20;

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await apiClient.get("/admin/users/stats");
      return response.data;
    },
    retry: 1,
  });

  // Fetch users list
  const { data: usersData, isLoading: usersLoading } = useQuery<UsersResponse>({
    queryKey: ["adminUsers", skip, search, planFilter],
    queryFn: async () => {
      const params: any = { skip, limit };
      if (search) params.search = search;
      if (planFilter) params.plan = planFilter;
      const response = await apiClient.get("/admin/users", { params });
      return response.data;
    },
    retry: 1,
  });

  const totalPages = usersData ? Math.ceil(usersData.total / limit) : 0;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="min-h-screen bg-brand-background">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-text">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            View and manage registered users
          </p>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-white" />
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Total Users</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.total_users}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Verified</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.verified_users}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Active (30d)</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.active_last_30_days}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-amber-100 p-3">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">This Month</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_registered_this_month}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Distribution */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-gray-100 p-3">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Free Plan</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_by_plan.FREE}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Starter</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_by_plan.STARTER}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-purple-100 p-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Pro</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_by_plan.PRO}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-amber-100 p-3">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Business</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_by_plan.BUSINESS}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Stats */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">Today</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_registered_today}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">This Week</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_registered_this_week}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="rounded-full bg-purple-100 p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-brand-textMuted">This Month</p>
                    <p className="text-2xl font-bold text-brand-text">
                      {stats.users_registered_this_month}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}

        {/* Users Table */}
        <Card>
          <CardHeader className="border-b border-brand-border/60">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-brand-text">
                All Users ({usersData?.total || 0})
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-textMuted" />
                  <Input
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSkip(0);
                    }}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value);
                    setSkip(0);
                  }}
                  className="rounded-md border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="">All Plans</option>
                  <option value="FREE">Free</option>
                  <option value="STARTER">Starter</option>
                  <option value="PRO">Pro</option>
                  <option value="BUSINESS">Business</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="p-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="mb-4 h-16 animate-pulse rounded bg-brand-background"
                  />
                ))}
              </div>
            ) : usersData && usersData.users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brand-background/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-textMuted">
                          Last Login
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60 bg-white">
                      {usersData.users.map((user) => (
                        <tr key={user.id} className="hover:bg-brand-background/30">
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-brand-text">
                                  {user.name || "—"}
                                </div>
                                {user.role !== "user" && (
                                  <div className="mt-0.5 text-xs text-amber-600 font-semibold">
                                    {user.role.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-textMuted">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                user.plan === "FREE"
                                  ? "bg-gray-100 text-gray-800"
                                  : user.plan === "STARTER"
                                    ? "bg-blue-100 text-blue-800"
                                    : user.plan === "PRO"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {user.plan}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {user.phone_verified ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                                <UserCheck className="h-3 w-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="text-xs text-brand-textMuted">
                                Not verified
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-textMuted">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-textMuted">
                            {user.last_login
                              ? new Date(user.last_login).toLocaleDateString()
                              : "Never"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-brand-border/60 px-6 py-4">
                    <div className="text-sm text-brand-textMuted">
                      Showing {skip + 1} to {Math.min(skip + limit, usersData.total)} of{" "}
                      {usersData.total} users
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSkip(Math.max(0, skip - limit))}
                        disabled={skip === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSkip(skip + limit)}
                        disabled={currentPage >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <p className="text-brand-textMuted">No users found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
