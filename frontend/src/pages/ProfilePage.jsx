import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Edit3,
  HeartPulse,
  DollarSign,
  Briefcase,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, financialProfile, hasFinancialProfile, openFinancialProfileModal } = useAuth();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan shadow-glow-cyan">
              <User className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Investor Profile & Configuration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your account credentials and personal financial telemetry context.
          </p>
        </div>

        <button
          onClick={openFinancialProfileModal}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-blue hover:opacity-90 transition-all shadow-glow-cyan flex items-center gap-2 self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>{hasFinancialProfile ? 'Edit Financial Profile' : 'Setup Financial Profile'}</span>
        </button>
      </div>

      {/* 1. USER ACCOUNT INFO CARD */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
          {user?.profile_picture && !imgError ? (
            <img
              src={user.profile_picture}
              alt={user.name || 'User'}
              onError={() => setImgError(true)}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-cyan/40 shadow-glow-cyan"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-purple p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-background-darker rounded-[14px] flex items-center justify-center font-extrabold text-xl text-white font-mono">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {user?.name || 'Investor'}
              </h3>
              {user?.is_verified && (
                <span className="px-2 py-0.5 rounded-md bg-brand-emerald/10 text-brand-emerald text-[10px] font-bold border border-brand-emerald/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono block mt-0.5">
              Auth Provider: <strong className="text-brand-sky capitalize">{user?.auth_provider || 'Local Account'}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Email Address</span>
            </div>
            <span className="text-sm font-semibold text-white font-mono block truncate">
              {user?.email || 'N/A'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone className="w-3.5 h-3.5 text-brand-purple" />
              <span>Phone Number</span>
            </div>
            <span className="text-sm font-semibold text-white font-mono block">
              {user?.phonenumber || 'N/A'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Security Status</span>
            </div>
            <span className="text-sm font-semibold text-brand-emerald block">
              {user?.auth_provider === 'google' ? 'Google OAuth 2.0 Linked' : 'Password Protected'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. STORED FINANCIAL PROFILE PARAMETERS */}
      <div className="rounded-3xl glass-card border border-brand-indigo/30 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-brand-indigo" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Stored Financial Profile
            </h3>
          </div>
          <span className="text-xs font-mono text-brand-sky font-bold px-2.5 py-0.5 rounded-full bg-brand-indigo/10 border border-brand-indigo/30">
            Backend 1 Synchronized
          </span>
        </div>

        {hasFinancialProfile && financialProfile ? (
          <div className="space-y-6">
            {/* Cashflow & Outflows */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
                Cashflow & Outflows
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Monthly Income</span>
                  <span className="text-xl font-bold font-mono text-white mt-1 block">
                    {formatCurrency(financialProfile.monthlyIncome)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Essential Expenses</span>
                  <span className="text-xl font-bold font-mono text-slate-300 mt-1 block">
                    {formatCurrency(financialProfile.monthlyEssentialExpenses)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Discretionary Spend</span>
                  <span className="text-xl font-bold font-mono text-slate-300 mt-1 block">
                    {formatCurrency(financialProfile.monthlyDiscretionaryExpenses)}
                  </span>
                </div>
              </div>
            </div>

            {/* Assets & Debt */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
                Reserves & Balance Sheet
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Current Savings</span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block">
                    {formatCurrency(financialProfile.currentSavings)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Emergency Fund</span>
                  <span className="text-lg font-bold font-mono text-brand-emerald mt-1 block">
                    {formatCurrency(financialProfile.emergencyFund)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Existing Investments</span>
                  <span className="text-lg font-bold font-mono text-brand-sky mt-1 block">
                    {formatCurrency(financialProfile.existingInvestments)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Total Debt Burden</span>
                  <span className="text-lg font-bold font-mono text-brand-coral mt-1 block">
                    {formatCurrency(financialProfile.totalDebt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Strategy & Horizon */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Strategy & Objective
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Risk Tolerance</span>
                  <span className="text-base font-bold font-mono text-white capitalize mt-1 block">
                    {financialProfile.riskTolerance || 'Moderate'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Investment Horizon</span>
                  <span className="text-base font-bold font-mono text-white capitalize mt-1 block">
                    {financialProfile.investmentHorizon || 'Medium'} Term
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs text-slate-400 font-medium block">Monthly Investment Target</span>
                  <span className="text-base font-bold font-mono text-brand-purple mt-1 block">
                    {formatCurrency(financialProfile.investmentAmount)} / mo
                  </span>
                </div>
              </div>

              {financialProfile.investmentObjective && (
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 block mb-1">Primary Wealth Objective:</span>
                  <p>{financialProfile.investmentObjective}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <HeartPulse className="w-10 h-10 text-brand-indigo mx-auto" />
            <h4 className="text-sm font-bold text-white">No Financial Profile Recorded</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Setting up your income, expense and debt parameters unlocks personalized suitability scores and allows the Company Smart Analyzer to function.
            </p>
            <button
              onClick={openFinancialProfileModal}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-brand-cyan shadow-glow-cyan"
            >
              Setup Profile Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
