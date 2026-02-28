import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminSettingsApi } from '@/lib/api';

export function useAdminSettingsList() {
  return useQuery({
    queryKey: queryKeys.admin.settings.list(),
    queryFn: () => adminSettingsApi.list(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useBulkUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, unknown>) => adminSettingsApi.update(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.public() });
    },
  });
}
