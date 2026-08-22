import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  UserCheck,
  DollarSign,
  Shield,
  Target,
  Clock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const FinancialProfileModal = ({ isOpen, onClose, onSuccess }) => {
  const { financialProfile, saveFinancialProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    monthlyIncome: 5000,
    monthlyEssentialExpenses: 2000,
    monthlyDiscretionaryExpenses: 800,
    currentSavings: 15000,
    emergencyFund: 10000,
    existingInvestments: 25000,
    totalDebt: 5000,
    investmentAmount: 1000,
    investmentHorizon: 'medium',
    riskTolerance: 'moderate',
    investmentObjective: 'Wealth Growth & Retirement Planning',
  });

  useEffect(() => {
    if (financialProfile) {
      setFormData({
        monthlyIncome: financialProfile.monthlyIncome ?? 5000,
        monthlyEssentialExpenses: financialProfile.monthlyEssentialExpenses ?? 2000,
        monthlyDiscretionaryExpenses: financialProfile.monthlyDiscretionaryExpenses ?? 800,
        currentSavings: financialProfile.currentSavings ?? 15000,
        emergencyFund: financialProfile.emergencyFund ?? 10000,
        existingInvestments: financialProfile.existingInvestments ?? 25000,
        totalDebt: financialProfile.totalDebt ?? 5000,
        investmentAmount: financialProfile.investmentAmount ?? 1000,
        investmentHorizon: financialProfile.investmentHorizon ?? 'medium',
        riskTolerance: financialProfile.riskTolerance ?? 'moderate',
        investmentObjective: financialProfile.investmentObjective ?? 'Wealth Growth & Retirement Planning',
      });
    }
  }, [financialProfile]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await saveFinancialProfile({
        ...formData,
        monthlyIncome: Number(formData.monthlyIncome),
        monthlyEssentialExpenses: Number(formData.monthlyEssentialExpenses),
        monthlyDiscretionaryExpenses: Number(formData.monthlyDiscretionaryExpenses),
        currentSavings: Number(formData.currentSavings),
        emergencyFund: Number(formData.emergencyFund),
        existingInvestments: Number(formData.existingInvestments),
        totalDebt: Number(formData.totalDebt),
        investmentAmount: Number(formData.investmentAmount),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save financial profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl glass-card border border-border-subtle bg-background-darker/95 p-6 space-y-6 shadow-2xl relative my-8 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-glow-cyan">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {financialProfile ? 'Update Financial Profile' : 'Complete Financial Profile'}
            </h3>
            <p className="text-xs text-slate-400">
              Required by Backend 1 for calculating your Financial Health Score and Company Suitability
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Income & Cashflow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan">
              1. Monthly Cashflow & Expenses
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.monthlyIncome}
                  onChange={(e) => handleChange('monthlyIncome', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Essential Expenses ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.monthlyEssentialExpenses}
                  onChange={(e) => handleChange('monthlyEssentialExpenses', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Discretionary Spend ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.monthlyDiscretionaryExpenses}
                  onChange={(e) => handleChange('monthlyDiscretionaryExpenses', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Reserves & Liabilities */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-emerald">
              2. Assets, Reserves & Liabilities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Current Savings ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.currentSavings}
                  onChange={(e) => handleChange('currentSavings', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Emergency Fund ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.emergencyFund}
                  onChange={(e) => handleChange('emergencyFund', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Existing Investments ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.existingInvestments}
                  onChange={(e) => handleChange('existingInvestments', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-emerald"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Total Outstanding Debt ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.totalDebt}
                  onChange={(e) => handleChange('totalDebt', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-coral"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Risk & Horizon */}
          <div className="space-y-3 pt-2 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-purple">
              3. Investment Strategy & Risk Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Risk Tolerance
                </label>
                <select
                  value={formData.riskTolerance}
                  onChange={(e) => handleChange('riskTolerance', e.target.value)}
                  className="w-full bg-background-darker border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="low">Low (Conservative)</option>
                  <option value="moderate">Moderate (Balanced)</option>
                  <option value="high">High (Growth / Aggressive)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Investment Horizon
                </label>
                <select
                  value={formData.investmentHorizon}
                  onChange={(e) => handleChange('investmentHorizon', e.target.value)}
                  className="w-full bg-background-darker border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="short">Short Term (&lt; 2 yrs)</option>
                  <option value="medium">Medium Term (2 - 7 yrs)</option>
                  <option value="long">Long Term (&gt; 7 yrs)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Monthly Allocatable ($)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.investmentAmount}
                  onChange={(e) => handleChange('investmentAmount', e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Primary Wealth Objective
              </label>
              <input
                type="text"
                value={formData.investmentObjective}
                onChange={(e) => handleChange('investmentObjective', e.target.value)}
                placeholder="E.g., Retirement fund, Home down payment, Long-term compounding"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-cyan to-brand-sky hover:opacity-90 transition-all shadow-glow-cyan flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Save Financial Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
