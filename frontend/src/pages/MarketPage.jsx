import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marketApi } from '../api/marketApi';
import { MarketOverviewChart } from '../components/charts/MarketOverviewChart';
import { formatCurrency, formatPercent } from '../utils/formatters';
import {
  TrendingUp,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
  Building2,
  Compass,
  Sparkles,
  Flame,
} from 'lucide-react';

export const MarketPage = () => {
  const [overviewQuotes, setOverviewQuotes] = useState([]);
  const [trendingQuotes, setTrendingQuotes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, trendingRes, companiesRes] = await Promise.all([
        marketApi.getMarketOverview().catch(() => ({ data: [] })),
        marketApi.getTrending().catch(() => ({ data: [] })),
        marketApi.getCompanies().catch(() => ({ data: [] })),
      ]);

      setOverviewQuotes(overviewRes?.data || []);
      setTrendingQuotes(trendingRes?.data || []);

      // If backend companies returned array
      if (companiesRes?.data && Array.isArray(companiesRes.data)) {
        setCompanies(companiesRes.data.slice(0, 48));
      } else {
        // Fallback to top market symbols
        setCompanies(overviewRes?.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load live market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await marketApi.searchCompanies(searchQuery.trim());
      setSearchResults(res?.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const displayedCompanies = searchResults !== null ? searchResults : companies;

  return (
    <div className="space-y-10 py-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan shadow-glow-cyan">
              <Compass className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Market Intelligence Explorer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time equity analytics, aggregate benchmark performance, and risk assessments.
          </p>
        </div>

        {/* Real-time search bar */}
        <form onSubmit={handleSearch} className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value.trim()) setSearchResults(null);
            }}
            placeholder="Search symbol or company..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          {searchLoading && (
            <Loader2 className="w-4 h-4 text-brand-cyan animate-spin absolute right-3.5 top-3" />
          )}
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-brand-coral/10 border border-brand-coral/30 flex items-center justify-between text-xs text-brand-coral">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchMarketData}
            className="px-3 py-1 bg-brand-coral/20 rounded-lg font-bold hover:bg-brand-coral/30 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* MANDATORY MARKET GRAPH (PRIMARY VISUALIZATION) */}
      <section className="space-y-3">
        <MarketOverviewChart marketData={overviewQuotes} />
      </section>

      {/* TRENDING TICKERS CAROUSEL */}
      {trendingQuotes.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-brand-amber animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              High Volatility & Trending Movers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {trendingQuotes.slice(0, 7).map((item) => {
              const isPos = (item.changePercent || 0) >= 0;
              return (
                <Link
                  key={item.symbol}
                  to={`/companies/${item.symbol}`}
                  className="p-3.5 rounded-2xl glass-card border border-white/5 hover:border-brand-amber/40 transition-all flex flex-col justify-between group shadow-card-glass"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-white group-hover:text-brand-amber transition-colors">
                      {item.symbol}
                    </span>
                    {isPos ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-brand-emerald" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5 text-brand-coral" />
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-sm font-mono font-extrabold text-white">
                      {formatCurrency(item.currentPrice)}
                    </div>
                    <div
                      className={`text-[11px] font-mono font-bold ${
                        isPos ? 'text-brand-emerald' : 'text-brand-coral'
                      }`}
                    >
                      {formatPercent(item.changePercent)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* EXPLORE AVAILABLE COMPANIES LIST / GRID */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-cyan" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Explore Available Companies
            </h2>
          </div>
          {searchResults !== null && (
            <button
              onClick={() => {
                setSearchResults(null);
                setSearchQuery('');
              }}
              className="text-xs text-brand-cyan hover:underline"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse p-4 space-y-3"
              >
                <div className="h-4 bg-white/10 rounded w-1/3" />
                <div className="h-5 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedCompanies.length === 0 ? (
          /* Empty Search State */
          <div className="p-12 text-center rounded-2xl glass-card border border-white/5 space-y-3">
            <Building2 className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Companies Found</h3>
            <p className="text-xs text-slate-400">
              Try searching for common tickers like AAPL, MSFT, GOOGL, NVDA, TSLA, or RELIANCE.
            </p>
          </div>
        ) : (
          /* Real Companies Cards Grid (1 col mobile, 2 cols tablet, 3-4 cols laptop/desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedCompanies.map((c) => {
              const symbol = c.symbol || c.displaySymbol;
              const name = c.description || c.companyName || symbol;
              const price = c.currentPrice;
              const change = c.changePercent;
              const isPos = (change || 0) >= 0;

              return (
                <Link
                  key={symbol}
                  to={`/companies/${symbol}`}
                  className="p-4 rounded-2xl glass-card border border-white/5 hover:border-brand-cyan/40 hover:bg-white/[0.03] transition-all flex flex-col justify-between group shadow-card-glass"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      {/* Logo or Monogram */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan/20 to-brand-purple/20 border border-white/10 flex items-center justify-center font-bold text-xs text-white group-hover:scale-105 transition-transform flex-shrink-0">
                        {symbol.slice(0, 2)}
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-mono font-extrabold text-sm text-white block group-hover:text-brand-cyan transition-colors truncate">
                          {symbol}
                        </span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {name}
                        </span>
                      </div>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                  </div>

                  {/* Price & Change Indicator if present */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    {price !== undefined ? (
                      <>
                        <span className="font-mono font-extrabold text-white">
                          {formatCurrency(price)}
                        </span>
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                            isPos
                              ? 'text-brand-emerald bg-brand-emerald/10'
                              : 'text-brand-coral bg-brand-coral/10'
                          }`}
                        >
                          {formatPercent(change)}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {c.exchange ? `${c.exchange} • ${c.currency || 'USD'}` : 'EQUITY'}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
