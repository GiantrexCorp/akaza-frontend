import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { settingsApi } from '@/lib/api/settings';
import type { PublicSetting } from '@/types/settings';

export function usePublicSettings() {
  return useQuery<PublicSetting[]>({
    queryKey: queryKeys.settings.public(),
    queryFn: () => settingsApi.getPublic(),
    ...CACHE_TIME.LONG,
  });
}
