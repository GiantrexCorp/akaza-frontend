import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAdminVehicleList,
  useAdminVehicleDetail,
  useCreateVehicle,
  useDeleteVehicle,
  useAdminRouteList,
  useAdminRouteDetail,
  useCreateRoute,
  useDeleteRoute,
  useSetRoutePrice,
} from './useAdminTransfers';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminVehicleList', () => {
  it('fetches the vehicle list', async () => {
    const { result } = renderHook(() => useAdminVehicleList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useAdminVehicleDetail', () => {
  it('fetches a vehicle by id', async () => {
    const { result } = renderHook(() => useAdminVehicleDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.translated_name).toBe('Sedan');
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useAdminVehicleDetail(0), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateVehicle', () => {
  it('creates a new vehicle', async () => {
    const { result } = renderHook(() => useCreateVehicle(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ name: { en: 'SUV' }, type: 'suv', max_passengers: 5 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.translated_name).toBe('SUV');
  });
});

describe('useDeleteVehicle', () => {
  it('deletes a vehicle', async () => {
    const { result } = renderHook(() => useDeleteVehicle(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useAdminRouteList', () => {
  it('fetches the route list', async () => {
    const { result } = renderHook(() => useAdminRouteList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useAdminRouteDetail', () => {
  it('fetches a route by id', async () => {
    const { result } = renderHook(() => useAdminRouteDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.translated_pickup_name).toBe('Cairo Airport');
  });
});

describe('useCreateRoute', () => {
  it('creates a new route', async () => {
    const { result } = renderHook(() => useCreateRoute(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        transfer_type: 'city',
        pickup_name: { en: 'Giza' },
        dropoff_name: { en: 'Luxor' },
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.transfer_type).toBe('city');
  });
});

describe('useDeleteRoute', () => {
  it('deletes a route', async () => {
    const { result } = renderHook(() => useDeleteRoute(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useSetRoutePrice', () => {
  it('sets a price for a route-vehicle combination', async () => {
    const { result } = renderHook(() => useSetRoutePrice(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ routeId: 1, data: { transfer_vehicle_id: 1, price: 100, currency: 'EUR' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.prices).toBeDefined();
  });
});
