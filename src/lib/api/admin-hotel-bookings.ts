import { api } from './client';
import type { AdminHotelBooking, ReconcileRequest } from '@/types/hotel';
import type { PaginatedPayload } from '@/types/api';

export const adminHotelBookingsApi = {
  list: (params?: string) =>
    api.get<PaginatedPayload<AdminHotelBooking>>(`/admin/hotel-bookings${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<AdminHotelBooking>(`/admin/hotel-bookings/${id}?include=rooms.guests,statusLogs.actor,user`),

  reconcile: (id: number, data: ReconcileRequest) =>
    api.post<AdminHotelBooking>(`/admin/hotel-bookings/${id}/reconcile`, data),

  downloadVoucher: (id: number) =>
    api.download(`/admin/hotel-bookings/${id}/voucher`),
};
