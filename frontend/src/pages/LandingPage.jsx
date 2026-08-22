import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  ShieldAlert,
  HeartPulse,
  Receipt,
  Target,
  Sparkles,
  ArrowRight,
  Cpu,
  Brain,
  CheckCircle2,
  Lock,
  Globe,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';
import { AINodeVisualizer } from '../components/visuals/AINodeVisualizer';
import { SpeedometerGauge } from '../components/charts/SpeedometerGauge';
import { CircularProgressWheel } from '../components/charts/CircularProgressWheel';
import { RiskWaveChart } from '../components/charts/RiskWaveChart';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const backgroundSlides = [
    { title: 'S&P 500 INDEX', value: '+1.42%', positive: true, icon: TrendingUp, color: 'text-brand-cyan' },
    { title: 'RISK SCORE', value: '72 (HIGH)', positive: false, icon: ShieldAlert, color: 'text-brand-coral' },
    { title: 'MONTHLY SURPLUS', value: '$3,200 / mo', positive: true, icon: HeartPulse, color: 'text-brand-emerald' },
    { title: 'CAPITAL GOALS', value: '58% Tracked', positive: true, icon: Target, color: 'text-brand-indigo' },
    { title: 'EMERGENCY CUSHION', value: '6.2 Months', positive: true, icon: ShieldCheck, color: 'text-brand-sky' },
    { title: 'NVDA SEMI', value: '+4.15%', positive: true, icon: BarChart3, color: 'text-brand-purple' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-4 w-full">
      {/* 1. HERO SECTION - FULL UNIFORM EXTENT WITHOUT ENCLOSING BOX BORDER */}
      <section className="relative w-full overflow-hidden pt-2 pb-10 sm:py-12">
        {/* Floating background glowing ambient blobs */}
        <div className="absolute top-0 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-brand-cyan/15 rounded-full blur-[110px] pointer-events-none animate-float-blob -z-10" />
        <div className="absolute bottom-0 right-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-brand-purple/15 rounded-full blur-[110px] pointer-events-none animate-float-blob -z-10" style={{ animationDelay: '-5s' }} />

        {/* Moving Background Financial Ticker Slides */}
        <div className="w-full overflow-hidden opacity-25 pointer-events-none mb-6">
          <div className="animate-slide-track flex gap-4">
            {[...backgroundSlides, ...backgroundSlides].map((slide, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/[0.03] border border-white/5 text-[11px] font-mono whitespace-nowrap shadow-sm backdrop-blur-md"
              >
                <slide.icon className={`w-3.5 h-3.5 ${slide.color}`} />
                <span className="text-slate-300 font-bold">{slide.title}</span>
                <span className={slide.positive ? 'text-brand-emerald font-extrabold' : 'text-brand-coral font-extrabold'}>
                  {slide.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto px-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-wide shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            Next-Gen AI Wealth Intelligence Platform
          </div>

          {/* Headline with Smooth Fading & Slide-In CSS Animations */}
          <div className="space-y-3 max-w-4xl mx-auto overflow-hidden">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] flex flex-col items-center">
              <span className="text-white block animate-fade-slide-left">
                Understand your money.
              </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-purple block animate-fade-slide-right mt-1">
                Understand the market.
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal pt-3 animate-glide-smooth">
              Bridge your real personal cashflow with institutional-grade company risk intelligence to make confident, personalized investment decisions.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold text-black bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-blue hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center gap-2 group"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/market"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:border-brand-cyan/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Market Intelligence</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/market"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-extrabold text-black bg-gradient-to-r from-brand-cyan via-brand-sky to-brand-blue hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center gap-2 group"
                >
                  <span>Explore Market Intelligence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:border-brand-purple/40 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started Free</span>
                </Link>
              </>
            )}
          </div>

          {/* Central AI Nexus Visualizer */}
          <div className="w-full pt-6">
            <AINodeVisualizer title="Autonomous Dual-Engine Financial Architecture" />
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES GRID - RESPONSIVE FOR ALL SCREEN SIZES */}
      <section className="space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto px-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-cyan">
            Intelligent Pillars
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Designed for Complete Wealth Clarity
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every feature connects your personal financial profile directly to market opportunities.
          </p>
        </div>

        {/* Responsive Grid: 1 col on mobile, 2 cols on Tablet/iPad, 3 cols on Laptop/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Feature 1: Financial Health */}
          <div className="rounded-3xl glass-card border border-brand-emerald/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-emerald/40 transition-all group shadow-card-glass">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 flex items-center justify-center text-brand-emerald shadow-glow-emerald">
                <HeartPulse className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">StormBreaker Financial Health</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Proprietary scoring calculating savings rates, emergency cushion coverage, and debt-to-income balance.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <SpeedometerGauge spent={1850} limit={3200} percentage={58} />
            </div>
          </div>

          {/* Feature 2: Money Goals */}
          <div className="rounded-3xl glass-card border border-brand-indigo/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-indigo/40 transition-all group shadow-card-glass">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 border border-brand-indigo/30 flex items-center justify-center text-brand-indigo shadow-glow-indigo">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Money Goals Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set multi-category milestone targets with live required monthly savings rates and pace indicators.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <CircularProgressWheel
                totalValue={50000}
                items={[
                  { name: 'Emergency Fund', percentage: 40, amount: 20000, color: '#00D2FF' },
                  { name: 'Stock Portfolio', percentage: 35, amount: 17500, color: '#A855F7' },
                  { name: 'Downpayment', percentage: 25, amount: 12500, color: '#10B981' },
                ]}
              />
            </div>
          </div>

          {/* Feature 3: Institutional Risk */}
          <div className="rounded-3xl glass-card border border-brand-coral/20 p-6 flex flex-col justify-between space-y-4 hover:border-brand-coral/40 transition-all group shadow-card-glass md:col-span-2 lg:col-span-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-center text-brand-coral shadow-glow-coral">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Company Risk Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous multi-factor volatility, beta sensitivity, and maximum historical drawdown calculations.
              </p>
            </div>
            <div className="pt-2 flex justify-center">
              <RiskWaveChart
                score={72}
                summary="Elevated volatility with high historical drawdown."
                indicators={{ volatility: 54, beta: 1.28, drawdown: 38 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL AI INTEL SECTION */}
      <section className="rounded-3xl glass-card border border-border-subtle p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Two Distinct AI Architectures
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Personalized Guidance vs Global Education
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              StormBreakers separates company-specific financial suitability from global financial literacy for maximum precision and security.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-brand-indigo/20 flex items-start gap-3">
                <Brain className="w-5 h-5 text-brand-sky flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Company Smart Analyzer (Backend 1)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Powered by Gemini LLM. Evaluates specific stock tickers directly against your authenticated cashflow, active goals, and emergency cushion.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-brand-purple/20 flex items-start gap-3">
                <Globe className="w-5 h-5 text-brand-pink flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Global AI Assistant (Backend 2 RAG)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Powered by FastAPI and Qdrant Vector Retrieval. Answers educational questions on investing terminology, SIP compounding, and P/E ratios anywhere in the app.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Sample Card */}
          <div className="p-6 rounded-2xl bg-background-darker/90 border border-white/10 space-y-4 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono font-bold text-brand-cyan">SAMPLE RAG INTERACTION</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-emerald/10 text-brand-emerald font-mono">
                GROUNDED KNOWLEDGE
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-sky font-medium">
                "What is P/E ratio and how do I interpret it?"
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 leading-relaxed space-y-2">
                <p>
                  The Price-to-Earnings (P/E) ratio measures a company's current share price relative to its per-share earnings. A high P/E often indicates investors anticipate higher growth, while a lower P/E may signify value or market caution.
                </p>
                <div className="flex gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-slate-400 font-mono">
                    Citation: Financial Fundamentals DB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FINAL CTA BANNER */}
      <section className="rounded-3xl bg-gradient-to-r from-brand-blue/20 via-brand-cyan/10 to-brand-purple/20 border border-brand-cyan/30 p-8 sm:p-12 text-center space-y-6 shadow-glow-cyan backdrop-blur-xl">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
          Ready to Make Smarter Investment Moves?
        </h2>
        <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto">
          Start by browsing companies in the Market Explorer or create your personalized financial health profile in under two minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-2xl text-sm font-extrabold text-black bg-brand-cyan shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to My Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                to="/market"
                className="px-8 py-3.5 rounded-2xl text-sm font-extrabold text-black bg-brand-cyan shadow-glow-cyan hover:opacity-90 transition-all"
              >
                Launch Market Explorer
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                Create Free Account
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
