import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminHotelBookingsApi } from '@/lib/api/admin-hotel-bookings';
import type { ReconcileRequest } from '@/types/hotel';

export function useAdminHotelBookingList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.hotelBookings.list(params),
    queryFn: () => adminHotelBookingsApi.list(params),
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useAdminHotelBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.hotelBookings.detail(id),
    queryFn: () => adminHotelBookingsApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useReconcileHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReconcileRequest }) =>
      adminHotelBookingsApi.reconcile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.hotelBookings.all() });
    },
  });
}
