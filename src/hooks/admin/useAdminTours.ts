import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminToursApi } from '@/lib/api/admin-tours';
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
    ...CACHE_TIME.SHORT,
  });
}

export function useAdminTourDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.tours.detail(id),
    queryFn: () => adminToursApi.get(id),
    enabled: !!id,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTourRequest) => adminToursApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTourRequest }) =>
      adminToursApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useDeleteTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminToursApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useUploadTourImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, files }: { tourId: number; files: File[] }) =>
      adminToursApi.uploadImages(tourId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useDeleteTourImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, mediaId }: { tourId: number; mediaId: number }) =>
      adminToursApi.deleteImage(tourId, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useAdminTourAvailabilities(tourId: number) {
  return useQuery({
    queryKey: queryKeys.admin.tours.availabilities(tourId),
    queryFn: () => adminToursApi.listAvailabilities(tourId),
    enabled: !!tourId,
    ...CACHE_TIME.SHORT,
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, data }: { tourId: number; data: CreateAvailabilityRequest }) =>
      adminToursApi.createAvailability(tourId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useBulkCreateAvailabilities() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availabilities }: { tourId: number; availabilities: CreateAvailabilityRequest[] }) =>
      adminToursApi.bulkCreateAvailabilities(tourId, availabilities),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availId, data }: { tourId: number; availId: number; data: UpdateAvailabilityRequest }) =>
      adminToursApi.updateAvailability(tourId, availId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tourId, availId }: { tourId: number; availId: number }) =>
      adminToursApi.deleteAvailability(tourId, availId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tours.all() });
    },
  });
}
