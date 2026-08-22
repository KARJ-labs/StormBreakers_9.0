import React, { useState, useEffect } from 'react';
import { investmentApi } from '../../api/investmentApi';
import { X, Briefcase, Loader2, CheckCircle2 } from 'lucide-react';

const INVESTMENT_TYPES = [
  { value: 'STOCK', label: 'Stock / Equity' },
  { value: 'ETF', label: 'ETF (Exchange Traded Fund)' },
  { value: 'MUTUAL_FUND', label: 'Mutual Fund' },
  { value: 'SIP', label: 'Systematic Investment Plan (SIP)' },
  { value: 'OTHER', label: 'Other Asset' },
];

export const InvestmentModal = ({ isOpen, onClose, investment = null, onSaved }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    investmentType: 'STOCK',
    quantity: '',
    averageBuyPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (investment) {
      setFormData({
        symbol: investment.symbol || '',
        companyName: investment.companyName || '',
        investmentType: investment.investmentType || 'STOCK',
        quantity: investment.quantity || '',
        averageBuyPrice: investment.averageBuyPrice || '',
        purchaseDate: investment.purchaseDate ? new Date(investment.purchaseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: investment.notes || '',
      });
    } else {
      setFormData({
        symbol: '',
        companyName: '',
        investmentType: 'STOCK',
        quantity: '',
        averageBuyPrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [investment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        symbol: formData.symbol.trim().toUpperCase(),
        companyName: formData.companyName.trim() || formData.symbol.trim().toUpperCase(),
        investmentType: formData.investmentType,
        quantity: Number(formData.quantity),
        averageBuyPrice: Number(formData.averageBuyPrice),
        purchaseDate: new Date(formData.purchaseDate).toISOString(),
        notes: formData.notes,
      };

      if (investment?._id) {
        await investmentApi.updateInvestment(investment._id, payload);
      } else {
        await investmentApi.createInvestment(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl glass-card border border-border-subtle bg-background-darker/95 p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Briefcase className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">
            {investment ? 'Edit Investment' : 'Log Investment Entry'}
          </h3>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Symbol *
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL, NVDA"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Asset Type *
              </label>
              <select
                value={formData.investmentType}
                onChange={(e) => setFormData({ ...formData, investmentType: e.target.value })}
                className="w-full bg-background-darker border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              >
                {INVESTMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Company / Fund Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Apple Inc. or Vanguard S&P 500"
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="any"
                min="0.000001"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="10"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Avg Buy Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.averageBuyPrice}
                onChange={(e) => setFormData({ ...formData, averageBuyPrice: e.target.value })}
                placeholder="150.00"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Purchase Date *
              </label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notes
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="SIP installment / Dip buy"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-cyan to-brand-sky hover:opacity-90 transition-all shadow-glow-cyan flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{investment ? 'Update Investment' : 'Save Investment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
