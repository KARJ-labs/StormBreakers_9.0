import React, { useState } from 'react';
import { interestApi } from '../../api/interestApi';
import { useAuth } from '../../context/AuthContext';
import {
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ProceedToInvestModal = ({ isOpen, onClose, company = {} }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const handleProceed = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Record user interest in Backend 1
      await interestApi.createInterest({
        symbol: company.symbol,
        companyName: company.name || company.symbol,
        destinationPlatform: 'External Broker Partner',
      });
      setSaved(true);

      // 2. Prepare redirect
      setTimeout(() => {
        // External trading broker destination URL
        // TODO: Replace with live external platform broker link when provided
        window.open(
          `https://finance.yahoo.com/quote/${company.symbol}`,
          '_blank',
          'noopener,noreferrer'
        );
        onClose();
        setSaved(false);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to log investment intent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl glass-card border border-border-subtle bg-background-darker/95 p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-glow-emerald">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Proceed to Invest in {company.name || company.symbol}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Ticker: {company.symbol}
            </span>
          </div>
        </div>

        {/* Educational Confirmation Notice */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-brand-amber font-semibold">
            <AlertTriangle className="w-4 h-4" />
            <span>Leaving StormBreakers Platform</span>
          </div>
          <p className="leading-relaxed">
            You are transitioning from StormBreakers analysis engine to an authorized external trading execution platform. StormBreakers does not hold custody of funds or execute trades.
          </p>
          <p className="text-slate-400">
            This company will be saved to your <strong className="text-white">My Interests</strong> portfolio tracker so you can monitor your research history.
          </p>
        </div>

        {/* Error notice */}
        {error && (
          <div className="p-3 rounded-xl bg-brand-coral/10 border border-brand-coral/30 text-xs text-brand-coral">
            {error}
          </div>
        )}

        {/* Success Confirmation State */}
        {saved ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2 text-center text-brand-emerald">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
            <span className="font-bold text-sm">Interest Recorded! Opening External Broker...</span>
          </div>
        ) : (
          /* Action Buttons */
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceed}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-brand-emerald to-brand-mint hover:opacity-90 transition-all shadow-glow-emerald flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging Intent...</span>
                </>
              ) : (
                <>
                  <span>Continue to External Platform</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
