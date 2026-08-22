import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/dashboardApi';
import { financialHealthApi } from '../api/financialHealthApi';
import { expenseApi } from '../api/expenseApi';
import { goalApi } from '../api/goalApi';
import { marketApi } from '../api/marketApi';
import { SpeedometerGauge } from '../components/charts/SpeedometerGauge';
import { CircularProgressWheel } from '../components/charts/CircularProgressWheel';
import {
  formatCurrency,
  formatPercent,
  getHealthScoreMeta,
} from '../utils/formatters';
import {
  LayoutDashboard,
  HeartPulse,
  Receipt,
  Target,
  TrendingUp,
  Compass,
  ArrowUpRight,
  Plus,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, hasFinancialProfile, openFinancialProfileModal } = useAuth();
  const [healthData, setHealthData] = useState(null);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [goals, setGoals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [healthRes, expenseRes, goalsRes, trendingRes] = await Promise.all([
        financialHealthApi.getFinancialHealth().catch(() => null),
        expenseApi.getExpenseSummary('monthly').catch(() => null),
        goalApi.getGoals({ limit: 5 }).catch(() => ({ data: [] })),
        marketApi.getTrending().catch(() => ({ data: [] })),
      ]);

      if (healthRes?.data) setHealthData(healthRes.data);
      if (expenseRes?.data) setExpenseSummary(expenseRes.data);
      if (goalsRes?.data) setGoals(goalsRes.data);
      if (trendingRes?.data) setTrending(trendingRes.data.slice(0, 5));
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-cyan animate-spin" />
        <span className="text-sm font-mono text-slate-400">Loading your wealth intelligence overview...</span>
      </div>
    );
  }

  const scoreMeta = getHealthScoreMeta(healthData?.healthScore ?? 65);
  const monthlyIncome = healthData?.income?.monthly || 5000;
  const totalSpent = expenseSummary?.totalSpending || healthData?.expenses?.monthly || 1800;
  const budgetLimit = monthlyIncome;

  return (
    <div className="space-y-8 py-4">
      {/* 1. WELCOME BANNER & HEALTH SCORE OVERVIEW */}
      <div className="rounded-3xl glass-card border border-brand-cyan/20 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {user?.profile_picture && !imgError ? (
              <img
                src={user.profile_picture}
                alt={user.name || 'User'}
                onError={() => setImgError(true)}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-cyan/40 shadow-glow-cyan flex-shrink-0 mt-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-purple p-0.5 shadow-glow-cyan flex-shrink-0 mt-1">
                <div className="w-full h-full bg-background-darker rounded-[14px] flex items-center justify-center font-extrabold text-xl text-white font-mono">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Live Financial Telemetry
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Hello, {user?.name || 'Investor'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                {scoreMeta.description}
              </p>
            </div>
          </div>

          {/* Health Score Summary Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-background-darker/80 border border-white/10 shadow-card-glass self-start md:self-auto flex-shrink-0">
            <div className="flex flex-col items-center text-center px-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Health Score
              </span>
              <span className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${scoreMeta.color}`}>
                {healthData?.healthScore ?? 65}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                {scoreMeta.status}
              </span>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <Link
              to="/financial-health"
              className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>Score Details</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. THREE-PILLAR REFLOWABLE CARDS GRID (RESPONSIVE ACROSS IPAD, LAPTOP, DESKTOP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Pillar 1: Monthly Budget Gauge */}
        <div className="rounded-3xl glass-card border border-brand-emerald/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-emerald/40 transition-all shadow-card-glass">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-emerald" />
              <h3 className="text-sm font-bold text-white">Monthly Cashflow</h3>
            </div>
            <Link to="/expenses" className="text-xs text-brand-emerald hover:underline font-semibold">
              Manage
            </Link>
          </div>
          <div className="flex justify-center w-full">
            <SpeedometerGauge spent={totalSpent} limit={budgetLimit} />
          </div>
        </div>

        {/* Pillar 2: Active Goals Radial */}
        <div className="rounded-3xl glass-card border border-brand-indigo/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-indigo/40 transition-all shadow-card-glass">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-indigo" />
              <h3 className="text-sm font-bold text-white">Wealth Goals</h3>
            </div>
            <Link to="/goals" className="text-xs text-brand-indigo hover:underline font-semibold">
              All Goals
            </Link>
          </div>
          <div className="flex justify-center w-full">
            <CircularProgressWheel
              totalValue={goals.reduce((acc, g) => acc + (g.targetAmount || 0), 0) || 50000}
              items={
                goals.length > 0
                  ? goals.map((g) => ({
                      name: g.name,
                      amount: g.currentAmount,
                      percentage: g.progressPercentage,
                    }))
                  : [
                      { name: 'Emergency Fund', percentage: 40, amount: 10000 },
                      { name: 'Investments', percentage: 35, amount: 8750 },
                    ]
              }
            />
          </div>
        </div>

        {/* Pillar 3: Market Movers & Opportunities */}
        <div className="rounded-3xl glass-card border border-brand-purple/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-purple/40 transition-all shadow-card-glass md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple" />
              <h3 className="text-sm font-bold text-white">Market Radar</h3>
            </div>
            <Link to="/market" className="text-xs text-brand-purple hover:underline font-semibold">
              Explore
            </Link>
          </div>

          <div className="space-y-2.5">
            {trending.length > 0 ? (
              trending.map((t) => {
                const isPos = (t.changePercent || 0) >= 0;
                return (
                  <Link
                    key={t.symbol}
                    to={`/companies/${t.symbol}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{t.symbol}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-300 font-medium">
                        {formatCurrency(t.currentPrice)}
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          isPos ? 'text-brand-emerald' : 'text-brand-coral'
                        }`}
                      >
                        {formatPercent(t.changePercent)}
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-6 text-xs text-slate-500">
                Market telemetry initializing...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. QUICK NAV SHORTCUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/market"
          className="p-4 rounded-2xl glass-card border border-white/5 hover:border-brand-cyan/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-brand-cyan/10 text-brand-cyan">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-brand-cyan transition-colors">
              Market Explorer
            </span>
            <span className="text-[10px] text-slate-400">Search stocks & ETFs</span>
          </div>
        </Link>

        <Link
          to="/portfolio"
          className="p-4 rounded-2xl glass-card border border-white/5 hover:border-brand-purple/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-brand-purple/10 text-brand-purple">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-brand-purple transition-colors">
              My Portfolio
            </span>
            <span className="text-[10px] text-slate-400">Track asset holdings</span>
          </div>
        </Link>

        <Link
          to="/interests"
          className="p-4 rounded-2xl glass-card border border-white/5 hover:border-brand-amber/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-brand-amber/10 text-brand-amber">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-brand-amber transition-colors">
              My Interests
            </span>
            <span className="text-[10px] text-slate-400">Saved proceed actions</span>
          </div>
        </Link>

        <button
          onClick={openFinancialProfileModal}
          className="p-4 rounded-2xl glass-card border border-white/5 hover:border-brand-emerald/30 transition-all flex items-center gap-3 group text-left"
        >
          <div className="p-2.5 rounded-xl bg-brand-emerald/10 text-brand-emerald">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block group-hover:text-brand-emerald transition-colors">
              Profile Config
            </span>
            <span className="text-[10px] text-slate-400">Update income & debt</span>
          </div>
        </button>
      </div>
    </div>
  );
};
