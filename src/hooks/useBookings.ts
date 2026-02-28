import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { hotelsApi } from '@/lib/api/hotels';
import { toursApi } from '@/lib/api/tours';
import { transfersApi } from '@/lib/api/transfers';

export function useHotelBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.hotels(params),
    queryFn: () => hotelsApi.listBookings(params),
    enabled,
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useTourBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.tours(params),
    queryFn: () => toursApi.listBookings(params),
    enabled,
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useTransferBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.transfers(params),
    queryFn: () => transfersApi.listBookings(params),
    enabled,
    ...CACHE_TIME.SHORT,
    placeholderData: keepPreviousData,
  });
}

export function useHotelBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.hotelDetail(id),
    queryFn: () => hotelsApi.getBooking(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useTourBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.tourDetail(id),
    queryFn: () => toursApi.getBooking(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useTransferBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.transferDetail(id),
    queryFn: () => transfersApi.getBooking(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}
