import { api } from './client';
import type { Customer, UpdateCustomerRequest, CustomerNote, CreateNoteRequest, UpdateNoteRequest, BookingHistoryItem } from '@/types/customer';
import type { PaginatedPayload } from '@/types/api';

export const adminCustomersApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<Customer> | Customer[]>(`/admin/customers${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<Customer>(`/admin/customers/${id}`),

  update: (id: number, data: UpdateCustomerRequest) =>
    api.put<Customer>(`/admin/customers/${id}`, data),

  bookingHistory: (id: number) =>
    api.get<BookingHistoryItem[]>(`/admin/customers/${id}/booking-history`),

  listNotes: (customerId: number) =>
    api.get<CustomerNote[]>(`/admin/customers/${customerId}/notes`),

  createNote: (customerId: number, data: CreateNoteRequest) =>
    api.post<CustomerNote>(`/admin/customers/${customerId}/notes`, data),

  updateNote: (customerId: number, noteId: number, data: UpdateNoteRequest) =>
    api.put<CustomerNote>(`/admin/customers/${customerId}/notes/${noteId}`, data),

  deleteNote: (customerId: number, noteId: number) =>
    api.delete<void>(`/admin/customers/${customerId}/notes/${noteId}`),

  overdueFollowUps: () =>
    api.get<CustomerNote[]>('/admin/customers/follow-ups/overdue'),
};
