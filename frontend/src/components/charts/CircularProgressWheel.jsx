import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const SEGMENT_COLORS = [
  '#00D2FF', // Cyan
  '#38BDF8', // Sky
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#A855F7', // Violet
  '#EC4899', // Pink
  '#FB923C', // Orange
  '#10B981', // Emerald
];

/**
 * CircularProgressWheel - Multi-segment radial goals/portfolio allocation wheel
 * Engineered to fit within any responsive card width (mobile, iPad/tablet, laptop, desktop).
 */
export const CircularProgressWheel = ({ items = [], totalValue = 0, title = "Allocation" }) => {
  const safeItems = items.length > 0 ? items : [
    { name: 'Emergency Fund', percentage: 40, amount: 2000 },
    { name: 'Investments', percentage: 30, amount: 1500 },
    { name: 'Debt Repayment', percentage: 20, amount: 1000 },
    { name: 'Travel & Lifestyle', percentage: 10, amount: 500 },
  ];

  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative dash offsets
  let cumulativePercentage = 0;
  const segments = safeItems.map((item, idx) => {
    const percentage = Number(item.percentage) || (totalValue > 0 ? (item.amount / totalValue) * 100 : 0);
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
    cumulativePercentage += percentage;
    const color = item.color || SEGMENT_COLORS[idx % SEGMENT_COLORS.length];
    return { ...item, percentage, strokeDasharray, strokeDashoffset, color };
  });

  return (
    <div className="flex flex-col items-center justify-center gap-3.5 w-full max-w-full overflow-hidden p-1">
      {/* Radial Wheel */}
      <div className="relative flex items-center justify-center flex-shrink-0 w-36 h-36 sm:w-44 sm:h-44">
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth - 2}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 hover:opacity-90"
              style={{
                filter: `drop-shadow(0px 0px 6px ${seg.color}66)`,
              }}
            />
          ))}
        </svg>

        {/* Inner Label */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">{title}</span>
          <span className="text-sm sm:text-base md:text-lg font-extrabold text-white font-mono tracking-tight leading-tight">
            {totalValue ? formatCurrency(totalValue) : '100%'}
          </span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex flex-col gap-1.5 w-full max-w-full overflow-hidden">
        {segments.slice(0, 3).map((seg, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-[11px] py-1 px-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors w-full"
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="font-medium text-slate-200 truncate block text-[11px]">{seg.name}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[11px]">
              {seg.amount !== undefined && (
                <span className="text-slate-400 hidden sm:inline-block">{formatCurrency(seg.amount)}</span>
              )}
              <span className="font-bold text-white" style={{ color: seg.color }}>
                {seg.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
