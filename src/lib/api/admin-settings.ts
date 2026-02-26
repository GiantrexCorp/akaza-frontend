import { api } from './client';
import type { GroupedSettings } from '@/types/settings';

export const adminSettingsApi = {
  list: () =>
    api.get<GroupedSettings>('/admin/settings'),

  getGroup: (group: string) =>
    api.get<Record<string, unknown>>(`/admin/settings/${group}`),

  update: (settings: Record<string, unknown>) =>
    api.put<{ message: string }>('/admin/settings', { settings }),
};
