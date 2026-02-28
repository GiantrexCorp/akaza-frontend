import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { toursApi } from '@/lib/api';
import type { CreateTourBookingRequest } from '@/types/tour';

export function useTourList(params?: string) {
  return useQuery({
    queryKey: queryKeys.tours.list(params),
    queryFn: () => toursApi.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useTourDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.tours.detail(slug),
    queryFn: () => toursApi.get(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useTourAvailabilities(tourId: string) {
  return useQuery({
    queryKey: queryKeys.tours.availabilities(tourId),
    queryFn: () => toursApi.getAvailabilities(tourId),
    enabled: !!tourId,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useCreateTourBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTourBookingRequest) => toursApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'tours'] });
    },
  });
}

export function useCancelTourBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toursApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'tours'] });
    },
  });
}
