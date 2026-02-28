import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { API_URL } from '@/test/mocks/handlers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider, { useAuth } from './AuthProvider';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };
}

beforeEach(() => {
  localStorage.clear();
  document.cookie = 'logged_in=; path=/; max-age=0';
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });
});

describe('AuthProvider', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });
    expect(result.current.loading).toBe(true);
  });

  it('sets user to null when no token in localStorage', async () => {
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json(
          { success: false, errors: ['Unauthenticated.'], status: 401 },
          { status: 401 },
        );
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it('fetches user profile when token exists', async () => {
    localStorage.setItem('auth_token', 'existing-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.name).toBe('Test User');
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('clears token if profile fetch fails', async () => {
    localStorage.setItem('auth_token', 'bad-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json(
          { success: false, errors: ['Unauthenticated.'], status: 401 },
          { status: 401 },
        );
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});

describe('AuthProvider.login', () => {
  it('stores token and sets user on successful login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let user: unknown;
    await act(async () => {
      user = await result.current.login('test@example.com', 'password123');
    });

    expect(localStorage.getItem('auth_token')).toBe('test-token-123');
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('throws on failed login', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () => {
        return HttpResponse.json(
          { success: false, errors: { email: ['Invalid credentials'] }, status: 422 },
          { status: 422 },
        );
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(
      act(async () => {
        await result.current.login('wrong@example.com', 'wrong');
      }),
    ).rejects.toThrow();
  });
});

describe('AuthProvider.logout', () => {
  it('clears token and sets user to null', async () => {
    localStorage.setItem('auth_token', 'existing-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it('clears state even if logout API call fails', async () => {
    localStorage.setItem('auth_token', 'existing-token');
    server.use(
      http.post(`${API_URL}/auth/logout`, () => {
        return HttpResponse.json(
          { success: false, errors: ['Server error'], status: 500 },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.user).not.toBeNull();
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(result.current.user).toBeNull();
  });
});

describe('AuthProvider.refreshUser', () => {
  it('re-fetches user profile', async () => {
    localStorage.setItem('auth_token', 'existing-token');

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({
          success: true,
          payload: {
            id: 1,
            name: 'Updated Name',
            email: 'test@example.com',
            phone: '+201234567890',
            type: 'customer' as const,
            status: 'active' as const,
            locale: 'en' as const,
            last_active_at: null,
            roles: [{ id: 1, name: 'customer' }],
            permissions: [],
          },
        });
      }),
    );

    await act(async () => {
      await result.current.refreshUser();
    });

    expect(result.current.user?.name).toBe('Updated Name');
    expect(result.current.user?.phone).toBe('+201234567890');
  });
});
