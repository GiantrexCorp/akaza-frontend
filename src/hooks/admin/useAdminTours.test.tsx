import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAdminTourList,
  useAdminTourDetail,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
  useAdminTourAvailabilities,
  useCreateAvailability,
  useDeleteAvailability,
} from './useAdminTours';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminTourList', () => {
  it('fetches the tour list', async () => {
    const { result } = renderHook(() => useAdminTourList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useAdminTourDetail', () => {
  it('fetches a tour by id', async () => {
    const { result } = renderHook(() => useAdminTourDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useAdminTourDetail(0), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateTour', () => {
  it('creates a new tour', async () => {
    const { result } = renderHook(() => useCreateTour(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        title: { en: 'Luxor Tour', de: 'Luxor Tour', fr: 'Tour de Luxor' },
        description: { en: 'Visit Luxor', de: 'Luxor besuchen', fr: 'Visiter Luxor' },
        duration: '6 hours',
        price_per_person: 75,
        max_participants: 20,
        location: { en: 'Luxor', de: 'Luxor', fr: 'Luxor' },
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.title).toBe('Luxor Tour');
  });
});

describe('useUpdateTour', () => {
  it('updates an existing tour', async () => {
    const { result } = renderHook(() => useUpdateTour(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { price_per_person: 60 } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useDeleteTour', () => {
  it('deletes a tour', async () => {
    const { result } = renderHook(() => useDeleteTour(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useAdminTourAvailabilities', () => {
  it('fetches availabilities for a tour', async () => {
    const { result } = renderHook(() => useAdminTourAvailabilities(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useCreateAvailability', () => {
  it('creates an availability slot', async () => {
    const { result } = renderHook(() => useCreateAvailability(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ tourId: 1, data: { date: '2026-03-16', max_participants: 20 } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useDeleteAvailability', () => {
  it('deletes an availability slot', async () => {
    const { result } = renderHook(() => useDeleteAvailability(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ tourId: 1, availId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
