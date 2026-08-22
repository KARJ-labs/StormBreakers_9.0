import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Zap,
  TrendingUp,
  LayoutDashboard,
  HeartPulse,
  Receipt,
  Target,
  Briefcase,
  Layers,
  Bookmark,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onOpenRag }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = isAuthenticated
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Market', path: '/market', icon: TrendingUp },
        { name: 'Financial Health', path: '/financial-health', icon: HeartPulse },
        { name: 'Expenses', path: '/expenses', icon: Receipt },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'Portfolio', path: '/portfolio', icon: Layers },
        { name: 'Interests', path: '/interests', icon: Bookmark },
      ]
    : [
        { name: 'Market Explorer', path: '/market', icon: TrendingUp },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue via-brand-cyan to-brand-purple p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-cyan fill-brand-cyan/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-brand-cyan transition-colors whitespace-nowrap">
              StormBreakers
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-brand-sky/70 font-semibold -mt-1 whitespace-nowrap">
              WealthTech Intelligence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 flex-shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive(link.path)
                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Medium/Laptop Navigation Links (1024px to 1279px) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-0.5 flex-shrink">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive(link.path)
                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30 shadow-glow-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-3 h-3 flex-shrink-0" />
              <span>{link.name === 'Financial Health' ? 'Fin Health' : link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
          {/* Global AI Intelligence Trigger */}
          <button
            onClick={onOpenRag}
            className="flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs font-bold hover:bg-brand-purple/20 transition-all shadow-glow-purple whitespace-nowrap flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">AI Intelligence</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-2.5 xl:px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-brand-cyan/30 text-xs font-semibold text-white transition-all group whitespace-nowrap flex-shrink-0"
              >
                {user?.profile_picture && !imgError ? (
                  <img
                    src={user.profile_picture}
                    alt={user.name || 'User'}
                    onError={() => setImgError(true)}
                    className="w-6 h-6 rounded-full object-cover border border-brand-cyan/40 shadow-glow-cyan flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-cyan/20 to-brand-purple/20 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center font-bold text-[11px] shadow-glow-cyan flex-shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="max-w-[80px] xl:max-w-[110px] truncate group-hover:text-brand-cyan transition-colors whitespace-nowrap">
                  {user?.name || 'Profile'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-xl text-slate-400 hover:text-brand-coral hover:bg-brand-coral/10 border border-transparent hover:border-brand-coral/20 transition-all flex-shrink-0"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                to="/signup"
                state={{ from: location.pathname }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-white/5 border border-white/10 hover:border-white/20 transition-all whitespace-nowrap"
              >
                Sign Up
              </Link>
              <Link
                to="/market"
                className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-brand-cyan to-brand-sky hover:opacity-90 transition-all shadow-glow-cyan whitespace-nowrap"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenRag}
            className="p-2 rounded-xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple text-xs"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-white/5 border border-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border-subtle bg-background-darker/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.03] border border-white/5"
                >
                  {user?.profile_picture && !imgError ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name || 'User'}
                      onError={() => setImgError(true)}
                      className="w-6 h-6 rounded-full object-cover border border-brand-cyan/40"
                    />
                  ) : (
                    <User className="w-4 h-4 text-brand-cyan" />
                  )}
                  <span>{user?.name || 'My Financial Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-coral bg-brand-coral/10 border border-brand-coral/20 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-white/5 border border-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  state={{ from: location.pathname }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-brand-cyan shadow-glow-cyan"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
