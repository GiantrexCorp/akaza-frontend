import { api } from './client';
import type { PublicSetting } from '@/types/settings';

export const settingsApi = {
  getPublic: () =>
    api.get<PublicSetting[]>('/settings/public'),
};
