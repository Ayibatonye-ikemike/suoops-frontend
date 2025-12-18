"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Ticket,
  FileText,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";
import { useAdminAuth } from "./layout";

interface DashboardStats {
  users: {
    total: number;
    verified: number;
    registered_today: number;
    registered_this_week: number;
    active_last_30_days: number;
    by_plan: Record<string, number>;
  };
  tickets: {
    total_tickets: number;
    open_tickets: number;
    in_progress_tickets: number;
    resolved_tickets: number;
    tickets_today: number;
    tickets_this_week: number;
    avg_response_time_hours: number | null;
  };
  invoices: {
    total: number;
    this_month: number;
    paid: number;
  };
  revenue: {
    this_month: number;
  };
}

interface RecentTicket {
  id: number;
  name: string;
  subject: string;
  status: string;
  priority: string;
  created_at: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  href,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && (
            <p className="mt-2 flex items-center text-sm text-emerald-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +{trend.value} {trend.label}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
          <Icon className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      {href && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-sm text-emerald-600 flex items-center">
            View all <ArrowUpRight className="h-4 w-4 ml-1" />
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

function TicketStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-700",
    in_progress: "bg-blue-100 text-blue-700",
    waiting: "bg-purple-100 text-purple-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] || styles.open
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: "bg-slate-100 text-slate-600",
    medium: "bg-blue-100 text-blue-600",
    high: "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[priority] || styles.medium
      }`}
    >
      {priority}
    </span>
  );
}

export default function AdminDashboard() {
  const { token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!token) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";
        
        // Fetch dashboard stats
        const statsRes = await fetch(`${apiUrl}/support/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent tickets
        const ticketsRes = await fetch(
          `${apiUrl}/support/admin/tickets?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setRecentTickets(ticketsData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome back! Here&apos;s your support overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          subtitle={`${stats?.users.active_last_30_days || 0} active`}
          icon={Users}
          trend={stats?.users.registered_this_week ? { value: stats.users.registered_this_week, label: "this week" } : undefined}
          href="/admin/users"
        />
        <StatCard
          title="Open Tickets"
          value={stats?.tickets.open_tickets || 0}
          subtitle={`${stats?.tickets.in_progress_tickets || 0} in progress`}
          icon={Ticket}
          href="/admin/tickets"
        />
        <StatCard
          title="Invoices This Month"
          value={stats?.invoices.this_month || 0}
          subtitle={`${stats?.invoices.paid || 0} paid total`}
          icon={FileText}
        />
        <StatCard
          title="Revenue This Month"
          value={`₦${((stats?.revenue.this_month || 0) / 1000).toFixed(0)}k`}
          icon={TrendingUp}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Users by Plan</h3>
          <div className="space-y-3">
            {Object.entries(stats?.users.by_plan || {}).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <span className="text-sm text-slate-600 capitalize">{plan}</span>
                <span className="text-sm font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Ticket Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <AlertCircle className="h-4 w-4 text-yellow-500" /> Open
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.tickets.open_tickets || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-blue-500" /> In Progress
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.tickets.in_progress_tickets || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-green-500" /> Resolved
              </span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.tickets.resolved_tickets || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-4">Today&apos;s Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">New Users</span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.users.registered_today || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">New Tickets</span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.tickets.tickets_today || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Avg Response Time</span>
              <span className="text-sm font-semibold text-slate-900">
                {stats?.tickets.avg_response_time_hours
                  ? `${stats.tickets.avg_response_time_hours}h`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Tickets</h3>
          <Link
            href="/admin/tickets"
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTickets.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No tickets yet
            </div>
          ) : (
            recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/admin/tickets/${ticket.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      #{ticket.id}
                    </span>
                    <TicketStatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                  </div>
                  <p className="text-sm text-slate-600 truncate mt-1">
                    {ticket.subject}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {ticket.name} •{" "}
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 shrink-0" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
