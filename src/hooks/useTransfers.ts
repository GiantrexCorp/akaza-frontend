import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { transfersApi } from '@/lib/api/transfers';
import type { CreateTransferBookingRequest } from '@/types/transfer';

export function useTransferVehicles() {
  return useQuery({
    queryKey: queryKeys.transfers.vehicles(),
    queryFn: () => transfersApi.listVehicles(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useTransferRoutes() {
  return useQuery({
    queryKey: queryKeys.transfers.routes(),
    queryFn: () => transfersApi.listRoutes(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useTransferRoutePrices(routeId: string) {
  return useQuery({
    queryKey: queryKeys.transfers.routePrices(routeId),
    queryFn: () => transfersApi.getRoutePrices(routeId),
    enabled: !!routeId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useCreateTransferBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransferBookingRequest) => transfersApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'transfers'] });
    },
  });
}

export function useCancelTransferBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { reason?: string } }) =>
      transfersApi.cancelBooking(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'transfers'] });
    },
  });
}
