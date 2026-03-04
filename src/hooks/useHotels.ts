import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
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

export function useHotelDetails(hotelCode: string) {
  return useQuery({
    queryKey: queryKeys.hotels.details(hotelCode),
    queryFn: () => hotelsApi.getDetails(hotelCode),
    enabled: !!hotelCode,
    retry: 2,
    ...CACHE_TIME.LONG,
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
