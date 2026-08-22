import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { financialProfileApi } from '../api/financialProfileApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [financialProfile, setFinancialProfile] = useState(null);
  const [hasFinancialProfile, setHasFinancialProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Fetch financial profile
  const fetchFinancialProfile = useCallback(async () => {
    try {
      const res = await financialProfileApi.getFinancialProfile();
      if (res?.data && res.data.monthlyIncome !== undefined) {
        setFinancialProfile(res.data);
        setHasFinancialProfile(true);
        return res.data;
      } else {
        setFinancialProfile(null);
        setHasFinancialProfile(false);
        return null;
      }
    } catch {
      setFinancialProfile(null);
      setHasFinancialProfile(false);
      return null;
    }
  }, []);

  // Check auth state on mount
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const verifyRes = await authApi.verify();
      if (verifyRes?.success) {
        try {
          const profileRes = await authApi.getProfile();
          setUser(profileRes.data || { email: verifyRes.email, id: verifyRes.userId });
        } catch {
          setUser({ email: verifyRes.email, id: verifyRes.userId });
        }
        await fetchFinancialProfile();
      } else {
        setUser(null);
        setFinancialProfile(null);
        setHasFinancialProfile(false);
      }
    } catch {
      setUser(null);
      setFinancialProfile(null);
      setHasFinancialProfile(false);
    } finally {
      setLoading(false);
    }
  }, [fetchFinancialProfile]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res?.success) {
      try {
        const profileRes = await authApi.getProfile();
        setUser(profileRes.data || res.user);
      } catch {
        setUser(res.user);
      }
      await fetchFinancialProfile();
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    return res;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setFinancialProfile(null);
      setHasFinancialProfile(false);
    }
  };

  const saveFinancialProfile = async (data) => {
    let res;
    if (hasFinancialProfile) {
      res = await financialProfileApi.updateFinancialProfile(data);
    } else {
      res = await financialProfileApi.createFinancialProfile(data);
    }
    if (res?.data) {
      setFinancialProfile(res.data);
      setHasFinancialProfile(true);
    }
    return res;
  };

  const openFinancialProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  const closeFinancialProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        financialProfile,
        hasFinancialProfile,
        isProfileModalOpen,
        openFinancialProfileModal,
        closeFinancialProfileModal,
        saveFinancialProfile,
        refreshFinancialProfile: fetchFinancialProfile,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
