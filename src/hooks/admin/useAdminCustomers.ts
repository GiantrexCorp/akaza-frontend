import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminCustomersApi } from '@/lib/api/admin-customers';
import type { UpdateCustomerRequest, CreateNoteRequest, UpdateNoteRequest } from '@/types/customer';

export function useAdminCustomerList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.customers.list(params),
    queryFn: () => adminCustomersApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminCustomerDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.customers.detail(id),
    queryFn: () => adminCustomersApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerRequest }) =>
      adminCustomersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customers.all() });
    },
  });
}

export function useCustomerBookingHistory(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.customers.bookingHistory(id),
    queryFn: () => adminCustomersApi.bookingHistory(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useCustomerNotes(customerId: number) {
  return useQuery({
    queryKey: queryKeys.admin.customers.notes(customerId),
    queryFn: () => adminCustomersApi.listNotes(customerId),
    enabled: !!customerId,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: CreateNoteRequest }) =>
      adminCustomersApi.createNote(customerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customers.all() });
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId, data }: { customerId: number; noteId: number; data: UpdateNoteRequest }) =>
      adminCustomersApi.updateNote(customerId, noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customers.all() });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, noteId }: { customerId: number; noteId: number }) =>
      adminCustomersApi.deleteNote(customerId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customers.all() });
    },
  });
}
