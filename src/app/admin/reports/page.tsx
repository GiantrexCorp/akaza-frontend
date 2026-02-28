'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Download } from 'lucide-react';
import ReportFilters from '@/components/admin/finance/ReportFilters';
import ReportBreakdown from '@/components/admin/finance/ReportBreakdown';
import RevenueTable from '@/components/admin/finance/RevenueTable';
import ReportStatusSummary from '@/components/admin/finance/ReportStatusSummary';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useFinanceReport } from '@/hooks/admin/useAdminFinance';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { adminFinanceApi } from '@/lib/api/admin-finance';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { FinanceReportParams } from '@/types/finance';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function AdminReportsPage() {
  useEffect(() => { document.title = 'Reports | Akaza Admin'; }, []);
  const { toast } = useToast();
  const { user } = useAuth();
  const [reportParams, setReportParams] = useState<FinanceReportParams | null>(null);
  const [exporting, setExporting] = useState(false);

  const { data: report, isLoading: queryLoading, isError, error } = useFinanceReport(reportParams ?? {});
  useQueryErrorToast(isError && !!reportParams, error, 'Failed to generate report');

  const loading = !!reportParams && queryLoading;
  const displayReport = reportParams ? report : null;

  const handleGenerate = (params: FinanceReportParams) => {
    setReportParams(params);
  };

  const handleExportPdf = async () => {
    if (!reportParams) return;
    setExporting(true);
    try {
      const blob = await adminFinanceApi.exportPdf(reportParams);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-report-${reportParams.from}-to-${reportParams.to}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to export PDF');
      }
    } finally {
      setExporting(false);
    }
  };

  const canExport = hasPermission(user, 'export-reports');

  return (
    <AdminProtectedRoute permission="view-financial-reports">
        <div>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Financial Reports</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                Generate and export detailed financial reports
              </p>
            </div>
            {canExport && displayReport && reportParams && (
              <button
                onClick={handleExportPdf}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2 border border-primary text-primary text-sm font-sans font-medium hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={14} />
                {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
            )}
          </div>

          <div className="mb-8">
            <ReportFilters onGenerate={handleGenerate} loading={loading} />
          </div>

          {loading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : !displayReport ? (
            <EmptyState
              icon={<BarChart3 size={48} strokeWidth={1} />}
              title="No Report Generated"
              description="Select a date range and click Generate Report to view financial data."
            />
          ) : (
            <div className="space-y-10">
              <div className="border border-[var(--line-soft)] bg-[var(--surface-card)] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-1">
                      Total Revenue
                    </p>
                    <p className="text-3xl font-serif text-[var(--text-primary)]">
                      {formatCurrency(displayReport.total_revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)] font-sans">
                      {displayReport.date_range.from} — {displayReport.date_range.to}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-1 capitalize">
                      {displayReport.period} breakdown
                    </p>
                  </div>
                </div>
              </div>

              <ReportBreakdown breakdown={displayReport.breakdown} />
              <RevenueTable periods={displayReport.revenue_by_period} />
              <ReportStatusSummary summary={displayReport.booking_status_summary} />
            </div>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
