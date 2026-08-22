import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { analyzerApi } from '../../api/analyzerApi';
import {
  Sparkles,
  Send,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lock,
  Loader2,
  TrendingUp,
  Target,
  ShieldAlert,
  Brain,
  RotateCcw,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const CompanySmartAnalyzer = ({ company = {} }) => {
  const { isAuthenticated, hasFinancialProfile, openFinancialProfileModal } = useAuth();
  const location = useLocation();

  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const suggestedQuestions = [
    'Why should I invest in this company?',
    'Is this company suitable for my risk profile?',
    'What are the major risks given my current debt and savings?',
    'How does this company fit my active financial goals?',
    'Can I afford this investment based on my monthly cashflow surplus?',
  ];

  const handleAsk = async (queryToAsk) => {
    const q = (queryToAsk || question).trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await analyzerApi.analyzeCompany({
        question: q,
        company: {
          symbol: company.symbol,
          name: company.name || company.symbol,
        },
      });

      if (res?.data?.analysis) {
        setHistory((prev) => [
          ...prev,
          {
            id: Date.now(),
            question: q,
            analysis: res.data.analysis,
            disclaimer: res.data.disclaimer,
          },
        ]);
        setQuestion('');
      } else {
        throw new Error('Invalid analysis received from Smart Analyzer');
      }
    } catch (err) {
      setError(err.message || 'Unable to generate company analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl glass-card border border-brand-indigo/30 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur backdrop */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo via-brand-purple to-brand-cyan p-0.5 shadow-glow-indigo">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-brand-sky" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Company Smart Analyzer
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-indigo/20 text-brand-sky border border-brand-indigo/30">
                Gemini LLM
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Personalized investment intelligence computed against your real profile & cashflow
            </p>
          </div>
        </div>
      </div>

      {/* Auth / Profile Gate Overlay if not logged in or profile missing */}
      {!isAuthenticated ? (
        <div className="mt-6 p-6 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center max-w-md mx-auto space-y-4">
          <div className="p-3 rounded-full bg-brand-indigo/10 text-brand-indigo">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Unlock Personalized Intelligence</h4>
            <p className="text-xs text-slate-400 mt-1">
              Log in to let the Smart Analyzer evaluate {company.name || company.symbol} against your specific income, expenses, and risk tolerance.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full justify-center">
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              state={{ from: location.pathname }}
              className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan hover:opacity-90 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      ) : !hasFinancialProfile ? (
        <div className="mt-6 p-6 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center max-w-md mx-auto space-y-4">
          <div className="p-3 rounded-full bg-brand-amber/10 text-brand-amber">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Complete Your Financial Profile</h4>
            <p className="text-xs text-slate-400 mt-1">
              To evaluate suitability for {company.name || company.symbol}, StormBreakers needs your income, expense range, and risk preferences.
            </p>
          </div>
          <button
            onClick={openFinancialProfileModal}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan hover:opacity-90 transition-all"
          >
            Create Financial Profile
          </button>
        </div>
      ) : (
        /* Authenticated Interactive Analyzer Workspace */
        <div className="mt-6 space-y-6">
          {/* Question Input Form */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-slate-300">
              Ask anything about {company.name || company.symbol} based on your financial situation:
            </label>

            {/* Suggested Prompt Chips */}
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((sq, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => handleAsk(sq)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-white/[0.03] border border-white/10 text-slate-300 hover:text-brand-sky hover:border-brand-sky/40 hover:bg-brand-sky/5 transition-all text-left disabled:opacity-50"
                >
                  • {sq}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex gap-2 mt-2"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`E.g., Can I afford $1,000 into ${company.symbol || 'this company'} without hurting my emergency fund?`}
                disabled={loading}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!question.trim() || loading}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-black bg-gradient-to-r from-brand-cyan to-brand-sky hover:opacity-90 disabled:opacity-40 transition-all shadow-glow-cyan flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Analyze</span>
              </button>
            </form>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-brand-sky/20 space-y-4 animate-pulse">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-sky">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Aggregating financial context & evaluating {company.symbol}...</span>
              </div>
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="h-20 bg-white/5 rounded-xl" />
                <div className="h-20 bg-white/5 rounded-xl" />
              </div>
            </div>
          )}

          {/* Error Banner with Retry */}
          {error && (
            <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-coral flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-brand-coral">Analysis Request Error: </span>
                <span className="text-slate-300">{error}</span>
              </div>
              <button
                onClick={() => handleAsk()}
                className="px-2.5 py-1 text-xs font-bold text-brand-coral bg-brand-coral/20 rounded-lg hover:bg-brand-coral/30 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Analysis History Stream */}
          {history.length > 0 && (
            <div className="space-y-6 pt-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-background-darker/60 border border-white/10 space-y-4 shadow-xl"
                >
                  {/* User Query Question */}
                  <div className="flex items-start gap-2.5 text-xs text-brand-sky font-semibold bg-brand-sky/5 p-3 rounded-xl border border-brand-sky/10">
                    <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>"{item.question}"</span>
                  </div>

                  {/* Summary & Suitability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                        Executive Summary
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                        {item.analysis.suitability}
                      </span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-normal">
                      {item.analysis.summary}
                    </p>
                  </div>

                  {/* Pros & Risks Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Why It May Fit */}
                    <div className="p-4 rounded-xl bg-brand-emerald/5 border border-brand-emerald/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Why It May Fit</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {item.analysis.whyItMayFit?.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-brand-emerald font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Risks */}
                    <div className="p-4 rounded-xl bg-brand-coral/5 border border-brand-coral/20 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-coral">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Key Risks & Watchpoints</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {item.analysis.risks?.map((risk, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-brand-coral font-bold">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Financial & Goal Impact */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-1.5 text-brand-cyan font-bold mb-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Financial Impact</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.analysis.financialImpact}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-1.5 text-brand-purple font-bold mb-1">
                        <Target className="w-3.5 h-3.5" />
                        <span>Goal Alignment</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.analysis.goalImpact}</p>
                    </div>
                  </div>

                  {/* Considerations & Disclaimer */}
                  {item.analysis.keyConsiderations?.length > 0 && (
                    <div className="pt-1 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Key Considerations: </span>
                      {item.analysis.keyConsiderations.join(' • ')}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-white/5">
                    {item.disclaimer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
