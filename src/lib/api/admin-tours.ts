import { api, ApiError, handleUnauthorized, BASE_URL, getUploadHeaders } from './client';
import type {
  AdminTour,
  CreateTourRequest,
  UpdateTourRequest,
  TourAvailability,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  AdminTourBooking,
  UpdateBookingStatusRequest,
} from '@/types/tour';

export const adminToursApi = {
  list: (params?: string) =>
    api.get<AdminTour[]>(`/admin/tours${params ? `?${params}` : ''}`),

  get: (id: number) =>
    api.get<AdminTour>(`/admin/tours/${id}`),

  create: (data: CreateTourRequest) =>
    api.post<AdminTour>('/admin/tours', data),

  update: (id: number, data: UpdateTourRequest) =>
    api.put<AdminTour>(`/admin/tours/${id}`, data),

  delete: (id: number) =>
    api.delete<{ message: string }>(`/admin/tours/${id}`),

  async uploadImages(tourId: number, files: File[]): Promise<AdminTour> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images[]', file));
    const res = await fetch(`${BASE_URL}/admin/tours/${tourId}/images`, {
      method: 'POST',
      headers: getUploadHeaders(),
      body: formData,
    });
    if (res.status === 401) handleUnauthorized(res.status);
    const json = await res.json();
    if (json?.success) return json.payload as AdminTour;
    throw new ApiError(res.status, json?.errors, 'Upload failed');
  },

  deleteImage: (tourId: number, mediaId: number) =>
    api.delete<{ message: string }>(`/admin/tours/${tourId}/images/${mediaId}`),

  listAvailabilities: (tourId: number) =>
    api.get<TourAvailability[]>(`/admin/tours/${tourId}/availabilities`),

  createAvailability: (tourId: number, data: CreateAvailabilityRequest) =>
    api.post<TourAvailability>(`/admin/tours/${tourId}/availabilities`, data),

  bulkCreateAvailabilities: (tourId: number, availabilities: CreateAvailabilityRequest[]) =>
    api.post<TourAvailability[]>(`/admin/tours/${tourId}/availabilities/bulk`, { availabilities }),

  updateAvailability: (tourId: number, availId: number, data: UpdateAvailabilityRequest) =>
    api.put<TourAvailability>(`/admin/tours/${tourId}/availabilities/${availId}`, data),

  deleteAvailability: (tourId: number, availId: number) =>
    api.delete<{ message: string }>(`/admin/tours/${tourId}/availabilities/${availId}`),

  listBookings: (params?: string) =>
    api.get<AdminTourBooking[]>(`/admin/tour-bookings${params ? `?${params}` : ''}`),

  getBooking: (id: number) =>
    api.get<AdminTourBooking>(`/admin/tour-bookings/${id}?include=tour,guests,statusLogs,user`),

  updateBookingStatus: (id: number, data: UpdateBookingStatusRequest) =>
    api.patch<AdminTourBooking>(`/admin/tour-bookings/${id}/status`, data),

  downloadVoucher: (id: number) =>
    api.download(`/admin/tour-bookings/${id}/voucher`),
};
