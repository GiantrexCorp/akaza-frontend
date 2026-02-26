'use client';

import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';
import FinanceStatCards from '@/components/admin/finance/FinanceStatCards';
import MonthlyTrendTable from '@/components/admin/finance/MonthlyTrendTable';
import RecentBookingsTable from '@/components/admin/finance/RecentBookingsTable';
import BookingStatusSection from '@/components/admin/finance/BookingStatusSection';
import { Spinner, EmptyState } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminFinanceApi } from '@/lib/api/admin-finance';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { FinanceDashboard } from '@/types/finance';

export default function AdminFinancePage() {
  const { toast } = useToast();
  const [dashboard, setDashboard] = useState<FinanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await adminFinanceApi.dashboard();
        if (!cancelled) setDashboard(data);
      } catch (err) {
        if (!cancelled && err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load financial dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [toast]);

  return (
    <AdminProtectedRoute permission="view-financial-dashboard">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Financial Overview</h1>
            <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
              Revenue, bookings, and financial insights
            </p>
          </div>

          {loading ? (
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
