import React, { useState, useEffect } from 'react';
import { interestApi } from '../api/interestApi';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Bookmark,
  Building2,
  ExternalLink,
  Trash2,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const InterestsPage = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interestApi.getInterests();
      setInterests(res?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch saved interests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleDelete = async (symbol) => {
    if (!window.confirm(`Remove ${symbol} from your saved interests?`)) return;
    try {
      await interestApi.deleteInterest(symbol);
      fetchInterests();
    } catch (err) {
      alert(err.message || 'Failed to remove interest');
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-amber/10 border border-brand-amber/30 text-brand-amber shadow-glow-coral">
              <Bookmark className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Investment Interests
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Companies where you initiated "Proceed to Invest" research and broker execution.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
          {error}
        </div>
      )}

      {/* Interests Grid */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-base font-bold text-white">Tracked Companies</h3>
          <span className="text-xs text-slate-500 font-mono">({interests.length} saved)</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-brand-amber" />
          </div>
        ) : interests.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Saved Interests Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              When you explore companies and click "Proceed to Invest", they will be recorded here for rapid revisit and monitoring.
            </p>
            <Link
              to="/market"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan"
            >
              <span>Explore Companies</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map((item) => (
              <div
                key={item.symbol}
                className="p-5 rounded-3xl glass-card border border-white/5 hover:border-brand-amber/40 transition-all flex flex-col justify-between space-y-4 shadow-card-glass group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-brand-amber/10 border border-brand-amber/20 flex items-center justify-center font-bold text-xs text-brand-amber font-mono">
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <span className="font-mono font-extrabold text-sm text-white block group-hover:text-brand-amber transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate max-w-[140px]">
                          {item.companyName}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(item.symbol)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-brand-coral hover:bg-brand-coral/10"
                      title="Remove from Interests"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Destination:</span>
                      <span className="text-slate-200 font-medium">{item.destinationPlatform}</span>
                    </div>
                    {item.createdAt && (
                      <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                        <span>Recorded:</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  to={`/companies/${item.symbol}`}
                  className="w-full py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-brand-amber/30 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Revisit Smart Analysis</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
