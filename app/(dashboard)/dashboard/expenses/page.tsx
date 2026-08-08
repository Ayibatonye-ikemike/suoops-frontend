"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useCurrency } from "@/hooks/use-currency";
import { MessageCircle, Plus, Trash2 } from "lucide-react";

// Types
interface Expense {
  id: number;
  amount: number;
  expense_date: string;
  category: string;
  description: string | null;
  merchant: string | null;
  verified: boolean;
  channel: string | null;
  receipt_url: string | null;
  record_status: "self_reported" | "documented" | "flagged";
  possible_duplicate: boolean;
}

interface ExpenseStats {
  total_expenses: number;
  total_revenue: number;
  actual_profit: number;
  expense_to_revenue_ratio: number;
}

const CATEGORIES = [
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "data_internet", label: "Data/Internet" },
  { value: "transport", label: "Transport" },
  { value: "supplies", label: "Supplies" },
  { value: "equipment", label: "Equipment" },
  { value: "marketing", label: "Marketing" },
  { value: "professional_fees", label: "Professional Fees" },
  { value: "staff_wages", label: "Staff Wages" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
];

export default function ExpensesPage() {
  const queryClient = useQueryClient();
  const now = new Date();
  const [showForm, setShowForm] = useState(true);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  
  const [form, setForm] = useState({
    amount: "",
    expense_date: now.toISOString().split("T")[0],
    category: "other",
    description: "",
    merchant: "",
  });

  const { data: expenses } = useQuery<Expense[]>({
    queryKey: ["expenses", year, month],
    queryFn: async () => {
      const start = `${year}-${String(month).padStart(2, "0")}-01`;
      const end = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;
      const response = await apiClient.get<Expense[]>("/expenses/", {
        params: { 
          start_date: start, 
          end_date: end,
          limit: 200,
        } 
      });
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  const { data: stats } = useQuery<ExpenseStats>({
    queryKey: ["expenseStats", year, month],
    queryFn: async () => {
      return (await apiClient.get("/expenses/stats/overview", {
        params: { period_type: "month", year, month },
      })).data;
    },
  });

  const createExpense = useMutation({
    mutationFn: async (data: typeof form) => {
      return (await apiClient.post("/expenses/", {
        amount: parseFloat(data.amount),
        expense_date: data.expense_date,
        category: data.category,
        merchant: data.merchant,
        description: data.description,
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
      setForm({ amount: "", expense_date: now.toISOString().split("T")[0], category: "other", description: "", merchant: "" });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (expenseId: number) => (await apiClient.delete(`/expenses/${expenseId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
    },
  });

  const { formatWhole, symbol } = useCurrency();
  const catLabel = (c: string) => CATEGORIES.find(x => x.value === c)?.label || c;

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Expense Tracking</h1>
          <p className="mt-1 text-xs text-gray-600 sm:text-sm">Track business expenses and analyze spending</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <a
            href="https://wa.me/2348106865807?text=Expense%20%E2%82%A65000%20for%20transport"
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 sm:flex-none"
          >
            <MessageCircle className="h-4 w-4" />
            Add on WhatsApp
          </a>
          <Button onClick={() => setShowForm(!showForm)} className="flex-1 gap-2 sm:flex-none">
            <Plus className="h-4 w-4" />
            Quick add
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <select className="flex-1 rounded border px-3 py-2 text-sm sm:flex-none sm:text-base" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="flex-1 rounded border px-3 py-2 text-sm sm:flex-none sm:text-base" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2025, m - 1).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <StatCard label="Total Expenses" value={formatWhole(stats.total_expenses)} />
          <StatCard label="Total Revenue" value={formatWhole(stats.total_revenue)} />
          <StatCard
            label="Actual Profit"
            value={formatWhole(stats.actual_profit)}
            className={stats.actual_profit >= 0 ? "text-green-600" : "text-red-600"}
          />
          <StatCard label="Expense Ratio" value={`${stats.expense_to_revenue_ratio.toFixed(1)}%`} />
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader className="px-4 sm:px-6">
            <h3 className="text-lg font-semibold sm:text-xl">Quick add expense</h3>
            <p className="mt-1 text-sm text-gray-600">Record what you spent to see your real profit and keep tax records complete.</p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={(e) => { e.preventDefault(); createExpense.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount ({symbol}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded px-3 py-2"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="5,000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">What was it for?</label>
                  <input type="text" className="w-full border rounded px-3 py-2" placeholder="Transport, data, supplies..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <details className="rounded-md border border-gray-200 px-3 py-2">
                <summary className="cursor-pointer text-sm font-medium text-gray-600">Date and merchant</summary>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date *</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Merchant</label>
                    <input type="text" className="w-full border rounded px-3 py-2" placeholder="Optional" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
                  </div>
                </div>
              </details>
              {createExpense.isError && <p className="text-sm text-red-600">Could not save this expense. Please try again.</p>}
              <div className="flex gap-2 justify-end">
                <Button type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createExpense.isPending} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {createExpense.isPending ? "Saving..." : "Save expense"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expense List */}
      <Card>
        <CardHeader><h3 className="text-xl font-semibold">Recent Expenses</h3></CardHeader>
        <CardContent>
          {expenses && expenses.length > 0 ? (
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-start p-3 border rounded hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatWhole(exp.amount)}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{catLabel(exp.category)}</span>
                      {exp.record_status === "flagged" ? (
                        <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">Possible duplicate</span>
                      ) : exp.record_status === "documented" ? (
                        <span className="rounded bg-emerald-100 px-2 py-1 text-xs text-emerald-800">Receipt attached</span>
                      ) : (
                        <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">Self-reported</span>
                      )}
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                    {exp.merchant && <p className="text-xs text-gray-500">@ {exp.merchant}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(exp.expense_date).toLocaleDateString()} {exp.channel && `• via ${exp.channel}`}
                    </p>
                  </div>
                  <Button aria-label="Delete expense" title="Delete expense" onClick={() => confirm("Delete this expense?") && deleteExpense.mutate(exp.id)} disabled={deleteExpense.isPending}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-base font-semibold text-gray-800">No expenses for this period</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Track your spending to see real profit &amp; get accurate tax reports.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 max-w-md mx-auto text-left">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="text-xs font-semibold text-emerald-800 mb-1">📱 Via WhatsApp</p>
                  <p className="text-xs text-emerald-700 font-mono">&quot;Expense: ₦5,000 for transport&quot;</p>
                </div>
                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                  <p className="text-xs font-semibold text-blue-800 mb-1">📝 Via Dashboard</p>
                  <p className="text-xs text-blue-700">Tap &quot;Add Expense&quot; above to log one</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
