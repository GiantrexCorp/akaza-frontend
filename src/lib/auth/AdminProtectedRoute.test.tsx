import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { API_URL } from '@/test/mocks/handlers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './AuthProvider';
import AdminProtectedRoute from './AdminProtectedRoute';

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
  usePathname: () => '/admin',
  redirect: vi.fn(),
}));

const adminUser = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  phone: null,
  type: 'admin' as const,
  status: 'active' as const,
  locale: 'en' as const,
  last_active_at: null,
  roles: [{ id: 1, name: 'admin' }],
  permissions: ['list-users', 'show-user', 'manage-hotel-bookings'],
};

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

describe('AdminProtectedRoute', () => {
  it('shows spinner while loading', () => {
    localStorage.setItem('auth_token', 'admin-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({ success: true, payload: adminUser });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <AdminProtectedRoute>
          <div>Admin Content</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  it('renders children for admin user without permission requirement', async () => {
    localStorage.setItem('auth_token', 'admin-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({ success: true, payload: adminUser });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <AdminProtectedRoute>
          <div>Admin Content</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
  });

  it('renders children when admin has required permission', async () => {
    localStorage.setItem('auth_token', 'admin-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({ success: true, payload: adminUser });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <AdminProtectedRoute permission="list-users">
          <div>Users Page</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Users Page')).toBeInTheDocument();
    });
  });

  it('redirects when admin lacks required permission', async () => {
    localStorage.setItem('auth_token', 'admin-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({ success: true, payload: adminUser });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <AdminProtectedRoute permission="manage-settings">
          <div>Settings Page</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/admin/users');
    });

    expect(screen.queryByText('Settings Page')).not.toBeInTheDocument();
  });

  it('renders children for super-admin regardless of permission', async () => {
    localStorage.setItem('auth_token', 'super-token');
    server.use(
      http.get(`${API_URL}/profile`, () => {
        return HttpResponse.json({
          success: true,
          payload: {
            ...adminUser,
            roles: [{ id: 1, name: 'super-admin' }],
            permissions: [],
          },
        });
      }),
    );

    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <AdminProtectedRoute permission="manage-settings">
          <div>Settings Page</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByText('Settings Page')).toBeInTheDocument();
    });
  });

  it('renders nothing when not authenticated', async () => {
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
        <AdminProtectedRoute>
          <div>Admin Content</div>
        </AdminProtectedRoute>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
    });
  });
});
