import { api } from './client';
import type { HotelSearchResult, HotelSearchParams, CheckRateRequest, HotelBooking, CreateHotelBookingRequest, CancellationCost } from '@/types/hotel';
import type { PaginatedPayload } from '@/types/api';

export const hotelsApi = {
  search: (params: HotelSearchParams) =>
    api.post<HotelSearchResult[]>('/hotels/search', params),

  checkRate: (data: CheckRateRequest) =>
    api.post<HotelSearchResult[]>('/hotels/checkrate', data),

  createBooking: (data: CreateHotelBookingRequest) =>
    api.post<HotelBooking>('/hotels/bookings', data),

  listBookings: (params?: string) =>
    api.get<PaginatedPayload<HotelBooking>>(`/hotels/bookings${params ? `?${params}` : ''}`),

  getBooking: (id: string) =>
    api.get<HotelBooking>(`/hotels/bookings/${id}`),

  cancelBooking: (id: string) =>
    api.post<HotelBooking>(`/hotels/bookings/${id}/cancel`),

  getCancellationCost: (id: string) =>
    api.get<CancellationCost>(`/hotels/bookings/${id}/cancellation-cost`),

  downloadVoucher: (id: string) =>
    api.download(`/hotels/bookings/${id}/voucher`),
};
