import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminAuditApi } from '@/lib/api';

export function useAdminAuditList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.audit.list(params),
    queryFn: () => adminAuditApi.list(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminAuditDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.audit.detail(id),
    queryFn: () => adminAuditApi.get(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
