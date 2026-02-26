import { api } from './client';
import type { AdminUser, CreateUserRequest, UpdateUserRequest } from '@/types/admin';
import type { PaginatedPayload } from '@/types/api';

export const adminUsersApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<AdminUser>>(`/admin/users${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<AdminUser>(`/admin/users/${id}`),

  create: (data: CreateUserRequest) =>
    api.post<AdminUser>('/admin/users', data),

  update: (id: number, data: UpdateUserRequest) =>
    api.put<AdminUser>(`/admin/users/${id}`, data),

  delete: (id: number) =>
    api.delete<void>(`/admin/users/${id}`),
};
