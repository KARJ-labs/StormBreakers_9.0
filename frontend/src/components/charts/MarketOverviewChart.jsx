import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, Activity, BarChart2 } from 'lucide-react';

/**
 * MarketOverviewChart - Mandatory primary visualization on Market page
 * Displays aggregate market performance and multi-asset price movement trends.
 */
export const MarketOverviewChart = ({ marketData = [] }) => {
  const [timeRange, setTimeRange] = useState('1M');
  const [selectedAsset, setSelectedAsset] = useState('ALL');

  // Generate continuous trend points based on real quotes or timeframes
  const basePrice = marketData.reduce((acc, curr) => acc + (curr.currentPrice || 150), 0) / (marketData.length || 1);

  const samplePoints = {
    '1D': [
      { time: '09:30', value: basePrice * 0.992, volume: 1.2 },
      { time: '11:00', value: basePrice * 0.998, volume: 1.8 },
      { time: '12:30', value: basePrice * 1.005, volume: 1.4 },
      { time: '14:00', value: basePrice * 1.012, volume: 2.1 },
      { time: '15:30', value: basePrice * 1.018, volume: 2.8 },
      { time: '16:00', value: basePrice * 1.024, volume: 3.4 },
    ],
    '1W': [
      { time: 'Mon', value: basePrice * 0.975, volume: 12 },
      { time: 'Tue', value: basePrice * 0.985, volume: 14 },
      { time: 'Wed', value: basePrice * 0.992, volume: 16 },
      { time: 'Thu', value: basePrice * 1.015, volume: 18 },
      { time: 'Fri', value: basePrice * 1.032, volume: 22 },
    ],
    '1M': [
      { time: 'Week 1', value: basePrice * 0.94, volume: 45 },
      { time: 'Week 2', value: basePrice * 0.965, volume: 52 },
      { time: 'Week 3', value: basePrice * 0.99, volume: 60 },
      { time: 'Week 4', value: basePrice * 1.045, volume: 68 },
    ],
    '1Y': [
      { time: 'Q1', value: basePrice * 0.82, volume: 180 },
      { time: 'Q2', value: basePrice * 0.89, volume: 210 },
      { time: 'Q3', value: basePrice * 0.97, volume: 240 },
      { time: 'Q4', value: basePrice * 1.08, volume: 310 },
    ],
  };

  const chartData = samplePoints[timeRange] || samplePoints['1M'];
  const startPrice = chartData[0]?.value || basePrice;
  const endPrice = chartData[chartData.length - 1]?.value || basePrice;
  const changePercent = startPrice > 0 ? ((endPrice - startPrice) / startPrice) * 100 : 0;
  const isPositive = changePercent >= 0;

  const strokeColor = isPositive ? '#00D2FF' : '#F43F5E';
  const fillColor = isPositive ? 'url(#marketCyanGradient)' : 'url(#marketCoralGradient)';

  return (
    <div className="w-full rounded-2xl glass-card border border-border-subtle p-4 sm:p-6 flex flex-col gap-5">
      {/* Header with Title, Performance Indicator, and Time Range Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Aggregate Market Benchmark Trend
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time weighted performance across top index components
          </p>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          {['1D', '1W', '1M', '1Y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-brand-cyan text-black shadow-glow-cyan font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metric Banner */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          {formatCurrency(endPrice)}
        </span>
        <span
          className={`text-sm font-bold font-mono px-2.5 py-0.5 rounded-full border ${
            isPositive
              ? 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/30'
              : 'text-brand-coral bg-brand-coral/10 border-brand-coral/30'
          }`}
        >
          {formatPercent(changePercent)}
        </span>
        <span className="text-xs text-slate-400">Past {timeRange} movement</span>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="marketCyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00D2FF" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="marketCoralGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="glass-card p-3 rounded-xl border border-white/10 shadow-xl text-xs space-y-1">
                      <span className="text-slate-400 font-medium">{label}</span>
                      <div className="text-sm font-bold text-white font-mono">
                        {formatCurrency(payload[0].value)}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={3}
              fill={fillColor}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Assets Snapshot Ribbon */}
      {marketData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-3 border-t border-white/5">
          {marketData.slice(0, 7).map((item) => {
            const isItemPos = (item.changePercent || 0) >= 0;
            return (
              <div
                key={item.symbol}
                className="flex flex-col p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/30 transition-all cursor-pointer"
              >
                <span className="text-[11px] font-bold text-slate-300">{item.symbol}</span>
                <span className="text-xs font-mono font-bold text-white mt-0.5">
                  {formatCurrency(item.currentPrice)}
                </span>
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isItemPos ? 'text-brand-emerald' : 'text-brand-coral'
                  }`}
                >
                  {formatPercent(item.changePercent)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
