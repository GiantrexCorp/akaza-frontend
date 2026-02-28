'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Users } from 'lucide-react';
import UserListFilters from '@/components/admin/users/UserListFilters';
import UserTable from '@/components/admin/users/UserTable';
import dynamic from 'next/dynamic';
const CreateUserModal = dynamic(() => import('@/components/admin/users/CreateUserModal'), { ssr: false });
import { Button, Spinner, EmptyState, Pagination } from '@/components/ui';
import { useAdminUserList } from '@/hooks/admin/useAdminUsers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminUser } from '@/types/admin';

export default function AdminUsersPage() {
  useEffect(() => { document.title = 'Users | Akaza Admin'; }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('per_page', '15');
    params.set('include', 'roles');
    params.set('sort', '-created_at');
    if (filters.search) params.set('filter[name]', filters.search);
    if (filters.status) params.set('filter[status]', filters.status);
    if (filters.type) params.set('filter[type]', filters.type);
    if (filters.role) params.set('filter[hasRole]', filters.role);
    return params.toString();
  }, [currentPage, filters]);

  const { data: raw, isLoading, isError, error } = useAdminUserList(queryParams);
  useQueryErrorToast(isError, error, 'Failed to load users');

  const users: AdminUser[] = Array.isArray(raw) ? raw : (raw?.data ?? []);
  const lastPage = Array.isArray(raw) ? 1 : (raw?.meta?.last_page ?? 1);
  const total = Array.isArray(raw) ? users.length : (raw?.meta?.total ?? 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleUserCreated = () => {
    setCreateModalOpen(false);
  };

  return (
    <AdminProtectedRoute permission="list-users">
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Users</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                {total} user{total !== 1 ? 's' : ''} total
              </p>
            </div>
            <Button
              icon={<Plus size={14} />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create User
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <UserListFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="py-16">
              <Spinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              icon={<Users size={48} strokeWidth={1} />}
              title="No Users Found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <>
              <UserTable users={users} />
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

        <CreateUserModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={handleUserCreated}
        />
    </AdminProtectedRoute>
  );
}
