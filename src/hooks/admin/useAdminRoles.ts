import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminRolesApi } from '@/lib/api/admin-roles';
import type { CreateRoleRequest, UpdateRoleRequest } from '@/types/admin';

export function useAdminRoleList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.roles.list(params),
    queryFn: () => adminRolesApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminRoleDetail(id: number, params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.roles.detail(id),
    queryFn: () => adminRolesApi.get(id, params),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleRequest) => adminRolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all() });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleRequest }) =>
      adminRolesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all() });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminRolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.all() });
    },
  });
}
