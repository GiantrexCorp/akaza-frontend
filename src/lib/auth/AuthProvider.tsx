'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { profileApi } from '@/lib/api/profile';
import { ApiError } from '@/lib/api/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        return;
      }
      const userData = await profileApi.get();
      setUser(userData);
    } catch {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem('auth_token', response.access_token);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: { name: string; email: string; phone?: string; password: string; password_confirmation: string }) => {
    const response = await authApi.register(data);
    localStorage.setItem('auth_token', response.access_token);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      if (!(e instanceof ApiError)) throw e;
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
