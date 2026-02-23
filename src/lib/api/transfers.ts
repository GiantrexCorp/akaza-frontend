import { api } from './client';
import type { TransferVehicle, TransferRoute, TransferRoutePrice, TransferBooking, CreateTransferBookingRequest } from '@/types/transfer';
import type { PaginatedPayload } from '@/types/api';

export const transfersApi = {
  listVehicles: () =>
    api.get<TransferVehicle[]>('/transfers/vehicles'),

  listRoutes: () =>
    api.get<TransferRoute[]>('/transfers/routes'),

  getRoutePrices: (routeId: string) =>
    api.get<TransferRoutePrice[]>(`/transfers/routes/${routeId}/prices`),

  createBooking: (data: CreateTransferBookingRequest) =>
    api.post<TransferBooking>('/transfers/bookings', data),

  listBookings: (params?: string) =>
    api.get<PaginatedPayload<TransferBooking>>(`/transfers/bookings${params ? `?${params}` : ''}`),

  getBooking: (id: string) =>
    api.get<TransferBooking>(`/transfers/bookings/${id}`),

  cancelBooking: (id: string) =>
    api.post<TransferBooking>(`/transfers/bookings/${id}/cancel`),

  downloadVoucher: (id: string) =>
    api.download(`/transfers/bookings/${id}/voucher`),
};
