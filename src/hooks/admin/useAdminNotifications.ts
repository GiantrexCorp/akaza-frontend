import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminNotificationsApi } from '@/lib/api';
import type { UpdateNotificationTemplateRequest } from '@/types/admin-notification';

export function useNotificationTemplates(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.templates(params),
    queryFn: () => adminNotificationsApi.listTemplates(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useNotificationTemplateDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.templateDetail(id),
    queryFn: () => adminNotificationsApi.getTemplate(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNotificationTemplateRequest }) =>
      adminNotificationsApi.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
    },
  });
}

export function useNotificationLogs(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.logs(params),
    queryFn: () => adminNotificationsApi.listLogs(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useNotificationLogDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.notifications.logDetail(id),
    queryFn: () => adminNotificationsApi.getLog(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
