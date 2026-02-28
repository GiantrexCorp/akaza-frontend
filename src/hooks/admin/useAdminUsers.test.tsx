import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminUserList, useAdminUserDetail, useCreateUser, useUpdateUser, useDeleteUser } from './useAdminUsers';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminUserList', () => {
  it('fetches the user list', async () => {
    const { result } = renderHook(() => useAdminUserList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminUserDetail', () => {
  it('fetches a user by id', async () => {
    const { result } = renderHook(() => useAdminUserDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  it('does not fetch when id is 0', () => {
    const { result } = renderHook(() => useAdminUserDetail(0), { wrapper: createWrapper() });
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateUser', () => {
  it('creates a new user', async () => {
    const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ name: 'New User', email: 'new@test.com', password: 'pass123', role_id: 1 });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('New User');
  });
});

describe('useUpdateUser', () => {
  it('updates an existing user', async () => {
    const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { name: 'Updated User' } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('Updated User');
  });
});

describe('useDeleteUser', () => {
  it('deletes a user', async () => {
    const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
