import { api } from './client';
import type { Lead, CreateLeadRequest, UpdateLeadRequest } from '@/types/customer';
import type { PaginatedPayload } from '@/types/api';

export const adminLeadsApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<Lead> | Lead[]>(`/admin/leads${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<Lead>(`/admin/leads/${id}`),

  create: (data: CreateLeadRequest) =>
    api.post<Lead>('/admin/leads', data),

  update: (id: number, data: UpdateLeadRequest) =>
    api.put<Lead>(`/admin/leads/${id}`, data),

  convert: (id: number) =>
    api.post<Lead>(`/admin/leads/${id}/convert`),
};
