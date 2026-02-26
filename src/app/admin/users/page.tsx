'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Users } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserListFilters from '@/components/admin/users/UserListFilters';
import UserTable from '@/components/admin/users/UserTable';
import CreateUserModal from '@/components/admin/users/CreateUserModal';
import { Button, Spinner, EmptyState, Pagination } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminUsersApi } from '@/lib/api/admin-users';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminUser } from '@/types/admin';

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchUsers = useCallback(async (page: number, filterParams: Record<string, string>) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), ...filterParams });
      const data = await adminUsersApi.list(params.toString());
      setUsers(data?.data ?? []);
      setCurrentPage(data?.current_page ?? 1);
      setLastPage(data?.last_page ?? 1);
      setTotal(data?.total ?? 0);
    } catch (err) {
      setUsers([]);
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers(1, filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    fetchUsers(page, filters);
  };

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
  };

  const handleUserCreated = () => {
    setCreateModalOpen(false);
    fetchUsers(currentPage, filters);
  };

  return (
    <AdminProtectedRoute permission="users.view">
      <AdminLayout>
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
          {loading ? (
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
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
