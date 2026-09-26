import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getMyProfile } from '../api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from stored token on first load
  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMyProfile()
      .then(setCurrentUser)
      .catch(() => localStorage.removeItem('sc_token'))
      .finally(() => setLoading(false));
  }, []);

  const value = {
    currentUser,
    loading,
    login: async (email, password) => {
      const user = await apiLogin({ email, password });
      setCurrentUser(user);
      return user;
    },
    signup: async (formData) => {
      const user = await apiSignup(formData);
      setCurrentUser(user);
      return user;
    },
    logout: async () => {
      await apiLogout();
      setCurrentUser(null);
    },
    refreshUser: async () => {
      const user = await getMyProfile();
      setCurrentUser(user);
      return user;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
