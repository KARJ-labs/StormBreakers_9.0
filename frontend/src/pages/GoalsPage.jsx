import React, { useState, useEffect } from 'react';
import { goalApi } from '../api/goalApi';
import { CircularProgressWheel } from '../components/charts/CircularProgressWheel';
import { GoalModal } from '../components/modals/GoalModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await goalApi.getGoals();
      setGoals(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load wealth goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this wealth goal?')) return;
    try {
      await goalApi.deleteGoal(id);
      fetchGoals();
    } catch (err) {
      alert(err.message || 'Failed to delete goal');
    }
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGoal(null);
    setModalOpen(true);
  };

  const totalTarget = goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0);
  const totalSaved = goals.reduce((acc, g) => acc + (g.currentAmount || 0), 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo shadow-glow-indigo">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Money Goals & Milestones
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target capital accumulation, required monthly savings rate, and portfolio objectives.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-indigo to-brand-purple hover:opacity-90 transition-all shadow-glow-indigo flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Wealth Goal</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* 1. OVERVIEW PROGRESS WHEEL & STATS CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radial Wheel (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl glass-card border border-brand-indigo/30 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between w-full border-b border-white/5 pb-3 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cumulative Goals Allocation
            </span>
            <span className="text-xs font-mono font-bold text-brand-sky">
              {overallProgress.toFixed(1)}% Total Progress
            </span>
          </div>

          <CircularProgressWheel
            totalValue={totalTarget}
            items={
              goals.length > 0
                ? goals.map((g) => ({
                    name: g.name,
                    amount: g.currentAmount,
                    percentage: g.progressPercentage,
                  }))
                : []
            }
          />
        </div>

        {/* Aggregate Target Diagnostics (6 cols) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl glass-card border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Total Capital Target</span>
            <div className="text-2xl font-extrabold text-white font-mono">
              {formatCurrency(totalTarget)}
            </div>
            <span className="text-[11px] text-slate-500 block">Across {goals.length} active milestones</span>
          </div>

          <div className="p-5 rounded-3xl glass-card border border-white/5 space-y-2">
            <span className="text-xs text-slate-400 font-medium">Total Accumulated</span>
            <div className="text-2xl font-extrabold text-brand-emerald font-mono">
              {formatCurrency(totalSaved)}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Remaining: {formatCurrency(Math.max(totalTarget - totalSaved, 0))}
            </span>
          </div>

          <div className="sm:col-span-2 p-5 rounded-3xl glass-card border border-brand-indigo/20 space-y-2 bg-gradient-to-r from-brand-indigo/10 to-transparent">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-sky">
              <Sparkles className="w-4 h-4" />
              <span>Algorithmic Goal Optimization</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your monthly surplus from your financial profile, our pace calculator computes whether each goal is on track before its target deadline.
            </p>
          </div>
        </div>
      </div>

      {/* 2. GOALS CARDS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white">Active Goals Tracker</h3>
          <span className="text-xs text-slate-500 font-mono">({goals.length} total)</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-indigo" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12 space-y-2 glass-card rounded-3xl border border-white/5 p-8">
            <Target className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Wealth Goals Created</h4>
            <p className="text-xs text-slate-400">Click "Create Wealth Goal" to start tracking your milestone targets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal) => {
              const pct = goal.progressPercentage || 0;
              const isCompleted = goal.status === 'completed' || pct >= 100;
              const remaining = goal.remainingAmount ?? Math.max(goal.targetAmount - goal.currentAmount, 0);

              return (
                <div
                  key={goal._id}
                  className="p-5 rounded-3xl glass-card border border-white/5 hover:border-brand-indigo/40 transition-all flex flex-col justify-between space-y-4 shadow-card-glass group"
                >
                  <div>
                    {/* Header with Title and Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-brand-sky transition-colors">
                          {goal.name}
                        </h4>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {goal.category?.replace('_', ' ')} • {goal.priority} priority
                        </span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30'
                            : 'text-brand-sky bg-brand-sky/10 border-brand-sky/30'
                        }`}
                      >
                        {goal.status}
                      </span>
                    </div>

                    {/* Target & Saved Readout */}
                    <div className="flex items-baseline justify-between mt-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                          Saved
                        </span>
                        <span className="text-lg font-bold font-mono text-white">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                          Target
                        </span>
                        <span className="text-sm font-bold font-mono text-slate-300">
                          {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-brand-sky font-bold">{pct.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-brand-sky transition-all duration-700 shadow-glow-indigo"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target Date & Actions footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Target: {formatDate(goal.targetDate)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-coral hover:bg-brand-coral/10"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <GoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        goal={selectedGoal}
        onSaved={fetchGoals}
      />
    </div>
  );
};
