import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminUsersApi } from '@/lib/api/admin-users';
import type { CreateUserRequest, UpdateUserRequest } from '@/types/admin';

export function useAdminUserList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(params),
    queryFn: () => adminUsersApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminUserDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.users.detail(id),
    queryFn: () => adminUsersApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUserRequest) => adminUsersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      adminUsersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminUsersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all() });
    },
  });
}
