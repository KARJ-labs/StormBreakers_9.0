import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border-subtle bg-background-darker/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-cyan p-0.5 shadow-glow-cyan">
              <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-cyan" />
              </div>
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">StormBreakers</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Intelligent WealthTech platform bridging personal financial reality with institutional-grade market risk analytics.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-brand-emerald animate-pulse" />
            Engines Online: Express + FastAPI RAG
          </div>
        </div>

        {/* Product Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Product</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <Link to="/market" className="hover:text-brand-cyan transition-colors flex items-center gap-1">
                Market Explorer <ArrowUpRight className="w-3 h-3 text-slate-500" />
              </Link>
            </li>
            <li>
              <Link to="/financial-health" className="hover:text-brand-cyan transition-colors">
                Financial Health Score
              </Link>
            </li>
            <li>
              <Link to="/expenses" className="hover:text-brand-cyan transition-colors">
                Smart Expense Tracker
              </Link>
            </li>
            <li>
              <Link to="/goals" className="hover:text-brand-cyan transition-colors">
                Money Goals Engine
              </Link>
            </li>
          </ul>
        </div>

        {/* Intelligence & Architecture */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Intelligence</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>
              <span className="text-slate-300 font-medium">Company Smart Analyzer</span>
              <p className="text-[11px] text-slate-500">Gemini LLM contextualized on user cashflows.</p>
            </li>
            <li className="pt-1">
              <span className="text-slate-300 font-medium">Global RAG Assistant</span>
              <p className="text-[11px] text-slate-500">Qdrant Vector Retrieval for financial literacy.</p>
            </li>
          </ul>
        </div>

        {/* Compliance & Disclaimer */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Disclaimer</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            StormBreakers provides educational analysis and risk evaluation. We do not execute broker orders or offer guaranteed investment advice. All financial calculations represent estimates based on user-supplied parameters.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} StormBreakers. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 transition-colors">Privacy Policy</span>
          <span className="hover:text-slate-400 transition-colors">Terms of Service</span>
          <span className="hover:text-slate-400 transition-colors">Risk Disclosure</span>
        </div>
      </div>
    </footer>
  );
};
