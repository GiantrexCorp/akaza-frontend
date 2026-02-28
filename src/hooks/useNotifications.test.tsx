import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotificationList, useMarkRead, useMarkAllRead } from './useNotifications';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useNotificationList', () => {
  it('fetches notifications', async () => {
    const { result } = renderHook(() => useNotificationList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.data).toHaveLength(1);
    expect(result.current.data?.data[0].type).toBe('booking_confirmed');
  });
});

describe('useMarkRead', () => {
  it('marks a notification as read', async () => {
    const { result } = renderHook(() => useMarkRead(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate('1');
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useMarkAllRead', () => {
  it('marks all notifications as read', async () => {
    const { result } = renderHook(() => useMarkAllRead(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate();
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
