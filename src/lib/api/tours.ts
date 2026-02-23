import { api } from './client';
import type { Tour, TourAvailability, TourBooking, CreateTourBookingRequest } from '@/types/tour';
import type { PaginatedPayload } from '@/types/api';

export const toursApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<Tour>>(`/tours${params ? `?${params}` : ''}`),

  get: (id: string) =>
    api.get<Tour>(`/tours/${id}`),

  getAvailabilities: (tourId: string) =>
    api.get<TourAvailability[]>(`/tours/${tourId}/availabilities`),

  createBooking: (data: CreateTourBookingRequest) =>
    api.post<TourBooking>('/tours/bookings', data),

  listBookings: (params?: string) =>
    api.get<PaginatedPayload<TourBooking>>(`/tours/bookings${params ? `?${params}` : ''}`),

  getBooking: (id: string) =>
    api.get<TourBooking>(`/tours/bookings/${id}`),

  cancelBooking: (id: string) =>
    api.post<TourBooking>(`/tours/bookings/${id}/cancel`),

  downloadVoucher: (id: string) =>
    api.download(`/tours/bookings/${id}/voucher`),
};
