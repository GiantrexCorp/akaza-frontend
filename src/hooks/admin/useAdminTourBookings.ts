import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminToursApi } from '@/lib/api';
import type { UpdateBookingStatusRequest } from '@/types/tour';

export function useAdminTourBookingList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.tourBookings.list(params),
    queryFn: () => adminToursApi.listBookings(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useAdminTourBookingDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.tourBookings.detail(id),
    queryFn: () => adminToursApi.getBooking(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useUpdateTourBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookingStatusRequest }) =>
      adminToursApi.updateBookingStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tourBookings'] });
    },
  });
}
