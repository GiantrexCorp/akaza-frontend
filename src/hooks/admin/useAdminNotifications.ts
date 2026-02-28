import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminNotificationsApi } from '@/lib/api/admin-notifications';
import type { UpdateNotificationTemplateRequest } from '@/types/admin-notification';

export function useNotificationTemplates(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.templates(params),
    queryFn: () => adminNotificationsApi.listTemplates(params),
    ...CACHE_TIME.SHORT,
  });
}

export function useNotificationTemplateDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.templateDetail(id),
    queryFn: () => adminNotificationsApi.getTemplate(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNotificationTemplateRequest }) =>
      adminNotificationsApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.notifications.all() });
    },
  });
}

export function useNotificationLogs(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.logs(params),
    queryFn: () => adminNotificationsApi.listLogs(params),
    ...CACHE_TIME.SHORT,
  });
}

export function useNotificationLogDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.logDetail(id),
    queryFn: () => adminNotificationsApi.getLog(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}
