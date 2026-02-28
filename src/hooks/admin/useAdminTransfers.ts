import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminTransfersApi } from '@/lib/api';
import type {
  CreateVehicleRequest,
  UpdateVehicleRequest,
  CreateRouteRequest,
  UpdateRouteRequest,
  SetRoutePriceRequest,
} from '@/types/transfer';

export function useAdminVehicleList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.transfers.vehicles(params),
    queryFn: () => adminTransfersApi.listVehicles(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAdminVehicleDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.transfers.vehicleDetail(id),
    queryFn: () => adminTransfersApi.getVehicle(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => adminTransfersApi.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVehicleRequest }) =>
      adminTransfersApi.updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'vehicles'] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminTransfersApi.deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'vehicles'] });
    },
  });
}

export function useUploadVehicleImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vehicleId, file }: { vehicleId: number; file: File }) =>
      adminTransfersApi.uploadVehicleImage(vehicleId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'vehicles'] });
    },
  });
}

export function useDeleteVehicleImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleId: number) => adminTransfersApi.deleteVehicleImage(vehicleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'vehicles'] });
    },
  });
}

export function useAdminRouteList(params?: string) {
  return useQuery({
    queryKey: queryKeys.admin.transfers.routes(params),
    queryFn: () => adminTransfersApi.listRoutes(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useAdminRouteDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.transfers.routeDetail(id),
    queryFn: () => adminTransfersApi.getRoute(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRouteRequest) => adminTransfersApi.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'routes'] });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRouteRequest }) =>
      adminTransfersApi.updateRoute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'routes'] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminTransfersApi.deleteRoute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'routes'] });
    },
  });
}

export function useSetRoutePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ routeId, data }: { routeId: number; data: SetRoutePriceRequest }) =>
      adminTransfersApi.setRoutePrice(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'transfers', 'routes'] });
    },
  });
}
