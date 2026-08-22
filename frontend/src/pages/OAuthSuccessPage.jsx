import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, CheckCircle2 } from 'lucide-react';

export const OAuthSuccessPage = () => {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        await checkAuth();
        const savedDest = sessionStorage.getItem('stormbreaker_oauth_redirect') || '/dashboard';
        sessionStorage.removeItem('stormbreaker_oauth_redirect');
        navigate(savedDest, { replace: true });
      } catch (err) {
        console.error('OAuth resolution error:', err);
        navigate('/login', { replace: true });
      }
    };

    handleOAuth();
  }, [checkAuth, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4 text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shadow-glow-cyan">
        <CheckCircle2 className="w-8 h-8 animate-bounce text-brand-emerald" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Google Authentication Successful
        </h2>
        <p className="text-xs text-slate-400">
          Synchronizing your secure session and financial profile...
        </p>
      </div>
      <Loader2 className="w-6 h-6 animate-spin text-brand-cyan mt-2" />
    </div>
  );
};
