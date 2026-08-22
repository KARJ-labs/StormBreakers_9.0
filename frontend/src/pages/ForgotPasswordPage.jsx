import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { Zap, Mail, Lock, Loader2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newpassword: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newpassword !== formData.confirm) {
      setError('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authApi.forgotPassword(formData);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error(res?.error || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl glass-card border border-border-subtle p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-amber to-brand-coral p-0.5 shadow-glow-coral mx-auto">
            <div className="w-full h-full bg-background-darker rounded-[14px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-brand-amber" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-400">
            Enter your registered email and choose a new secure password
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-brand-coral/10 border border-brand-coral/30 flex items-center gap-2 text-xs text-brand-coral">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="p-6 rounded-2xl bg-brand-emerald/10 border border-brand-emerald/30 text-center space-y-2 text-brand-emerald">
            <CheckCircle2 className="w-8 h-8 mx-auto animate-bounce" />
            <h4 className="font-bold text-sm">Password Reset Successfully!</h4>
            <p className="text-xs text-slate-400">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Registered Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-amber"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.newpassword}
                  onChange={(e) => setFormData({ ...formData, newpassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-amber"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={formData.confirm}
                  onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-amber"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-extrabold text-xs text-black bg-gradient-to-r from-brand-amber to-brand-coral hover:opacity-90 transition-all shadow-glow-coral flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        )}

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
          Remember your password?{' '}
          <Link to="/login" className="font-bold text-brand-cyan hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
