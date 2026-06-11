"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Zap,
  Play,
  RefreshCw,
  CheckCircle2,
  Clock,
  Mail,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";

// Admin auth hook — use shared context from layout
import { useAdminAuth } from "../layout";

interface ScheduleEntry {
  name: string;
  task: string;
  schedule: string;
}

interface TaskScheduleResponse {
  schedule: ScheduleEntry[];
  worker_status: string;
  email_stats: {
    sent_last_24h: number;
    sent_last_7d: number;
    by_type_7d: Record<string, number>;
  };
}

const TASK_INFO: Record<string, { label: string; description: string; color: string }> = {
  engagement: {
    label: "Engagement Emails",
    description: "Activation, monetization, and tip emails to users based on lifecycle stage",
    color: "violet",
  },
  daily_summary: {
    label: "Daily Summary",
    description: "WhatsApp business summary for PRO users (revenue, expenses, overdue)",
    color: "blue",
  },
  overdue_reminders: {
    label: "Overdue Reminders",
    description: "WhatsApp reminders for users with overdue invoices",
    color: "amber",
  },
  tax_reports: {
    label: "Monthly Tax Reports",
    description: "Auto-generate tax reports on the 1st of each month",
    color: "emerald",
  },
};

export default function TasksPage() {
  const { token } = useAdminAuth();
  const [schedule, setSchedule] = useState<TaskScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [triggeringTask, setTriggeringTask] = useState<string | null>(null);
  const [triggerResult, setTriggerResult] = useState<{ key: string; message: string } | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com";

  const fetchSchedule = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/admin/tasks/schedule`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();
      setSchedule(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token, apiUrl]);

  async function triggerTask(taskKey: string) {
    if (!token) return;
    setTriggeringTask(taskKey);
    setTriggerResult(null);
    try {
      const res = await fetch(`${apiUrl}/admin/tasks/${taskKey}/trigger`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to trigger task");
      const data = await res.json();
      setTriggerResult({ key: taskKey, message: data.message });
    } catch (err) {
      setTriggerResult({ key: taskKey, message: err instanceof Error ? err.message : "Failed" });
    } finally {
      setTriggeringTask(null);
    }
  }

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scheduled Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and manually trigger Celery Beat tasks</p>
        </div>
        <button
          onClick={fetchSchedule}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {schedule && (
        <>
          {/* Worker Status + Email Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Worker Status */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-3 mb-2">
                {schedule.worker_status === "connected" ? (
                  <Wifi className="h-5 w-5 text-emerald-500" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500" />
                )}
                <h3 className="font-semibold text-slate-900">Worker Status</h3>
              </div>
              <p className={`text-lg font-bold ${
                schedule.worker_status === "connected" ? "text-emerald-600" : "text-red-600"
              }`}>
                {schedule.worker_status === "connected" ? "Connected" :
                 schedule.worker_status === "no_workers" ? "No Workers Running" :
                 "Unreachable"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {schedule.worker_status === "connected"
                  ? "Celery worker is running and processing tasks"
                  : "Tasks are queued but not being processed"}
              </p>
            </div>

            {/* Emails Last 24h */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-violet-500" />
                <h3 className="font-semibold text-slate-900">Emails (24h)</h3>
              </div>
              <p className="text-3xl font-bold text-violet-600">
                {schedule.email_stats.sent_last_24h}
              </p>
              <p className="text-xs text-slate-500 mt-1">Lifecycle emails sent in the last 24 hours</p>
            </div>

            {/* Emails Last 7d */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-slate-900">Emails (7d)</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {schedule.email_stats.sent_last_7d}
              </p>
              <p className="text-xs text-slate-500 mt-1">Lifecycle emails sent in the last 7 days</p>
            </div>
          </div>

          {/* Email Breakdown */}
          {Object.keys(schedule.email_stats.by_type_7d).length > 0 && (
            <div className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-3">Email Breakdown (Last 7 Days)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(schedule.email_stats.by_type_7d).map(([type, count]) => (
                  <div key={type} className="rounded-lg bg-slate-50 px-3 py-2">
                    <p className="text-xs text-slate-500 truncate">{type}</p>
                    <p className="text-lg font-bold text-slate-900">{count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Task Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TASK_INFO).map(([key, info]) => {
              const scheduleEntry = schedule.schedule.find(
                (s) => s.task === ({
                  engagement: "engagement.send_lifecycle_emails",
                  daily_summary: "summary.send_daily_summaries",
                  overdue_reminders: "maintenance.send_overdue_reminders",
                  tax_reports: "tax.generate_previous_month_reports",
                }[key])
              );

              return (
                <div key={key} className="rounded-xl border bg-white overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg p-2 bg-${info.color}-100`}>
                          <Zap className={`h-5 w-5 text-${info.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{info.label}</h3>
                          <p className="text-sm text-slate-500 mt-0.5">{info.description}</p>
                        </div>
                      </div>
                    </div>

                    {scheduleEntry && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Schedule: {scheduleEntry.schedule}</span>
                      </div>
                    )}

                    {triggerResult?.key === key && (
                      <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {triggerResult.message}
                      </div>
                    )}
                  </div>

                  <div className="border-t px-5 py-3 bg-slate-50 flex items-center justify-end">
                    <button
                      onClick={() => triggerTask(key)}
                      disabled={triggeringTask === key}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                      {triggeringTask === key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Run Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Schedule Table */}
          <div className="rounded-xl border bg-white overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold text-slate-900">Full Beat Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50">
                    <th className="text-left px-5 py-3 font-medium text-slate-500">Name</th>
                    <th className="text-left px-5 py-3 font-medium text-slate-500">Task ID</th>
                    <th className="text-left px-5 py-3 font-medium text-slate-500">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.schedule.map((entry) => (
                    <tr key={entry.name} className="border-b last:border-0">
                      <td className="px-5 py-3 font-medium text-slate-900">{entry.name}</td>
                      <td className="px-5 py-3 text-slate-600 font-mono text-xs">{entry.task}</td>
                      <td className="px-5 py-3 text-slate-600">{entry.schedule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
