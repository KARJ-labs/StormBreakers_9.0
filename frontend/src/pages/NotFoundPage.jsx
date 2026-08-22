import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-brand-coral shadow-glow-coral">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-coral">
          404 Error
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          The market telemetry route or page you requested does not exist or has moved.
        </p>
      </div>

      <Link
        to="/"
        className="px-6 py-3 rounded-2xl font-bold text-xs text-black bg-brand-cyan shadow-glow-cyan flex items-center gap-2 hover:opacity-90 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
