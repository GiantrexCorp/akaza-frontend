import { api, ApiError, handleUnauthorized, BASE_URL, getUploadHeaders } from './client';
import type {
  AdminTransferVehicle,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  AdminTransferRoute,
  CreateRouteRequest,
  UpdateRouteRequest,
  SetRoutePriceRequest,
  AdminTransferBooking,
  UpdateTransferBookingStatusRequest,
} from '@/types/transfer';

export const adminTransfersApi = {
  // Vehicles
  listVehicles: (params?: string) =>
    api.get<AdminTransferVehicle[]>(`/admin/transfers/vehicles${params ? `?${params}` : ''}`),

  getVehicle: (id: number) =>
    api.get<AdminTransferVehicle>(`/admin/transfers/vehicles/${id}`),

  createVehicle: (data: CreateVehicleRequest) =>
    api.post<AdminTransferVehicle>('/admin/transfers/vehicles', data),

  updateVehicle: (id: number, data: UpdateVehicleRequest) =>
    api.put<AdminTransferVehicle>(`/admin/transfers/vehicles/${id}`, data),

  deleteVehicle: (id: number) =>
    api.delete<{ message: string }>(`/admin/transfers/vehicles/${id}`),

  async uploadVehicleImage(vehicleId: number, file: File): Promise<AdminTransferVehicle> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${BASE_URL}/admin/transfers/vehicles/${vehicleId}/image`, {
      method: 'POST',
      headers: getUploadHeaders(),
      body: formData,
    });
    if (res.status === 401) handleUnauthorized(res.status);
    const json = await res.json();
    if (json?.success) return json.payload as AdminTransferVehicle;
    throw new ApiError(res.status, json?.errors, 'Upload failed');
  },

  deleteVehicleImage: (vehicleId: number) =>
    api.delete<{ message: string }>(`/admin/transfers/vehicles/${vehicleId}/image`),

  // Routes
  listRoutes: (params?: string) =>
    api.get<AdminTransferRoute[]>(`/admin/transfers/routes${params ? `?${params}` : ''}`),

  getRoute: (id: number) =>
    api.get<AdminTransferRoute>(`/admin/transfers/routes/${id}`),

  createRoute: (data: CreateRouteRequest) =>
    api.post<AdminTransferRoute>('/admin/transfers/routes', data),

  updateRoute: (id: number, data: UpdateRouteRequest) =>
    api.put<AdminTransferRoute>(`/admin/transfers/routes/${id}`, data),

  deleteRoute: (id: number) =>
    api.delete<{ message: string }>(`/admin/transfers/routes/${id}`),

  setRoutePrice: (routeId: number, data: SetRoutePriceRequest) =>
    api.post<AdminTransferRoute>(`/admin/transfers/routes/${routeId}/prices`, data),

  // Bookings
  listBookings: (params?: string) =>
    api.get<AdminTransferBooking[]>(`/admin/transfer-bookings${params ? `?${params}` : ''}`),

  getBooking: (id: number) =>
    api.get<AdminTransferBooking>(`/admin/transfer-bookings/${id}?include=route,vehicle,statusLogs,user`),

  updateBookingStatus: (id: number, data: UpdateTransferBookingStatusRequest) =>
    api.patch<AdminTransferBooking>(`/admin/transfer-bookings/${id}/status`, data),

  downloadVoucher: (id: number) =>
    api.download(`/admin/transfer-bookings/${id}/voucher`),
};
