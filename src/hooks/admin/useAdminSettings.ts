import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminSettingsApi } from '@/lib/api/admin-settings';

export function useAdminSettingsList() {
  return useQuery({
    queryKey: queryKeys.admin.settings.list(),
    queryFn: () => adminSettingsApi.list(),
    ...CACHE_TIME.SHORT,
  });
}

export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, unknown>) => adminSettingsApi.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.settings.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.public() });
    },
  });
}
