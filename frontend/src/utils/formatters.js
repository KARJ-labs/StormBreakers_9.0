/**
 * Currency, number, and status formatters for financial UI
 */

export const formatCurrency = (val, currency = 'USD') => {
  if (val === null || val === undefined || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatPercent = (val, showPlus = true) => {
  if (val === null || val === undefined || isNaN(val)) return '0.00%';
  const num = Number(val);
  const sign = showPlus && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const formatLargeNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  const absNum = Math.abs(num);
  if (absNum >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (absNum >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (absNum >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (absNum >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

export const getRiskMeta = (score) => {
  const num = Number(score) || 0;
  if (num >= 70) {
    return {
      label: 'High Risk',
      color: 'text-brand-coral',
      bgColor: 'bg-brand-coral/10 border-brand-coral/30',
      badge: 'border-brand-coral/40 text-brand-coral bg-brand-coral/10',
      glow: 'shadow-glow-coral',
    };
  }
  if (num >= 40) {
    return {
      label: 'Moderate Risk',
      color: 'text-brand-amber',
      bgColor: 'bg-brand-amber/10 border-brand-amber/30',
      badge: 'border-brand-amber/40 text-brand-amber bg-brand-amber/10',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.3)]',
    };
  }
  return {
    label: 'Low Risk',
    color: 'text-brand-emerald',
    bgColor: 'bg-brand-emerald/10 border-brand-emerald/30',
    badge: 'border-brand-emerald/40 text-brand-emerald bg-brand-emerald/10',
    glow: 'shadow-glow-emerald',
  };
};

export const getHealthScoreMeta = (score) => {
  const num = Number(score) || 0;
  if (num >= 80) {
    return {
      status: 'Excellent',
      color: 'text-brand-emerald',
      bgGradient: 'from-emerald-500/20 to-teal-500/5',
      ringColor: '#10B981',
      description: 'Superb financial stability with strong emergency cushion and active goal progression.',
    };
  }
  if (num >= 60) {
    return {
      status: 'Good',
      color: 'text-brand-cyan',
      bgGradient: 'from-cyan-500/20 to-blue-500/5',
      ringColor: '#00D2FF',
      description: 'Solid financial baseline with positive surplus and manageable debt levels.',
    };
  }
  if (num >= 40) {
    return {
      status: 'Fair',
      color: 'text-brand-amber',
      bgGradient: 'from-amber-500/20 to-orange-500/5',
      ringColor: '#FB923C',
      description: 'Moderate progress. Increasing your emergency savings and reducing high-interest debt will improve resilience.',
    };
  }
  return {
    status: 'Needs Attention',
    color: 'text-brand-coral',
    bgGradient: 'from-rose-500/20 to-pink-500/5',
    ringColor: '#F43F5E',
    description: 'Elevated financial vulnerability. Focus on reducing discretionary outflows and building initial emergency reserves.',
  };
};
