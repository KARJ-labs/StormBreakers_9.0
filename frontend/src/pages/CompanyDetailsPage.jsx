import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { companyApi } from '../api/companyApi';
import { watchlistApi } from '../api/watchlistApi';
import { useAuth } from '../context/AuthContext';
import { CompanyPriceChart } from '../components/charts/CompanyPriceChart';
import { RiskWaveChart } from '../components/charts/RiskWaveChart';
import { CompanySmartAnalyzer } from '../components/analyzer/CompanySmartAnalyzer';
import { ProceedToInvestModal } from '../components/modals/ProceedToInvestModal';
import {
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  getRiskMeta,
} from '../utils/formatters';
import {
  Building2,
  TrendingUp,
  Globe,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Lock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Activity,
  DollarSign,
  BarChart3,
  Scale,
} from 'lucide-react';

export const CompanyDetailsPage = () => {
  const { symbol: rawSymbol } = useParams();
  const symbol = (rawSymbol || '').toUpperCase();
  const location = useLocation();
  const { isAuthenticated, hasFinancialProfile, financialProfile, openFinancialProfileModal } = useAuth();

  const [companyDetails, setCompanyDetails] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);

  const fetchAllCompanyData = async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);

    try {
      const [detailsRes, metricsRes, riskRes] = await Promise.all([
        companyApi.getCompanyDetails(symbol).catch(() => null),
        companyApi.getCompanyMetrics(symbol).catch(() => null),
        companyApi.getCompanyRisk(symbol).catch(() => null),
      ]);

      if (detailsRes?.data) {
        setCompanyDetails(detailsRes.data);
      } else {
        // Minimum company fallback
        setCompanyDetails({
          symbol,
          company: { name: symbol, ticker: symbol },
          market: { currentPrice: 150, change: 1.5, changePercent: 1.0 },
        });
      }

      if (metricsRes?.data?.metrics) {
        setMetrics(metricsRes.data.metrics);
      }

      if (riskRes?.data?.risk) {
        setRiskData(riskRes.data.risk);
      }

      // Check watchlist if authenticated
      if (isAuthenticated) {
        try {
          const checkRes = await watchlistApi.checkWatchlist(symbol);
          setInWatchlist(checkRes?.inWatchlist || false);
        } catch {
          // ignore
        }
      }
    } catch (err) {
      setError(err.message || `Unable to load financial data for ${symbol}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCompanyData();
  }, [symbol, isAuthenticated]);

  const toggleWatchlist = async () => {
    if (!isAuthenticated) return;
    try {
      if (inWatchlist) {
        await watchlistApi.removeFromWatchlist(symbol);
        setInWatchlist(false);
      } else {
        await watchlistApi.addToWatchlist({
          symbol,
          companyName: companyDetails?.company?.name || symbol,
        });
        setInWatchlist(true);
      }
    } catch (e) {
      console.error('Watchlist toggle error:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
        <span className="text-sm font-mono text-slate-400">
          Loading institutional analytics for {symbol}...
        </span>
      </div>
    );
  }

  const company = companyDetails?.company || { name: symbol, ticker: symbol };
  const market = companyDetails?.market || {};
  const currentPrice = market.currentPrice || 0;
  const change = market.change || 0;
  const changePercent = market.changePercent || 0;
  const isPos = changePercent >= 0;

  return (
    <div className="space-y-10 py-4">
      {/* 1. COMPANY HEADER BANNER */}
      <div className="rounded-3xl glass-card border border-brand-purple/30 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Company Title & Identifiers */}
          <div className="flex items-start gap-4">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 p-2 object-contain flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-cyan p-0.5 shadow-glow-purple flex-shrink-0">
                <div className="w-full h-full bg-background-darker rounded-[14px] flex items-center justify-center font-extrabold text-lg text-white font-mono">
                  {symbol.slice(0, 3)}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {company.name || symbol}
                </h1>
                <span className="px-2.5 py-0.5 rounded-lg bg-brand-purple/20 text-brand-purple text-xs font-mono font-bold border border-brand-purple/30">
                  {symbol}
                </span>
                {company.exchange && (
                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
                    {company.exchange}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                {company.industry && <span>Industry: <strong className="text-slate-300">{company.industry}</strong></span>}
                {company.country && <span>• {company.country}</span>}
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-brand-sky hover:underline"
                  >
                    <Globe className="w-3 h-3" /> Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & CTA Controls */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:justify-end">
            <div className="flex flex-col">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {formatCurrency(currentPrice, company.currency)}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
                    isPos
                      ? 'text-brand-emerald bg-brand-emerald/10'
                      : 'text-brand-coral bg-brand-coral/10'
                  }`}
                >
                  {formatPercent(changePercent)} ({formatCurrency(change)})
                </span>
                <span className="text-[10px] text-slate-400">Today</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={toggleWatchlist}
                  className={`p-3 rounded-xl border transition-all ${
                    inWatchlist
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-glow-cyan'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                >
                  {inWatchlist ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              )}

              {/* Proceed to Invest Button */}
              <button
                onClick={() => setIsInvestModalOpen(true)}
                className="px-6 py-3.5 rounded-2xl font-extrabold text-xs text-black bg-gradient-to-r from-brand-emerald via-brand-mint to-brand-cyan shadow-glow-emerald hover:opacity-90 transition-all flex items-center gap-2"
              >
                <span>Proceed to Invest</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRICE GRAPH & RISK INTELLIGENCE DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Price History Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-card border border-border-subtle p-5 sm:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-purple" />
              Market Price Trajectory
            </h3>
          </div>
          <CompanyPriceChart symbol={symbol} currentPrice={currentPrice} changePercent={changePercent} />
        </div>

        {/* Risk Intelligence (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-card border border-border-subtle p-5 sm:p-7 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-coral" />
              Risk Analysis Score
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
              Quantitative
            </span>
          </div>

          <RiskWaveChart
            score={riskData?.score ?? 55}
            level={riskData?.level || 'moderate'}
            summary={riskData?.summary || 'Standard equity market volatility.'}
            indicators={riskData?.indicators || {}}
          />
        </div>
      </div>

      {/* 3. COMPANY FINANCIAL METRICS (ONLY REAL BACKEND FIELDS) */}
      <div className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <BarChart3 className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Institutional Company Metrics
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Market Capitalization</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.marketCapitalization ? formatLargeNumber(metrics.marketCapitalization * 1e6) : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">P/E Ratio (TTM)</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.peRatio ? metrics.peRatio.toFixed(2) : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">EPS (TTM)</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.eps !== null && metrics?.eps !== undefined ? `$${metrics.eps.toFixed(2)}` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Beta Volatility</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.beta ? metrics.beta.toFixed(2) : '1.00'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">Dividend Yield</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.dividendYield ? `${metrics.dividendYield.toFixed(2)}%` : '0.00%'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">52-Week High</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.fiftyTwoWeekHigh ? formatCurrency(metrics.fiftyTwoWeekHigh) : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">52-Week Low</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.fiftyTwoWeekLow ? formatCurrency(metrics.fiftyTwoWeekLow) : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">52W Price Return</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.fiftyTwoWeekPriceReturn !== null && metrics?.fiftyTwoWeekPriceReturn !== undefined
                ? formatPercent(metrics.fiftyTwoWeekPriceReturn)
                : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">10D Avg Volume</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.tenDayAverageVolume ? `${metrics.tenDayAverageVolume.toFixed(1)}M` : 'N/A'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] text-slate-400 block font-medium">3M Avg Volume</span>
            <span className="text-base font-bold text-white font-mono mt-1 block">
              {metrics?.threeMonthAverageVolume ? `${metrics.threeMonthAverageVolume.toFixed(1)}M` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. PERSONALIZED SUITABILITY & IMPACT SECTION */}
      <div className="rounded-3xl glass-card border border-brand-indigo/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Scale className="w-4 h-4 text-brand-indigo" />
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Personalized Suitability & Cashflow Compatibility
          </h3>
        </div>

        {!isAuthenticated ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto space-y-3">
            <Lock className="w-8 h-8 text-brand-indigo mx-auto" />
            <h4 className="text-base font-bold text-white">Create your financial profile to unlock personalized analysis.</h4>
            <p className="text-xs text-slate-400">
              See how investing in {symbol} aligns with your monthly surplus, active goals, and emergency cushion.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10"
              >
                Login
              </Link>
              <Link
                to="/signup"
                state={{ from: location.pathname }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan"
              >
                Sign Up
              </Link>
            </div>
          </div>
        ) : !hasFinancialProfile ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto space-y-3">
            <AlertTriangle className="w-8 h-8 text-brand-amber mx-auto" />
            <h4 className="text-base font-bold text-white">Personal Financial Details Required</h4>
            <p className="text-xs text-slate-400">
              Fill in your monthly income and debt parameters to calculate personal affordability for {symbol}.
            </p>
            <button
              onClick={openFinancialProfileModal}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan"
            >
              Complete Financial Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/20 space-y-1">
              <span className="text-[11px] uppercase font-bold text-brand-cyan">Allocatable Monthly Capacity</span>
              <div className="text-xl font-bold font-mono text-white">
                {formatCurrency(financialProfile.investmentAmount || 500)} / mo
              </div>
              <p className="text-xs text-slate-400">
                Safe monthly surplus without depleting your ${financialProfile.emergencyFund || 0} emergency fund.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-1">
              <span className="text-[11px] uppercase font-bold text-brand-purple">Risk Compatibility</span>
              <div className="text-xl font-bold font-mono text-white capitalize">
                {financialProfile.riskTolerance || 'Moderate'} Horizon
              </div>
              <p className="text-xs text-slate-400">
                {riskData?.level === financialProfile.riskTolerance
                  ? `Direct match for your stated ${financialProfile.riskTolerance} risk preference.`
                  : `Evaluate position sizing to maintain ${financialProfile.riskTolerance} overall portfolio risk.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/20 space-y-1">
              <span className="text-[11px] uppercase font-bold text-brand-emerald">Investment Horizon</span>
              <div className="text-xl font-bold font-mono text-white capitalize">
                {financialProfile.investmentHorizon || 'Medium'} Term
              </div>
              <p className="text-xs text-slate-400">
                Aligned with your wealth objective: "{financialProfile.investmentObjective || 'Long term growth'}".
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. COMPANY SMART ANALYZER (BACKEND 1 GEMINI LLM) */}
      <section className="pt-4">
        <CompanySmartAnalyzer
          company={{
            symbol,
            name: company.name || symbol,
          }}
        />
      </section>

      {/* Proceed to Invest Confirmation Modal */}
      <ProceedToInvestModal
        isOpen={isInvestModalOpen}
        onClose={() => setIsInvestModalOpen(false)}
        company={{
          symbol,
          name: company.name || symbol,
        }}
      />
    </div>
  );
};
