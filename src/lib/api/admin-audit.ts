import { api } from './client';
import type { AuditLog } from '@/types/audit';
import type { PaginatedPayload } from '@/types/api';

export const adminAuditApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<AuditLog> | AuditLog[]>(`/admin/audit-logs${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<AuditLog>(`/admin/audit-logs/${id}`),
};
