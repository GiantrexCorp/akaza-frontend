import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useTourList,
  useTourDetail,
  useTourAvailabilities,
  useCreateTourBooking,
  useCancelTourBooking,
} from './useTours';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useTourList', () => {
  it('fetches tour list', async () => {
    const { result } = renderHook(() => useTourList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].slug).toBe('pyramids-tour');
  });
});

describe('useTourDetail', () => {
  it('fetches a tour by slug', async () => {
    const { result } = renderHook(() => useTourDetail('pyramids-tour'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.title).toBe('Pyramids Tour');
  });

  it('does not fetch with empty slug', () => {
    const { result } = renderHook(() => useTourDetail(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTourAvailabilities', () => {
  it('fetches availabilities for a tour', async () => {
    const { result } = renderHook(() => useTourAvailabilities('1'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].status).toBe('available');
  });

  it('does not fetch with empty tourId', () => {
    const { result } = renderHook(() => useTourAvailabilities(''), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateTourBooking', () => {
  it('creates a tour booking', async () => {
    const { result } = renderHook(() => useCreateTourBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        tour_availability_id: 1,
        guests: 2,
        contact_name: 'Jane',
        contact_email: 'jane@test.com',
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.reference).toBe('TB-001');
  });
});

describe('useCancelTourBooking', () => {
  it('cancels a tour booking', async () => {
    const { result } = renderHook(() => useCancelTourBooking(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate('1');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('cancelled');
  });
});
