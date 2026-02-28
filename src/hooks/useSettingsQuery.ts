import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { settingsApi } from '@/lib/api/settings';
import type { PublicSetting } from '@/types/settings';

export function usePublicSettings() {
  return useQuery<PublicSetting[]>({
    queryKey: queryKeys.settings.public(),
    queryFn: () => settingsApi.getPublic(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
