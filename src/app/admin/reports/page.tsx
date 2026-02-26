'use client';

import { useState } from 'react';
import { BarChart3, Download } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import ReportFilters from '@/components/admin/finance/ReportFilters';
import ReportBreakdown from '@/components/admin/finance/ReportBreakdown';
import RevenueTable from '@/components/admin/finance/RevenueTable';
import ReportStatusSummary from '@/components/admin/finance/ReportStatusSummary';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminFinanceApi } from '@/lib/api/admin-finance';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute, useAuth } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';
import type { FinanceReport, FinanceReportParams } from '@/types/finance';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function AdminReportsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [lastParams, setLastParams] = useState<FinanceReportParams | null>(null);

  const handleGenerate = async (params: FinanceReportParams) => {
    setLoading(true);
    setLastParams(params);
    try {
      const data = await adminFinanceApi.report(params);
      setReport(data);
    } catch (err) {
      setReport(null);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to generate report');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    if (!lastParams) return;
    setExporting(true);
    try {
      const blob = await adminFinanceApi.exportPdf(lastParams);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-report-${lastParams.from}-to-${lastParams.to}.pdf`;
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
      <AdminLayout>
        <div>
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Financial Reports</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                Generate and export detailed financial reports
              </p>
            </div>
            {canExport && report && (
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
          ) : !report ? (
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
                      {formatCurrency(report.total_revenue)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)] font-sans">
                      {report.date_range.from} — {report.date_range.to}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-sans mt-1 capitalize">
                      {report.period} breakdown
                    </p>
                  </div>
                </div>
              </div>

              <ReportBreakdown breakdown={report.breakdown} />
              <RevenueTable periods={report.revenue_by_period} />
              <ReportStatusSummary summary={report.booking_status_summary} />
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
