import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAdminRoleList, useCreateRole, useDeleteRole } from './useAdminRoles';
import { useAdminLeadList, useCreateLead, useConvertLead } from './useAdminLeads';
import { useFinanceDashboard, useBookingStatusSummary } from './useAdminFinance';
import { useAdminAuditList, useAdminAuditDetail } from './useAdminAudit';
import { useNotificationTemplates, useNotificationLogs, useUpdateNotificationTemplate } from './useAdminNotifications';
import { useAdminSettingsList, useBulkUpdateSettings } from './useAdminSettings';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useAdminRoleList', () => {
  it('fetches the role list', async () => {
    const { result } = renderHook(() => useAdminRoleList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useCreateRole', () => {
  it('creates a new role', async () => {
    const { result } = renderHook(() => useCreateRole(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ name: 'editor', display_name: 'Editor', permissions: [] });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('editor');
  });
});

describe('useDeleteRole', () => {
  it('deletes a role', async () => {
    const { result } = renderHook(() => useDeleteRole(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

describe('useAdminLeadList', () => {
  it('fetches the lead list', async () => {
    const { result } = renderHook(() => useAdminLeadList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useCreateLead', () => {
  it('creates a new lead', async () => {
    const { result } = renderHook(() => useCreateLead(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ name: 'New Lead', email: 'lead@test.com', source: 'manual' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('New Lead');
  });
});

describe('useConvertLead', () => {
  it('converts a lead to customer', async () => {
    const { result } = renderHook(() => useConvertLead(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate(1);
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.status).toBe('converted');
  });
});

describe('useFinanceDashboard', () => {
  it('fetches the finance dashboard', async () => {
    const { result } = renderHook(() => useFinanceDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.total_revenue).toBe(50000);
  });
});

describe('useBookingStatusSummary', () => {
  it('fetches booking status summary', async () => {
    const { result } = renderHook(() => useBookingStatusSummary(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminAuditList', () => {
  it('fetches the audit log list', async () => {
    const { result } = renderHook(() => useAdminAuditList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminAuditDetail', () => {
  it('fetches an audit log by id', async () => {
    const { result } = renderHook(() => useAdminAuditDetail(1), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.action).toBe('create');
  });
});

describe('useNotificationTemplates', () => {
  it('fetches notification templates', async () => {
    const { result } = renderHook(() => useNotificationTemplates(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useNotificationLogs', () => {
  it('fetches notification logs', async () => {
    const { result } = renderHook(() => useNotificationLogs(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});

describe('useUpdateNotificationTemplate', () => {
  it('updates a notification template', async () => {
    const { result } = renderHook(() => useUpdateNotificationTemplate(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ id: 1, data: { subject: { en: 'Updated Subject' } } });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useAdminSettingsList', () => {
  it('fetches all settings', async () => {
    const { result } = renderHook(() => useAdminSettingsList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});

describe('useBulkUpdateSettings', () => {
  it('updates settings in bulk', async () => {
    const { result } = renderHook(() => useBulkUpdateSettings(), { wrapper: createWrapper() });
    act(() => {
      result.current.mutate({ site_name: 'Akaza Travel Updated' });
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
