import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useHotelBookings,
  useTourBookings,
  useTransferBookings,
  useHotelBookingDetail,
  useTourBookingDetail,
  useTransferBookingDetail,
} from './useBookings';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useHotelBookings', () => {
  it('fetches hotel bookings', async () => {
    const { result } = renderHook(() => useHotelBookings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].reference).toBe('HB-001');
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useHotelBookings(undefined, false), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTourBookings', () => {
  it('fetches tour bookings', async () => {
    const { result } = renderHook(() => useTourBookings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].reference).toBe('TB-001');
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useTourBookings(undefined, false), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTransferBookings', () => {
  it('fetches transfer bookings', async () => {
    const { result } = renderHook(() => useTransferBookings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].reference).toBe('XB-001');
  });

  it('does not fetch when disabled', () => {
    const { result } = renderHook(() => useTransferBookings(undefined, false), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useHotelBookingDetail', () => {
  it('fetches a hotel booking by id', async () => {
    const { result } = renderHook(() => useHotelBookingDetail('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('HB-001');
  });

  it('does not fetch with empty id', () => {
    const { result } = renderHook(() => useHotelBookingDetail(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTourBookingDetail', () => {
  it('fetches a tour booking by id', async () => {
    const { result } = renderHook(() => useTourBookingDetail('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('TB-001');
  });

  it('does not fetch with empty id', () => {
    const { result } = renderHook(() => useTourBookingDetail(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTransferBookingDetail', () => {
  it('fetches a transfer booking by id', async () => {
    const { result } = renderHook(() => useTransferBookingDetail('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('XB-001');
  });

  it('does not fetch with empty id', () => {
    const { result } = renderHook(() => useTransferBookingDetail(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});
