import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { adminFinanceApi } from '@/lib/api/admin-finance';
import type { FinanceReportParams } from '@/types/finance';

export function useFinanceDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.finance.dashboard(),
    queryFn: () => adminFinanceApi.dashboard(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useRevenue(params: Partial<FinanceReportParams>) {
  const paramStr = JSON.stringify(params);
  return useQuery({
    queryKey: queryKeys.admin.finance.revenue(paramStr),
    queryFn: () => adminFinanceApi.revenue(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFinanceReport(params: Partial<FinanceReportParams>) {
  const paramStr = JSON.stringify(params);
  return useQuery({
    queryKey: queryKeys.admin.finance.report(paramStr),
    queryFn: () => adminFinanceApi.report(params),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useBookingStatusSummary() {
  return useQuery({
    queryKey: queryKeys.admin.finance.bookingStatusSummary(),
    queryFn: () => adminFinanceApi.bookingStatusSummary(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
