import { api } from './client';
import type { NotificationLog } from '@/types/notification';
import type { PaginatedPayload } from '@/types/api';

export const notificationsApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<NotificationLog>>(`/notifications${params ? `?${params}` : ''}`),

  markAsRead: (id: string) =>
    api.post<NotificationLog>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.post<{ message: string }>('/notifications/read-all'),
};
