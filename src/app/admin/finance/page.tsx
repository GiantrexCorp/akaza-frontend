'use client';

import { useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import FinanceStatCards from '@/components/admin/finance/FinanceStatCards';
import MonthlyTrendTable from '@/components/admin/finance/MonthlyTrendTable';
import RecentBookingsTable from '@/components/admin/finance/RecentBookingsTable';
import BookingStatusSection from '@/components/admin/finance/BookingStatusSection';
import { Spinner, EmptyState } from '@/components/ui';
import { useFinanceDashboard } from '@/hooks/admin/useAdminFinance';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

export default function AdminFinancePage() {
  useEffect(() => { document.title = 'Finance | Akaza Admin'; }, []);

  const { data: dashboard, isLoading, isError, error } = useFinanceDashboard();
  useQueryErrorToast(isError, error, 'Failed to load financial dashboard');

  return (
    <AdminProtectedRoute permission="view-financial-dashboard">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Financial Overview</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              Revenue, bookings, and financial insights
            </p>
          </div>

          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : !dashboard ? (
            <EmptyState
              icon={<DollarSign size={48} strokeWidth={1} />}
              title="No Financial Data"
              description="Financial data will appear here once bookings are made."
            />
          ) : (
            <div className="space-y-10">
              <FinanceStatCards dashboard={dashboard} />
              <MonthlyTrendTable trends={dashboard.monthly_trend} />
              <RecentBookingsTable bookings={dashboard.recent_bookings} />
              <BookingStatusSection />
            </div>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
