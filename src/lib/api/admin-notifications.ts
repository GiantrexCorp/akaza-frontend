import { api } from './client';
import type {
  NotificationTemplate,
  UpdateNotificationTemplateRequest,
  AdminNotificationLog,
} from '@/types/admin-notification';

export const adminNotificationsApi = {
  listTemplates: (params?: string) =>
    api.get<NotificationTemplate[]>(`/admin/notification-templates${params ? `?${params}` : ''}`),

  getTemplate: (id: number) =>
    api.get<NotificationTemplate>(`/admin/notification-templates/${id}`),

  updateTemplate: (id: number, data: UpdateNotificationTemplateRequest) =>
    api.put<{ message: string; template: NotificationTemplate }>(
      `/admin/notification-templates/${id}`,
      data,
    ).then((res) => res.template),

  listLogs: (params?: string) =>
    api.get<AdminNotificationLog[]>(`/admin/notification-logs${params ? `?${params}` : ''}`),

  getLog: (id: number) =>
    api.get<AdminNotificationLog>(`/admin/notification-logs/${id}?include=user`),
};
