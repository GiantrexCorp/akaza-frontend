import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfile, useUpdateProfile, useChangePassword } from './useProfile';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useProfile', () => {
  it('fetches the current user profile', async () => {
    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('Test User');
    expect(result.current.data?.email).toBe('test@example.com');
  });
});

describe('useUpdateProfile', () => {
  it('updates the user profile', async () => {
    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ name: 'Updated User' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('Updated User');
  });
});

describe('useChangePassword', () => {
  it('changes the user password', async () => {
    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({
        current_password: 'oldpass123',
        password: 'newpass456',
        password_confirmation: 'newpass456',
      });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.message).toBe('Password changed successfully');
  });
});
