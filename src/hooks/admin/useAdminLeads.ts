import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminLeadsApi } from '@/lib/api/admin-leads';
import type { CreateLeadRequest, UpdateLeadRequest } from '@/types/customer';

export function useAdminLeadList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.leads.list(params),
    queryFn: () => adminLeadsApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminLeadDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.leads.detail(id),
    queryFn: () => adminLeadsApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadRequest) => adminLeadsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.leads.all() });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLeadRequest }) =>
      adminLeadsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.leads.all() });
    },
  });
}

export function useConvertLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminLeadsApi.convert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.leads.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customers.all() });
    },
  });
}
