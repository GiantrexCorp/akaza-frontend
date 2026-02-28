import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import type { UpdateTransferBookingStatusRequest } from '@/types/transfer';

export function useAdminTransferBookingList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.transferBookings.list(params),
    queryFn: () => adminTransfersApi.listBookings(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminTransferBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.transferBookings.detail(id),
    queryFn: () => adminTransfersApi.getBooking(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useUpdateTransferBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTransferBookingStatusRequest }) =>
      adminTransfersApi.updateBookingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.transferBookings.all() });
    },
  });
}
