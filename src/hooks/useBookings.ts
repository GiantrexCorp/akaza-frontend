import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { hotelsApi } from '@/lib/api/hotels';
import { toursApi } from '@/lib/api/tours';
import { transfersApi } from '@/lib/api/transfers';

export function useHotelBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.hotels(params),
    queryFn: () => hotelsApi.listBookings(params),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useTourBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.tours(params),
    queryFn: () => toursApi.listBookings(params),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useTransferBookings(params?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.bookings.transfers(params),
    queryFn: () => transfersApi.listBookings(params),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useHotelBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.hotelDetail(id),
    queryFn: () => hotelsApi.getBooking(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useTourBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.tourDetail(id),
    queryFn: () => toursApi.getBooking(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useTransferBookingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.bookings.transferDetail(id),
    queryFn: () => transfersApi.getBooking(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
