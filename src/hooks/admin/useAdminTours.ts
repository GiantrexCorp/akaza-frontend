import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminToursApi } from '@/lib/api';
import type {
  CreateTourRequest,
  UpdateTourRequest,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
} from '@/types/tour';

export function useAdminTourList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.tours.list(params),
    queryFn: () => adminToursApi.list(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAdminTourDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.tours.detail(id),
    queryFn: () => adminToursApi.get(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTourRequest) => adminToursApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTourRequest }) =>
      adminToursApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminToursApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useUploadTourImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, files }: { tourId: number; files: File[] }) =>
      adminToursApi.uploadImages(tourId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useDeleteTourImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, mediaId }: { tourId: number; mediaId: number }) =>
      adminToursApi.deleteImage(tourId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useAdminTourAvailabilities(tourId: number) {
  return useQuery({
    queryKey: queryKeys.admin.tours.availabilities(tourId),
    queryFn: () => adminToursApi.listAvailabilities(tourId),
    enabled: !!tourId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, data }: { tourId: number; data: CreateAvailabilityRequest }) =>
      adminToursApi.createAvailability(tourId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useBulkCreateAvailabilities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availabilities }: { tourId: number; availabilities: CreateAvailabilityRequest[] }) =>
      adminToursApi.bulkCreateAvailabilities(tourId, availabilities),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availId, data }: { tourId: number; availId: number; data: UpdateAvailabilityRequest }) =>
      adminToursApi.updateAvailability(tourId, availId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availId }: { tourId: number; availId: number }) =>
      adminToursApi.deleteAvailability(tourId, availId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] });
    },
  });
}
