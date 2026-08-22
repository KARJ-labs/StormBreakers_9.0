import React from 'react';
import { formatCurrency } from '../../utils/formatters';

/**
 * SpeedometerGauge - Recreates the semi-circle radial segmented arch gauge
 * from WealthTech reference design (e.g. Monthly Budget / Expense Ratio).
 */
export const SpeedometerGauge = ({
  spent = 0,
  limit = 0,
  percentage = 0,
  title = "Monthly Budget",
  subtitle = "spent of limit"
}) => {
  const safePercentage = Math.min(Math.max(Number(percentage) || (limit > 0 ? (spent / limit) * 100 : 0), 0), 100);
  const totalTicks = 28;
  const activeTicks = Math.round((safePercentage / 100) * totalTicks);

  // Generate ticks along a 180-degree semi-circle
  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angleDeg = 180 + (i / (totalTicks - 1)) * 180;
    const angleRad = (angleDeg * Math.PI) / 180;
    const innerRadius = 82;
    const outerRadius = 100;
    const cx = 120;
    const cy = 120;

    const x1 = cx + innerRadius * Math.cos(angleRad);
    const y1 = cy + innerRadius * Math.sin(angleRad);
    const x2 = cx + outerRadius * Math.cos(angleRad);
    const y2 = cy + outerRadius * Math.sin(angleRad);

    const isActive = i <= activeTicks;
    let strokeColor = 'rgba(255, 255, 255, 0.12)';
    
    if (isActive) {
      if (i < totalTicks * 0.4) strokeColor = '#00D2FF'; // Cyan
      else if (i < totalTicks * 0.7) strokeColor = '#A855F7'; // Purple
      else if (i < totalTicks * 0.85) strokeColor = '#FB923C'; // Amber
      else strokeColor = '#F43F5E'; // Coral Red
    }

    return { x1, y1, x2, y2, strokeColor, isActive };
  });

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-full overflow-hidden">
      <div className="relative w-full max-w-[210px] sm:max-w-[230px] h-32 flex items-end justify-center">
        <svg viewBox="0 0 240 140" className="w-full h-full overflow-visible">
          <defs>
            <filter id="gauge-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          {ticks.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={t.strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter={t.isActive ? "url(#gauge-glow)" : undefined}
              className="transition-all duration-500"
            />
          ))}
        </svg>

        {/* Center Readout */}
        <div className="absolute bottom-1 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Spent</span>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight leading-tight">
            {formatCurrency(spent)}
          </span>
        </div>
      </div>

      {/* Progress & Limit Badges */}
      <div className="flex items-center justify-between w-full max-w-[240px] mt-3 px-1 text-[11px]">
        <span className="font-semibold text-brand-sky bg-brand-sky/10 border border-brand-sky/20 px-2 py-0.5 rounded-full">
          {safePercentage.toFixed(0)}% spent
        </span>
        <span className="text-slate-400 font-mono">
          {formatCurrency(limit)} limit
        </span>
      </div>
    </div>
  );
};
