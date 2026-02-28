import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { hotelsApi } from '@/lib/api/hotels';
import type { HotelSearchParams, CheckRateRequest, CreateHotelBookingRequest } from '@/types/hotel';

export function useHotelSearch() {
  return useMutation({
    mutationFn: (params: HotelSearchParams) => hotelsApi.search(params),
  });
}

export function useHotelCheckRate() {
  return useMutation({
    mutationFn: (data: CheckRateRequest) => hotelsApi.checkRate(data),
  });
}

export function useCreateHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHotelBookingRequest) => hotelsApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.hotels() });
    },
  });
}

export function useCancelHotelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => hotelsApi.cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.hotels() });
    },
  });
}
