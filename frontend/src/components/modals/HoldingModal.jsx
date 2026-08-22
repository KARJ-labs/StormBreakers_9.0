import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../../api/portfolioApi';
import { X, Layers, Loader2, CheckCircle2 } from 'lucide-react';

export const HoldingModal = ({ isOpen, onClose, holding = null, onSaved }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    quantity: '',
    averageBuyPrice: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (holding) {
      setFormData({
        symbol: holding.symbol || '',
        companyName: holding.companyName || '',
        quantity: holding.quantity || '',
        averageBuyPrice: holding.averageBuyPrice || '',
      });
    } else {
      setFormData({
        symbol: '',
        companyName: '',
        quantity: '',
        averageBuyPrice: '',
      });
    }
  }, [holding, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        symbol: formData.symbol.trim().toUpperCase(),
        companyName: formData.companyName.trim() || formData.symbol.trim().toUpperCase(),
        quantity: Number(formData.quantity),
        averageBuyPrice: Number(formData.averageBuyPrice),
      };

      if (holding?.symbol) {
        await portfolioApi.updateHolding(holding.symbol, payload);
      } else {
        await portfolioApi.addHolding(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save holding');
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
          <div className="w-9 h-9 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-white">
            {holding ? 'Edit Portfolio Position' : 'Add Portfolio Position'}
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
                Ticker Symbol *
              </label>
              <input
                type="text"
                required
                disabled={!!holding}
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL, NVDA, RELIANCE"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-mono uppercase disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Apple Inc."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Quantity / Shares *
              </label>
              <input
                type="number"
                step="any"
                min="0.000001"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="10"
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-mono"
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
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-purple font-mono"
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
              className="px-5 py-2 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple to-brand-indigo hover:opacity-90 transition-all shadow-glow-purple flex items-center gap-1.5"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{holding ? 'Update Holding' : 'Add Holding'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
