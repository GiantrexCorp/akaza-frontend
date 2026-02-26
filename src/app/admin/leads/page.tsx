'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Target } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import LeadListFilters from '@/components/admin/leads/LeadListFilters';
import LeadTable from '@/components/admin/leads/LeadTable';
import CreateLeadModal from '@/components/admin/leads/CreateLeadModal';
import LeadDetailPanel from '@/components/admin/leads/LeadDetailPanel';
import { Button, Spinner, EmptyState, Pagination } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminLeadsApi } from '@/lib/api/admin-leads';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { Lead } from '@/types/customer';

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async (page: number, filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('per_page', '15');
      params.set('sort', '-created_at');
      params.set('include', 'customer');
      if (filterParams.search) params.set('filter[name]', filterParams.search);
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.source) params.set('filter[source]', filterParams.source);
      const raw = await adminLeadsApi.list(params.toString());
      if (Array.isArray(raw)) {
        setLeads(raw);
        setCurrentPage(1);
        setLastPage(1);
        setTotal(raw.length);
      } else {
        setLeads(raw?.data ?? []);
        setCurrentPage(raw?.meta?.current_page ?? 1);
        setLastPage(raw?.meta?.last_page ?? 1);
        setTotal(raw?.meta?.total ?? 0);
      }
    } catch (err) {
      setLeads([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load leads');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLeads(1, filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchLeads(page, filters);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  const handleLeadCreated = () => {
    setCreateModalOpen(false);
    fetchLeads(currentPage, filters);
  };

  const handleLeadUpdated = () => {
    setSelectedLead(null);
    fetchLeads(currentPage, filters);
  };

  return (
    <AdminProtectedRoute permission="manage-leads">
      <AdminLayout>
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
          {loading ? (
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
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
