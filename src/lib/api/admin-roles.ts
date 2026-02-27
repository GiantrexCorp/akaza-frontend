import { api } from './client';
import type { AdminRole, CreateRoleRequest, UpdateRoleRequest } from '@/types/admin';
import type { PaginatedPayload } from '@/types/api';

export const adminRolesApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<AdminRole> | AdminRole[]>(`/admin/roles${params ? `?${params}` : ''}`),

  get: (id: number, params?: string) =>
    api.get<AdminRole>(`/admin/roles/${id}${params ? `?${params}` : ''}`),

  create: (data: CreateRoleRequest) =>
    api.post<AdminRole>('/admin/roles', data),

  update: (id: number, data: UpdateRoleRequest) =>
    api.put<AdminRole>(`/admin/roles/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/admin/roles/${id}`),
};
