import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHotelSearch, useHotelCheckRate, useCreateHotelBooking, useCancelHotelBooking } from './useHotels';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useHotelSearch', () => {
  it('returns idle state initially', () => {
    const { result } = renderHook(() => useHotelSearch(), { wrapper: createWrapper() });
    expect(result.current.isIdle).toBe(true);
  });

  it('performs a search mutation', async () => {
    const { result } = renderHook(() => useHotelSearch(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ destination: 'Cairo', checkIn: '2026-04-01', checkOut: '2026-04-05', rooms: [{ adults: 2 }] });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useHotelCheckRate', () => {
  it('checks rate for a hotel', async () => {
    const { result } = renderHook(() => useHotelCheckRate(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ rateKey: 'rate-1' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useCreateHotelBooking', () => {
  it('creates a hotel booking', async () => {
    const { result } = renderHook(() => useCreateHotelBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        rateKey: 'rate-1',
        holderName: 'John',
        holderSurname: 'Doe',
        holderEmail: 'john@test.com',
        rooms: [{ guests: [{ name: 'John', surname: 'Doe', type: 'AD' as const }] }],
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('HB-001');
  });
});

describe('useCancelHotelBooking', () => {
  it('cancels a hotel booking', async () => {
    const { result } = renderHook(() => useCancelHotelBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate('1');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('cancelled');
  });
});
