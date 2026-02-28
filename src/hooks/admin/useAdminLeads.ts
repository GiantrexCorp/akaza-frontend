import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminLeadsApi } from '@/lib/api/admin-leads';
import type { CreateLeadRequest, UpdateLeadRequest } from '@/types/customer';

export function useAdminLeadList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.leads.list(params),
    queryFn: () => adminLeadsApi.list(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminLeadDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.leads.detail(id),
    queryFn: () => adminLeadsApi.get(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadRequest) => adminLeadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadRequest }) =>
      adminLeadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminLeadsApi.convert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] });
    },
  });
}
