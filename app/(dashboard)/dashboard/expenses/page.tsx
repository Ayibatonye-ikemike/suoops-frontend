"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";

// Types
interface Expense {
  id: number;
  invoice_id: string;  // Invoice ID for deletion
  amount: number;
  expense_date: string;
  category: string;
  description: string | null;
  merchant: string | null;
  verified: boolean;
  channel: string | null;
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
  const [showForm, setShowForm] = useState(false);
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
      // Use unified invoice endpoint with invoice_type filter
      const response = await apiClient.get("/invoices/", { 
        params: { 
          invoice_type: "expense",
          start_date: start, 
          end_date: end 
        } 
      });
      // Map invoice format to expense format for display
      return response.data.map((inv: any) => ({
        id: inv.id,
        invoice_id: inv.invoice_id,  // For deletion
        amount: parseFloat(inv.amount),
        expense_date: inv.due_date || inv.created_at,
        category: inv.category || "other",
        description: inv.lines?.[0]?.description || null,
        merchant: inv.vendor_name || inv.merchant,
        verified: inv.verified || false,
        channel: inv.channel,
      }));
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
      // Create expense as invoice with type='expense'
      return (await apiClient.post("/invoices/", {
        invoice_type: "expense",
        amount: parseFloat(data.amount),
        due_date: data.expense_date,
        category: data.category,
        vendor_name: data.merchant || "Unknown Vendor",
        merchant: data.merchant,
        lines: [{
          description: data.description || data.category,
          quantity: 1,
          unit_price: parseFloat(data.amount),
        }],
        notes: data.description,
        channel: "dashboard",
        input_method: "manual",
        verified: true,
        status: "paid",  // Expenses are immediately marked as paid
      })).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
      setShowForm(false);
      setForm({ amount: "", expense_date: now.toISOString().split("T")[0], category: "other", description: "", merchant: "" });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (invoiceId: string) => (await apiClient.delete(`/invoices/${invoiceId}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseStats"] });
    },
  });

  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n);
  const catLabel = (c: string) => CATEGORIES.find(x => x.value === c)?.label || c;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Expense Tracking</h1>
          <p className="text-gray-600">Track business expenses and analyze spending</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>+ Add Expense</Button>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <select className="border rounded px-3 py-2" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="border rounded px-3 py-2" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2025, m - 1).toLocaleString("default", { month: "long" })}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Expenses" value={fmt(stats.total_expenses)} />
          <StatCard label="Total Revenue" value={fmt(stats.total_revenue)} />
          <StatCard
            label="Actual Profit"
            value={fmt(stats.actual_profit)}
            className={stats.actual_profit >= 0 ? "text-green-600" : "text-red-600"}
          />
          <StatCard label="Expense Ratio" value={`${stats.expense_to_revenue_ratio.toFixed(1)}%`} />
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <Card>
          <CardHeader><h3 className="text-xl font-semibold">Add New Expense</h3></CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); createExpense.mutate(form); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (₦) *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded px-3 py-2"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.expense_date}
                    onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Merchant</label>
                  <input type="text" className="w-full border rounded px-3 py-2" value={form.merchant} onChange={(e) => setForm({ ...form, merchant: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createExpense.isPending}>{createExpense.isPending ? "Adding..." : "Add Expense"}</Button>
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
                      <span className="font-medium">{fmt(exp.amount)}</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{catLabel(exp.category)}</span>
                      {!exp.verified && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Unverified</span>}
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                    {exp.merchant && <p className="text-xs text-gray-500">@ {exp.merchant}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(exp.expense_date).toLocaleDateString()} {exp.channel && `• via ${exp.channel}`}
                    </p>
                  </div>
                  <Button onClick={() => confirm("Delete?") && deleteExpense.mutate(exp.invoice_id)} disabled={deleteExpense.isPending}>
                    🗑️
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No expenses for this period</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
