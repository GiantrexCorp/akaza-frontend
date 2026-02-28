import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { toursApi } from '@/lib/api/tours';
import type { CreateTourBookingRequest } from '@/types/tour';

export function useTourList(params?: string) {
  return useQuery({
    queryKey: queryKeys.tours.list(params),
    queryFn: () => toursApi.list(params),
    ...CACHE_TIME.MEDIUM,
  });
}

export function useTourDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.tours.detail(slug),
    queryFn: () => toursApi.get(slug),
    enabled: !!slug,
    ...CACHE_TIME.MEDIUM,
  });
}

export function useTourAvailabilities(tourId: string) {
  return useQuery({
    queryKey: queryKeys.tours.availabilities(tourId),
    queryFn: () => toursApi.getAvailabilities(tourId),
    enabled: !!tourId,
    ...CACHE_TIME.MEDIUM,
  });
}

export function useCreateTourBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTourBookingRequest) => toursApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.tours() });
    },
  });
}

export function useCancelTourBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toursApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.tours() });
    },
  });
}
