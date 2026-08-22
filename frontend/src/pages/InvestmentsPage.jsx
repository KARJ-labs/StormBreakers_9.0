import React, { useState, useEffect } from 'react';
import { investmentApi } from '../api/investmentApi';
import { InvestmentModal } from '../components/modals/InvestmentModal';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Building2,
  Loader2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  const fetchInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await investmentApi.getInvestments();
      setInvestments(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch investment records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this investment record?')) return;
    try {
      await investmentApi.deleteInvestment(id);
      fetchInvestments();
    } catch (err) {
      alert(err.message || 'Failed to delete investment');
    }
  };

  const handleEdit = (inv) => {
    setSelectedInvestment(inv);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedInvestment(null);
    setModalOpen(true);
  };

  const totalInvested = investments.reduce((acc, i) => acc + (i.investedAmount || i.quantity * i.averageBuyPrice), 0);

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan shadow-glow-cyan">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Investment Logs & Trades
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical buy transactions across Stocks, ETFs, SIPs, and Mutual Funds.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-blue hover:opacity-90 transition-all shadow-glow-cyan flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Trade</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* Metric Banner */}
      <div className="p-6 rounded-3xl glass-card border border-brand-cyan/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Cumulative Capital Deployed</span>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
            {formatCurrency(totalInvested)}
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {investments.length} Total Recorded Positions
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white">Investment Entries</h3>
          <span className="text-xs text-slate-500 font-mono">({investments.length} total)</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-cyan" />
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Briefcase className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Investments Logged</h4>
            <p className="text-xs text-slate-400">Click "Record Trade" above to log your investment purchases.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="pb-3 font-semibold">Asset / Symbol</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold text-right">Shares</th>
                  <th className="pb-3 font-semibold text-right">Avg Price</th>
                  <th className="pb-3 font-semibold text-right">Total Cost</th>
                  <th className="pb-3 font-semibold">Purchase Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {investments.map((inv) => (
                  <tr key={inv._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3.5">
                      <Link
                        to={`/companies/${inv.symbol}`}
                        className="flex items-center gap-2 group-hover:text-brand-cyan transition-colors"
                      >
                        <span className="font-mono font-extrabold text-white">{inv.symbol}</span>
                        <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                          {inv.companyName}
                        </span>
                      </Link>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-mono text-[10px] uppercase border border-white/5">
                        {inv.investmentType}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono font-bold text-white">
                      {inv.quantity}
                    </td>
                    <td className="py-3.5 text-right font-mono text-slate-300">
                      {formatCurrency(inv.averageBuyPrice)}
                    </td>
                    <td className="py-3.5 text-right font-mono font-extrabold text-white">
                      {formatCurrency(inv.investedAmount || inv.quantity * inv.averageBuyPrice)}
                    </td>
                    <td className="py-3.5 text-slate-400 font-mono text-[11px]">
                      {formatDate(inv.purchaseDate)}
                    </td>
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(inv._id)}
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
      <InvestmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        investment={selectedInvestment}
        onSaved={fetchInvestments}
      />
    </div>
  );
};
