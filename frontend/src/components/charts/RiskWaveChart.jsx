import React from 'react';
import { getRiskMeta } from '../../utils/formatters';
import { ShieldAlert, ShieldCheck, Activity, AlertTriangle } from 'lucide-react';

/**
 * RiskWaveChart - Recreates the Risk Intelligence panel with score wave,
 * indicators, and categorized driver meters.
 * Fully responsive across all container widths (Mobile, iPad, Laptop, Desktop).
 */
export const RiskWaveChart = ({
  score = 50,
  level = 'moderate',
  summary = 'Balanced risk profile with manageable market sensitivity.',
  indicators = {},
}) => {
  const meta = getRiskMeta(score);
  const { volatility, beta, drawdown } = indicators;

  // Driver metrics breakdown
  const drivers = [
    {
      name: 'Market Volatility (52W)',
      value: volatility !== null && volatility !== undefined ? Math.min(Math.round(volatility), 100) : 48,
      color: 'bg-brand-cyan',
      glow: 'shadow-glow-cyan',
    },
    {
      name: 'Beta Sensitivity',
      value: beta !== null && beta !== undefined ? Math.min(Math.round(beta * 50), 100) : 58,
      color: 'bg-brand-purple',
      glow: 'shadow-glow-purple',
    },
    {
      name: 'Drawdown Fluctuation',
      value: drawdown !== null && drawdown !== undefined ? Math.min(Math.round(drawdown), 100) : 34,
      color: 'bg-brand-amber',
      glow: 'shadow-[0_0_15px_rgba(251,146,60,0.4)]',
    },
    {
      name: 'Systemic Risk Factor',
      value: Math.min(Math.round(score * 0.9), 100),
      color: score > 60 ? 'bg-brand-coral' : 'bg-brand-emerald',
      glow: score > 60 ? 'shadow-glow-coral' : 'shadow-glow-emerald',
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-1 w-full max-w-full overflow-hidden">
      {/* 1. Score Badge Card (Full width to give badge ample space) */}
      <div className="w-full flex flex-col justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Risk Score
          </span>
          <span
            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border flex-shrink-0 ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-black font-mono tracking-tight ${meta.color}`}>
            {score}
          </span>
          <span className="text-xs text-slate-500 font-mono">/ 100</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {summary}
        </p>
      </div>

      {/* 2. Dynamic Wave Visualization Card */}
      <div className="w-full flex flex-col justify-center rounded-2xl bg-white/[0.02] border border-white/5 p-3.5 overflow-hidden relative">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Volatility Frequency Wave
          </span>
          <span className="text-[10px] text-brand-coral font-mono font-bold">
            LIVE DYNAMICS
          </span>
        </div>
        <svg viewBox="0 0 300 70" className="w-full h-14 overflow-visible">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>
          <path
            d="M 0 45 Q 25 15, 50 40 T 100 25 T 150 50 T 200 20 T 250 35 T 300 30"
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="transition-all duration-700"
            style={{
              filter: 'drop-shadow(0px 0px 8px rgba(244, 63, 94, 0.4))'
            }}
          />
          {/* Pulsing indicator node */}
          <circle cx="250" cy="35" r="5" fill="#F43F5E" className="animate-ping" opacity="0.75" />
          <circle cx="250" cy="35" r="4" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 3. Driver Meters */}
      <div className="flex flex-col gap-2.5 pt-1 w-full">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Risk Drivers & Core Indicators
        </span>
        <div className="space-y-2.5 w-full">
          {drivers.map((driver, idx) => (
            <div key={idx} className="space-y-1 w-full">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium text-[11px] truncate mr-2">{driver.name}</span>
                <span className="font-mono text-slate-200 font-bold text-[11px]">{driver.value}</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${driver.color} ${driver.glow}`}
                  style={{ width: `${driver.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
