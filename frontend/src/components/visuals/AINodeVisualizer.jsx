import React from 'react';
import { Cpu, Zap, Shield, Target, TrendingUp, Sparkles } from 'lucide-react';

/**
 * AINodeVisualizer - Glowing AI Nexus & Circuit Visualizer
 * Features thin glowing data pipelines connecting 4 contextual data streams to the central AI Nexus.
 */
export const AINodeVisualizer = ({ title = "Autonomous Dual-Engine Financial Architecture" }) => {
  const inputNodes = [
    { name: "Live Market & Pricing", icon: TrendingUp, color: "text-brand-cyan", border: "border-brand-cyan/30", bg: "bg-brand-cyan/10", stream: "01" },
    { name: "Personal Cashflow & Expenses", icon: Zap, color: "text-brand-emerald", border: "border-brand-emerald/30", bg: "bg-brand-emerald/10", stream: "02" },
    { name: "Volatility & Risk Drivers", icon: Shield, color: "text-brand-coral", border: "border-brand-coral/30", bg: "bg-brand-coral/10", stream: "03" },
    { name: "Long-term Wealth Goals", icon: Target, color: "text-brand-purple", border: "border-brand-purple/30", bg: "bg-brand-purple/10", stream: "04" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto py-6 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Subtly reduced background radial glow */}
      <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-brand-cyan/5 blur-2xl pointer-events-none -z-10" />

      {/* Visual Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/30 text-brand-indigo text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous Context Aggregation
        </div>
        <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{title}</h3>
      </div>

      {/* Main Connection Layout Container */}
      <div className="relative w-full">
        {/* SVG Thin Connecting Pipelines (Visible on Tablet, Laptop, Desktop) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0"
          viewBox="0 0 1000 320"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pipeCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pipeEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pipeCoral" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="pipePurple" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#A855F7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Pipeline 1: Top-Left Card (Data Stream 01) -> Center Nexus */}
          <path
            d="M 330 75 C 400 75, 410 130, 440 145"
            stroke="url(#pipeCyan)"
            strokeWidth="1.5"
            className="animate-pipeline"
          />
          <circle cx="330" cy="75" r="3" fill="#00D2FF" />
          <circle cx="440" cy="145" r="3" fill="#38BDF8" />

          {/* Pipeline 2: Bottom-Left Card (Data Stream 02) -> Center Nexus */}
          <path
            d="M 330 245 C 400 245, 410 190, 440 175"
            stroke="url(#pipeEmerald)"
            strokeWidth="1.5"
            className="animate-pipeline"
          />
          <circle cx="330" cy="245" r="3" fill="#10B981" />
          <circle cx="440" cy="175" r="3" fill="#00D2FF" />

          {/* Pipeline 3: Top-Right Card (Data Stream 03) -> Center Nexus */}
          <path
            d="M 670 75 C 600 75, 590 130, 560 145"
            stroke="url(#pipeCoral)"
            strokeWidth="1.5"
            className="animate-pipeline"
          />
          <circle cx="670" cy="75" r="3" fill="#F43F5E" />
          <circle cx="560" cy="145" r="3" fill="#A855F7" />

          {/* Pipeline 4: Bottom-Right Card (Data Stream 04) -> Center Nexus */}
          <path
            d="M 670 245 C 600 245, 590 190, 560 175"
            stroke="url(#pipePurple)"
            strokeWidth="1.5"
            className="animate-pipeline"
          />
          <circle cx="670" cy="245" r="3" fill="#A855F7" />
          <circle cx="560" cy="175" r="3" fill="#6366F1" />
        </svg>

        {/* 3-Column Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center relative z-10">
          {/* Left Side Inputs (Streams 01 & 02) */}
          <div className="flex flex-col gap-4">
            {inputNodes.slice(0, 2).map((node, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl glass-card border ${node.border} flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-card-glass backdrop-blur-xl`}
              >
                <div className={`p-2.5 rounded-xl ${node.bg} ${node.color} flex-shrink-0`}>
                  <node.icon className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 font-mono font-medium block">Data Stream {node.stream}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{node.name}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Central AI Nexus Core Orb */}
          <div className="flex flex-col items-center justify-center p-2 my-2 md:my-0">
            <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-tr from-brand-indigo/50 via-brand-cyan/60 to-brand-purple/50 p-0.5 animate-orb shadow-glow-cyan/20">
              <div className="w-full h-full rounded-full bg-[#080C16] border border-white/10 flex flex-col items-center justify-center text-center p-3">
                <Cpu className="w-7 h-7 sm:w-9 sm:h-9 text-brand-cyan animate-pulse mb-1" />
                <span className="text-xs sm:text-sm font-extrabold text-white tracking-wider font-mono">
                  GEMINI + RAG
                </span>
                <span className="text-[9px] sm:text-[10px] text-brand-sky font-semibold uppercase tracking-widest mt-0.5">
                  ACTIVE NEXUS
                </span>
              </div>
            </div>
          </div>

          {/* Right Side Inputs (Streams 03 & 04) */}
          <div className="flex flex-col gap-4">
            {inputNodes.slice(2, 4).map((node, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl glass-card border ${node.border} flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-card-glass backdrop-blur-xl`}
              >
                <div className={`p-2.5 rounded-xl ${node.bg} ${node.color} flex-shrink-0`}>
                  <node.icon className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] text-slate-400 font-mono font-medium block">Data Stream {node.stream}</span>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{node.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
