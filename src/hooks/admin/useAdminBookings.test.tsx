import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminHotelBookingList, useAdminHotelBookingDetail, useReconcileHotelBooking } from './useAdminHotelBookings';
import { useAdminTourBookingList, useAdminTourBookingDetail, useUpdateTourBookingStatus } from './useAdminTourBookings';
import { useAdminTransferBookingList, useAdminTransferBookingDetail, useUpdateTransferBookingStatus } from './useAdminTransferBookings';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminHotelBookingList', () => {
  it('fetches hotel booking list', async () => {
    const { result } = renderHook(() => useAdminHotelBookingList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminHotelBookingDetail', () => {
  it('fetches a hotel booking by id', async () => {
    const { result } = renderHook(() => useAdminHotelBookingDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.booking_reference).toBe('HB-001');
  });
});

describe('useReconcileHotelBooking', () => {
  it('reconciles a hotel booking', async () => {
    const { result } = renderHook(() => useReconcileHotelBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { action: 'refund', reason: 'Payment mismatch' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminTourBookingList', () => {
  it('fetches tour booking list', async () => {
    const { result } = renderHook(() => useAdminTourBookingList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useAdminTourBookingDetail', () => {
  it('fetches a tour booking by id', async () => {
    const { result } = renderHook(() => useAdminTourBookingDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.booking_reference).toBe('TB-001');
  });
});

describe('useUpdateTourBookingStatus', () => {
  it('updates tour booking status', async () => {
    const { result } = renderHook(() => useUpdateTourBookingStatus(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { status: 'completed' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('completed');
  });
});

describe('useAdminTransferBookingList', () => {
  it('fetches transfer booking list', async () => {
    const { result } = renderHook(() => useAdminTransferBookingList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useAdminTransferBookingDetail', () => {
  it('fetches a transfer booking by id', async () => {
    const { result } = renderHook(() => useAdminTransferBookingDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.booking_reference).toBe('XB-001');
  });
});

describe('useUpdateTransferBookingStatus', () => {
  it('updates transfer booking status', async () => {
    const { result } = renderHook(() => useUpdateTransferBookingStatus(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { status: 'completed' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('completed');
  });
});
