import React, { useState, useEffect } from 'react';
import { financialHealthApi } from '../api/financialHealthApi';
import { useAuth } from '../context/AuthContext';
import {
  formatCurrency,
  formatPercent,
  getHealthScoreMeta,
} from '../utils/formatters';
import {
  HeartPulse,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Target,
  DollarSign,
  Loader2,
  Edit3,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const FinancialHealthPage = () => {
  const { openFinancialProfileModal } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await financialHealthApi.getFinancialHealth();
      if (res?.data) {
        setHealthData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch financial health metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-emerald animate-spin" />
        <span className="text-sm font-mono text-slate-400">
          Calculating StormBreaker Financial Health Score...
        </span>
      </div>
    );
  }

  const score = healthData?.healthScore ?? 65;
  const scoreMeta = getHealthScoreMeta(score);
  const income = healthData?.income?.monthly ?? 0;
  const expenses = healthData?.expenses?.monthly ?? 0;
  const surplus = healthData?.savings?.monthlySurplus ?? 0;
  const savingsRate = healthData?.savings?.savingsRate ?? 0;
  const debt = healthData?.debt?.totalDebt ?? 0;
  const debtRatio = healthData?.debt?.debtToIncomeRatio ?? 0;
  const emergencyFund = healthData?.emergencyFund?.amount ?? 0;
  const emergencyMonths = healthData?.emergencyFund?.coverageMonths ?? 0;
  const activeGoals = healthData?.goals?.activeGoals ?? 0;
  const goalProgress = healthData?.goals?.overallProgress ?? 0;

  return (
    <div className="space-y-8 py-4">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 text-brand-emerald shadow-glow-emerald">
              <HeartPulse className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Financial Health Intelligence
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Proprietary algorithmic wellness diagnostic computed by Backend 1 based on your income, expenses, and reserves.
          </p>
        </div>

        <button
          onClick={openFinancialProfileModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/5 border border-white/10 hover:border-brand-emerald/40 hover:bg-white/10 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4 text-brand-emerald" />
          <span>Edit Financial Parameters</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* 2. HERO HEALTH SCORE BANNER */}
      <div className="rounded-3xl glass-card border border-brand-emerald/30 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-emerald/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Radial Score Card (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-background-darker/80 border border-white/10 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              StormBreaker Financial Health Score
            </span>

            {/* Glowing Big Score */}
            <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white/[0.02] border-4 border-brand-emerald/30 shadow-glow-emerald">
              <span className={`text-5xl sm:text-6xl font-black font-mono tracking-tight ${scoreMeta.color}`}>
                {score}
              </span>
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40">
                {scoreMeta.status} Rating
              </span>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed pt-1">
                {scoreMeta.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Diagnostic Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Savings Rate</span>
                <Zap className="w-3.5 h-3.5 text-brand-cyan" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatPercent(savingsRate, false)}
              </div>
              <span className="text-[11px] text-slate-500">
                Monthly Surplus: {formatCurrency(surplus)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Emergency Cushion</span>
                <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {emergencyMonths.toFixed(1)} <span className="text-sm font-sans font-normal text-slate-400">Months</span>
              </div>
              <span className="text-[11px] text-slate-500">
                Fund Reserve: {formatCurrency(emergencyFund)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Debt-to-Income</span>
                <AlertTriangle className="w-3.5 h-3.5 text-brand-amber" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatPercent(debtRatio, false)}
              </div>
              <span className="text-[11px] text-slate-500">
                Outstanding Debt: {formatCurrency(debt)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Goal Milestone Progress</span>
                <Target className="w-3.5 h-3.5 text-brand-purple" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">
                {formatPercent(goalProgress, false)}
              </div>
              <span className="text-[11px] text-slate-500">
                {activeGoals} Active Goals Tracked
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILED METHODOLOGY & BREAKDOWN */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Info className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-base font-bold text-white">Score Calculation Methodology</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="font-bold text-brand-cyan uppercase tracking-wider block">
              1. Savings Rate (30 pts)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Target &gt; 20% of monthly income saved after all essential and discretionary outflows.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="font-bold text-brand-emerald uppercase tracking-wider block">
              2. Emergency Fund (25 pts)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Target 3 to 6 months of mandatory living expenses kept in liquid, low-risk accounts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="font-bold text-brand-amber uppercase tracking-wider block">
              3. Debt Ratio (20 pts)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Debt burden kept below 20% to 40% of total recurring monthly gross inflow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="font-bold text-brand-purple uppercase tracking-wider block">
              4. Goal Momentum (15 pts)
            </span>
            <p className="text-slate-400 leading-relaxed">
              Cumulative progress towards stated long-term investment and lifestyle targets.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-slate-400">
          <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Disclaimer:</strong> The StormBreaker Financial Health Score is an automated educational wellness rating calculated by Backend 1 and does not represent a standardized scientific credit score or guaranteed wealth advice.
          </span>
        </div>
      </div>
    </div>
  );
};
