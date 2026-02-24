'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PublicSetting } from '@/types/settings';
import { settingsApi } from '@/lib/api/settings';

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
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi
      .getPublic()
      .then((items: PublicSetting[]) => {
        const map: SettingsMap = {};
        for (const item of items) {
          map[item.key] = item.value;
        }
        setSettings(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const get = (key: string, fallback = '') => {
    const val = settings[key];
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'string') return val;
    return String(val);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, get }}>
      {children}
    </SettingsContext.Provider>
  );
}
