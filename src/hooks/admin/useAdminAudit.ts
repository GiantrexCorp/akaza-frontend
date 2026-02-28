import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminAuditApi } from '@/lib/api/admin-audit';

export function useAdminAuditList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.audit.list(params),
    queryFn: () => adminAuditApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminAuditDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.audit.detail(id),
    queryFn: () => adminAuditApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}
