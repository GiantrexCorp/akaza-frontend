import { useQuery } from '@tanstack/react-query';
import { queryKeys, CACHE_TIME } from '@/lib/query';
import { adminFinanceApi } from '@/lib/api/admin-finance';
import type { FinanceReportParams } from '@/types/finance';

export function useFinanceDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.finance.dashboard(),
    queryFn: () => adminFinanceApi.dashboard(),
    ...CACHE_TIME.SHORT,
  });
}

export function useRevenue(params: Partial<FinanceReportParams>) {
  const paramStr = JSON.stringify(params);
  return useQuery({
    queryKey: queryKeys.admin.finance.revenue(paramStr),
    queryFn: () => adminFinanceApi.revenue(params),
    ...CACHE_TIME.SHORT,
  });
}

export function useFinanceReport(params: Partial<FinanceReportParams>) {
  const paramStr = JSON.stringify(params);
  return useQuery({
    queryKey: queryKeys.admin.finance.report(paramStr),
    queryFn: () => adminFinanceApi.report(params),
    ...CACHE_TIME.SHORT,
  });
}

export function useBookingStatusSummary() {
  return useQuery({
    queryKey: queryKeys.admin.finance.bookingStatusSummary(),
    queryFn: () => adminFinanceApi.bookingStatusSummary(),
    ...CACHE_TIME.SHORT,
  });
}
