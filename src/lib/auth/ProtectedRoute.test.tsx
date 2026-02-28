import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { API_URL } from '@/test/mocks/handlers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './AuthProvider';
import ProtectedRoute from './ProtectedRoute';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/dashboard',
  redirect: vi.fn(),
}));

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
  mockPush.mockClear();
});

describe('ProtectedRoute', () => {
  it('shows spinner while loading', () => {
    localStorage.setItem('auth_token', 'test-token');
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>,
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children for authenticated customer', async () => {
    localStorage.setItem('auth_token', 'test-token');
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when unauthenticated', async () => {
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json(
          { success: false, errors: ['Unauthenticated.'], status: 401 },
          { status: 401 },
        );
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
      );
    });
  });

  it('redirects admin user to /admin', async () => {
    localStorage.setItem('auth_token', 'admin-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({
          success: true,
          payload: {
            id: 2,
            name: 'Admin User',
            email: 'admin@example.com',
            phone: null,
            type: 'admin',
            status: 'active',
            locale: 'en',
            last_active_at: null,
            roles: [{ id: 1, name: 'admin' }],
            permissions: ['list-users'],
          },
        });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin');
    });
  });
});
