'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Target } from 'lucide-react';
import LeadListFilters from '@/components/admin/leads/LeadListFilters';
import LeadTable from '@/components/admin/leads/LeadTable';
import dynamic from 'next/dynamic';
const CreateLeadModal = dynamic(() => import('@/components/admin/leads/CreateLeadModal'), { ssr: false });
import LeadDetailPanel from '@/components/admin/leads/LeadDetailPanel';
import { Button, Spinner, EmptyState, Pagination } from '@/components/ui';
import { useAdminLeadList } from '@/hooks/admin/useAdminLeads';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { Lead } from '@/types/customer';

export default function AdminLeadsPage() {
  useEffect(() => { document.title = 'Leads | Akaza Admin'; }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('per_page', '15');
    params.set('sort', '-created_at');
    params.set('include', 'customer');
    if (filters.search) params.set('filter[name]', filters.search);
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.source) params.set('filter[source]', filters.source);
    return params.toString();
  }, [currentPage, filters]);

  const { data: raw, isLoading, isError, error } = useAdminLeadList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load leads');

  const leads: Lead[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const lastPage = Array.isArray(raw) ? 1 : (raw?.meta?.last_page ?? 1);
  const total = Array.isArray(raw) ? leads.length : (raw?.meta?.total ?? 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleLeadCreated = () => {
    setCreateModalOpen(false);
  };

  const handleLeadUpdated = () => {
    setSelectedLead(null);
  };

  return (
    <AdminProtectedRoute permission="manage-leads">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Leads</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                {total} lead{total !== 1 ? 's' : ''} total
              </p>
            </div>
            <Button
              icon={<Plus size={14} />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Lead
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <LeadListFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : leads.length === 0 ? (
            <EmptyState
              icon={<Target size={48} strokeWidth={1} />}
              title="No Leads Found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <LeadTable leads={leads} onRowClick={setSelectedLead} />
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>

        <CreateLeadModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={handleLeadCreated}
        />

        <LeadDetailPanel
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdated={handleLeadUpdated}
        />
    </AdminProtectedRoute>
  );
}
