import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTransferVehicles,
  useTransferRoutes,
  useTransferRoutePrices,
  useCreateTransferBooking,
  useCancelTransferBooking,
} from './useTransfers';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useTransferVehicles', () => {
  it('fetches vehicle list', async () => {
    const { result } = renderHook(() => useTransferVehicles(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].name).toBe('Sedan');
  });
});

describe('useTransferRoutes', () => {
  it('fetches route list', async () => {
    const { result } = renderHook(() => useTransferRoutes(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].pickup_name).toBe('Cairo Airport');
  });
});

describe('useTransferRoutePrices', () => {
  it('fetches prices for a route', async () => {
    const { result } = renderHook(() => useTransferRoutePrices('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].price).toBe(150);
  });

  it('does not fetch with empty routeId', () => {
    const { result } = renderHook(() => useTransferRoutePrices(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateTransferBooking', () => {
  it('creates a transfer booking', async () => {
    const { result } = renderHook(() => useCreateTransferBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        route_id: 1,
        vehicle_id: 1,
        pickup_date: '2026-04-01',
        pickup_time: '14:00',
        contact_name: 'Bob',
        contact_email: 'bob@test.com',
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('XB-001');
  });
});

describe('useCancelTransferBooking', () => {
  it('cancels a transfer booking', async () => {
    const { result } = renderHook(() => useCancelTransferBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: '1', data: { reason: 'Changed plans' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('cancelled');
  });
});
