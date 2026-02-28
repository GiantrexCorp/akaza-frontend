'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import SettingsGroupForm from '@/components/admin/settings/SettingsGroupForm';
import { Spinner, EmptyState } from '@/components/ui';
import { useAdminSettingsList } from '@/hooks/admin/useAdminSettings';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminSetting } from '@/types/settings';

const GROUP_LABELS: Record<string, string> = {
  general: 'General',
  hotel: 'Hotel',
  payment: 'Payment',
  company: 'Company',
  email: 'Email',
};

export default function AdminSettingsPage() {
  useEffect(() => { document.title = 'Settings | Akaza Admin'; }, []);
  const [activeTab, setActiveTab] = useState<string>('');

  const { data: groups = {}, isLoading, isError, error, refetch } = useAdminSettingsList();
  useQueryErrorToast(isError, error, 'Failed to load settings');

  const typedGroups = groups as Record<string, AdminSetting[]>;
  const groupKeys = Object.keys(typedGroups);
  const totalSettings = Object.values(typedGroups).reduce((sum, arr) => sum + arr.length, 0);

  useEffect(() => {
    if (groupKeys.length > 0 && !activeTab) {
      setActiveTab(groupKeys[0]);
    }
  }, [groupKeys, activeTab]);

  return (
    <AdminProtectedRoute permission="manage-settings">
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Settings</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              {totalSettings} setting{totalSettings !== 1 ? 's' : ''} across {groupKeys.length} group{groupKeys.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : groupKeys.length === 0 ? (
            <EmptyState
              icon={<Settings size={48} strokeWidth={1} />}
              title="No Settings Found"
              description="No settings are configured in the system."
            />
          ) : (
            <div className="space-y-6">
              {/* Tab bar */}
              <div className="flex gap-6 border-b border-[var(--line-soft)]">
                {groupKeys.map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveTab(group)}
                    className={`pb-3 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
                      activeTab === group
                        ? 'text-primary border-primary'
                        : 'text-[var(--text-muted)] border-transparent hover:text-primary'
                    }`}
                  >
                    {GROUP_LABELS[group] || group}
                  </button>
                ))}
              </div>

              {/* Active group form */}
              {activeTab && typedGroups[activeTab] && (
                <SettingsGroupForm
                  key={activeTab}
                  settings={typedGroups[activeTab]}
                  onSaved={() => refetch()}
                />
              )}
            </div>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
