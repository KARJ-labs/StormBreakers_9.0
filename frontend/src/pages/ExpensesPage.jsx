import React, { useState, useEffect } from 'react';
import { expenseApi } from '../api/expenseApi';
import { SpeedometerGauge } from '../components/charts/SpeedometerGauge';
import { ExpenseModal } from '../components/modals/ExpenseModal';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Receipt,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Tag,
  Loader2,
  AlertCircle,
  TrendingDown,
  Filter,
} from 'lucide-react';

export const ExpensesPage = () => {
  const { financialProfile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (categoryFilter) params.category = categoryFilter;

      const [listRes, summaryRes] = await Promise.all([
        expenseApi.getExpenses(params).catch(() => ({ data: [] })),
        expenseApi.getExpenseSummary(period).catch(() => null),
      ]);

      setExpenses(listRes?.data || []);
      if (summaryRes?.data) setSummary(summaryRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load expense history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [period, categoryFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await expenseApi.deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const handleEdit = (exp) => {
    setSelectedExpense(exp);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedExpense(null);
    setModalOpen(true);
  };

  const totalSpent = summary?.totalSpending || expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const monthlyIncome = financialProfile?.monthlyIncome || 5000;
  const remainingBudget = Math.max(monthlyIncome - totalSpent, 0);

  const categoryBreakdown = summary?.categoryBreakdown || {};

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald shadow-glow-emerald">
              <Receipt className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Smart Expense Tracker
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time cashflow categorization, monthly budget limits, and transaction logs.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-emerald to-brand-mint hover:opacity-90 transition-all shadow-glow-emerald flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* 1. SPEEDOMETER BUDGET HERO & SUMMARY CARD (INSPIRED BY REFERENCE 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Speedometer Gauge (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl glass-card border border-brand-emerald/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Monthly Budget Dial
            </span>
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl">
              {['daily', 'weekly', 'monthly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-lg capitalize transition-all ${
                    period === p
                      ? 'bg-brand-emerald text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <SpeedometerGauge spent={totalSpent} limit={monthlyIncome} />

          {/* Left until month end card */}
          <div className="w-full mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-brand-emerald/10 via-brand-cyan/10 to-transparent border border-brand-emerald/20 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Safe Discretionary Left</span>
              <span className="text-xl font-extrabold text-white font-mono">
                {formatCurrency(remainingBudget)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-brand-mint font-semibold uppercase block">Daily Allowance</span>
              <span className="text-xs font-mono font-bold text-slate-300">
                {formatCurrency(remainingBudget / 30)} / day
              </span>
            </div>
          </div>
        </div>

        {/* Category Breakdown Chips Grid (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl glass-card border border-border-subtle p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Category Spending Distribution
          </h3>

          {Object.keys(categoryBreakdown).length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                <div
                  key={cat}
                  onClick={() => setCategoryFilter(categoryFilter === cat ? '' : cat)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    categoryFilter === cat
                      ? 'bg-brand-emerald/20 border-brand-emerald text-white'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-brand-emerald" />
                    <span className="text-xs font-medium capitalize truncate">{cat}</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-white">
                    {formatCurrency(amt)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No categorized expenses logged for this period.
            </div>
          )}
        </div>
      </div>

      {/* 2. TRANSACTION LOG TABLE */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Expense Records</h3>
            <span className="text-xs text-slate-500 font-mono">({expenses.length} total)</span>
          </div>

          {categoryFilter && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Filtered by: <strong className="text-brand-emerald capitalize">{categoryFilter}</strong></span>
              <button
                onClick={() => setCategoryFilter('')}
                className="text-brand-cyan hover:underline text-[11px]"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-emerald" />
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Receipt className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Expenses Recorded</h4>
            <p className="text-xs text-slate-400">Click "Log New Expense" above to add your first transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Description</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Method</th>
                  <th className="pb-3 font-semibold text-right">Amount</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5 text-slate-400 font-mono whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>
                    <td className="py-3.5 text-white font-medium max-w-[200px] truncate">
                      {exp.description || 'General Outflow'}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 font-medium capitalize text-[11px] border border-white/5">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 uppercase font-mono text-[10px]">
                      {exp.paymentMethod || 'OTHER'}
                    </td>
                    <td className="py-3.5 text-right font-mono font-extrabold text-white">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-coral hover:bg-brand-coral/10"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        expense={selectedExpense}
        onSaved={fetchExpenses}
      />
    </div>
  );
};
