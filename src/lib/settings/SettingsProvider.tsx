'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { usePublicSettings } from '@/hooks/useSettingsQuery';
import type { PublicSetting } from '@/types/settings';

type SettingsMap = Record<string, string | number | boolean | Record<string, unknown>>;

interface SettingsContextValue {
  settings: SettingsMap;
  loading: boolean;
  get: (key: string, fallback?: string) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = usePublicSettings();

  const settings: SettingsMap = {};
  if (data) {
    const items: PublicSetting[] = Array.isArray(data) ? data : (data as unknown as { data: PublicSetting[] }).data ?? [];
    for (const item of items) {
      settings[item.key] = item.value;
    }
  }

  const get = (key: string, fallback = '') => {
    const val = settings[key];
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'string') return val;
    return String(val);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading: isLoading, get }}>
      {children}
    </SettingsContext.Provider>
  );
}
