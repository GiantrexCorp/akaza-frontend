import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminToursApi } from '@/lib/api/admin-tours';
import type { UpdateBookingStatusRequest } from '@/types/tour';

export function useAdminTourBookingList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.tourBookings.list(params),
    queryFn: () => adminToursApi.listBookings(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminTourBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.tourBookings.detail(id),
    queryFn: () => adminToursApi.getBooking(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useUpdateTourBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookingStatusRequest }) =>
      adminToursApi.updateBookingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tourBookings.all() });
    },
  });
}
