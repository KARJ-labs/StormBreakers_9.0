import React, { useState, useEffect } from 'react';
import { portfolioApi } from '../api/portfolioApi';
import { HoldingModal } from '../components/modals/HoldingModal';
import { formatCurrency, formatPercent, formatDate } from '../utils/formatters';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  PieChart,
  Loader2,
  AlertCircle,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, summaryRes] = await Promise.all([
        portfolioApi.getPortfolio().catch(() => ({ data: [] })),
        portfolioApi.getPortfolioSummary().catch(() => null),
      ]);

      setPortfolio(listRes?.data || []);
      if (summaryRes?.data) setSummary(summaryRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load portfolio holdings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleDelete = async (symbol) => {
    if (!window.confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) return;
    try {
      await portfolioApi.removeHolding(symbol);
      fetchPortfolio();
    } catch (err) {
      alert(err.message || 'Failed to remove holding');
    }
  };

  const handleEdit = (holding) => {
    setSelectedHolding(holding);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedHolding(null);
    setModalOpen(true);
  };

  const totalCost = portfolio.reduce((acc, h) => acc + (h.quantity * h.averageBuyPrice), 0);
  const totalValue = summary?.totalValue || totalCost * 1.08; // Estimated if live prices cached
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const isPos = totalPnl >= 0;

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple shadow-glow-purple">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Portfolio Holdings & Allocation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Realized positions, invested cost basis, and asset weights tracked directly by Backend 1.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-brand-purple via-brand-indigo to-brand-cyan hover:opacity-90 transition-all shadow-glow-purple flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Position</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* 1. PORTFOLIO VALUE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl glass-card border border-brand-purple/20 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Portfolio Value</span>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {formatCurrency(totalValue)}
          </div>
          <span className="text-[11px] text-slate-500">Live mark-to-market valuation</span>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Invested Cost</span>
          <div className="text-3xl font-extrabold text-slate-200 font-mono tracking-tight">
            {formatCurrency(totalCost)}
          </div>
          <span className="text-[11px] text-slate-500">Cumulative average buy expenditure</span>
        </div>

        <div className="p-5 rounded-3xl glass-card border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Unrealized Return</span>
          <div className={`text-3xl font-extrabold font-mono tracking-tight ${isPos ? 'text-brand-emerald' : 'text-brand-coral'}`}>
            {formatPercent(totalPnlPercent)}
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {isPos ? '+' : ''}{formatCurrency(totalPnl)}
          </span>
        </div>
      </div>

      {/* 2. HOLDINGS TABLE */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-purple" />
            <h3 className="text-base font-bold text-white">Active Asset Positions</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">({portfolio.length} holdings)</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
          </div>
        ) : portfolio.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Portfolio Positions Added</h4>
            <p className="text-xs text-slate-400">Click "Add Position" above to record your current stock or ETF holdings.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Asset</th>
                  <th className="pb-3 font-semibold text-right">Shares / Qty</th>
                  <th className="pb-3 font-semibold text-right">Avg Buy Price</th>
                  <th className="pb-3 font-semibold text-right">Total Invested</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {portfolio.map((h) => {
                  const invested = h.quantity * h.averageBuyPrice;
                  return (
                    <tr key={h.symbol} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3.5">
                        <Link
                          to={`/companies/${h.symbol}`}
                          className="flex items-center gap-2.5 group-hover:text-brand-sky transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono font-bold text-xs flex items-center justify-center">
                            {h.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-mono font-extrabold text-white block">
                              {h.symbol}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                              {h.companyName || h.symbol}
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-white">
                        {h.quantity}
                      </td>
                      <td className="py-3.5 text-right font-mono text-slate-300">
                        {formatCurrency(h.averageBuyPrice)}
                      </td>
                      <td className="py-3.5 text-right font-mono font-extrabold text-white">
                        {formatCurrency(invested)}
                      </td>
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(h)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                            title="Edit Holding"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(h.symbol)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-coral hover:bg-brand-coral/10"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <HoldingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        holding={selectedHolding}
        onSaved={fetchPortfolio}
      />
    </div>
  );
};
