import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useAdminCustomerList,
  useAdminCustomerDetail,
  useUpdateCustomer,
  useCustomerBookingHistory,
  useCustomerNotes,
  useCreateNote,
  useDeleteNote,
} from './useAdminCustomers';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminCustomerList', () => {
  it('fetches the customer list', async () => {
    const { result } = renderHook(() => useAdminCustomerList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminCustomerDetail', () => {
  it('fetches a customer by id', async () => {
    const { result } = renderHook(() => useAdminCustomerDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useAdminCustomerDetail(0), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useUpdateCustomer', () => {
  it('updates a customer', async () => {
    const { result } = renderHook(() => useUpdateCustomer(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { name: 'John Updated' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('John Updated');
  });
});

describe('useCustomerBookingHistory', () => {
  it('fetches booking history for a customer', async () => {
    const { result } = renderHook(() => useCustomerBookingHistory(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useCustomerNotes', () => {
  it('fetches notes for a customer', async () => {
    const { result } = renderHook(() => useCustomerNotes(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useCreateNote', () => {
  it('creates a note for a customer', async () => {
    const { result } = renderHook(() => useCreateNote(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ customerId: 1, data: { content: 'New note', type: 'general' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.content).toBe('New note');
  });
});

describe('useDeleteNote', () => {
  it('deletes a note', async () => {
    const { result } = renderHook(() => useDeleteNote(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ customerId: 1, noteId: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
