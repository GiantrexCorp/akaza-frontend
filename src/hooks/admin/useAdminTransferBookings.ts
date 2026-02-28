import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import type { UpdateTransferBookingStatusRequest } from '@/types/transfer';

export function useAdminTransferBookingList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.transferBookings.list(params),
    queryFn: () => adminTransfersApi.listBookings(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminTransferBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.transferBookings.detail(id),
    queryFn: () => adminTransfersApi.getBooking(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
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
