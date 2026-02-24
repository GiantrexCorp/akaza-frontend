'use client';

import type { ReactNode } from 'react';
import AuthProvider from '@/lib/auth/AuthProvider';
import { SettingsProvider } from '@/lib/settings';
import { ToastProvider } from '@/components/ui/Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
