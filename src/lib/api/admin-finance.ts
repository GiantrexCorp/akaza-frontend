import { api } from './client';
import type {
  FinanceDashboard,
  MonthlyTrendItem,
  FinanceReport,
  FinanceReportParams,
  BookingStatusSummary,
} from '@/types/finance';

function buildQuery(params: Partial<FinanceReportParams>): string {
  const qs = new URLSearchParams();
  if (params.period) qs.set('period', params.period);
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const adminFinanceApi = {
  dashboard: () => api.get<FinanceDashboard>('/admin/finance/dashboard'),

  revenue: (params: Partial<FinanceReportParams>) =>
    api.get<MonthlyTrendItem[]>(`/admin/finance/revenue${buildQuery(params)}`),

  report: (params: Partial<FinanceReportParams>) =>
    api.get<FinanceReport>(`/admin/finance/reports${buildQuery(params)}`),

  exportPdf: (params: Partial<FinanceReportParams>) =>
    api.download(`/admin/finance/reports/export${buildQuery(params)}`),

  bookingStatusSummary: () =>
    api.get<BookingStatusSummary>('/admin/finance/booking-status-summary'),
};
