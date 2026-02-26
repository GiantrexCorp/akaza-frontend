'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Car, Route, Plus } from 'lucide-react';
import VehicleFilters from '@/components/admin/transfers/VehicleFilters';
import VehicleTable from '@/components/admin/transfers/VehicleTable';
import RouteFilters from '@/components/admin/transfers/RouteFilters';
import RouteTable from '@/components/admin/transfers/RouteTable';
import { Spinner, EmptyState, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import { AdminProtectedRoute } from '@/lib/auth';
import type { AdminTransferVehicle, AdminTransferRoute } from '@/types/transfer';

type Tab = 'vehicles' | 'routes';

export default function AdminTransfersPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('vehicles');

  // Vehicles state
  const [vehicles, setVehicles] = useState<AdminTransferVehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehicleFilters, setVehicleFilters] = useState<Record<string, string>>({});

  // Routes state
  const [routes, setRoutes] = useState<AdminTransferRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [routeFilters, setRouteFilters] = useState<Record<string, string>>({});

  const fetchVehicles = useCallback(async (filterParams: Record<string, string>) => {
    setVehiclesLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sort', 'sort_order');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.type) params.set('filter[type]', filterParams.type);
      const data = await adminTransfersApi.listVehicles(params.toString());
      setVehicles(data);
    } catch (err) {
      setVehicles([]);
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to load vehicles');
    } finally {
      setVehiclesLoading(false);
    }
  }, [toast]);

  const fetchRoutes = useCallback(async (filterParams: Record<string, string>) => {
    setRoutesLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sort', '-created_at');
      if (filterParams.status) params.set('filter[status]', filterParams.status);
      if (filterParams.transfer_type) params.set('filter[transfer_type]', filterParams.transfer_type);
      const data = await adminTransfersApi.listRoutes(params.toString());
      setRoutes(data);
    } catch (err) {
      setRoutes([]);
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to load routes');
    } finally {
      setRoutesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchVehicles(vehicleFilters);
  }, [vehicleFilters]);

  useEffect(() => {
    fetchRoutes(routeFilters);
  }, [routeFilters]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'vehicles', label: 'Vehicles' },
    { key: 'routes', label: 'Routes' },
  ];

  return (
    <AdminProtectedRoute permission="create-transfer">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-serif text-[var(--text-primary)]">Transfers</h1>
              <p className="text-sm text-[var(--text-muted)] font-sans mt-1">
                Manage vehicles and routes
              </p>
            </div>
            <Link href={activeTab === 'vehicles' ? '/admin/transfers/vehicles/create' : '/admin/transfers/routes/create'}>
              <Button size="sm" icon={<Plus size={14} />}>
                New {activeTab === 'vehicles' ? 'Vehicle' : 'Route'}
              </Button>
            </Link>
          </div>

          {/* Tab bar */}
          <div className="flex gap-6 border-b border-[var(--line-soft)] mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3 text-xs font-sans font-bold uppercase tracking-[0.2em] transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'text-primary border-primary'
                    : 'text-[var(--text-muted)] border-transparent hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Vehicles tab */}
          {activeTab === 'vehicles' && (
            <>
              <div className="mb-6">
                <VehicleFilters onFiltersChange={setVehicleFilters} />
              </div>
              {vehiclesLoading ? (
                <div className="py-16"><Spinner size="lg" /></div>
              ) : vehicles.length === 0 ? (
                <EmptyState
                  icon={<Car size={48} strokeWidth={1} />}
                  title="No Vehicles Found"
                  description="Try adjusting your filters or create a new vehicle."
                />
              ) : (
                <VehicleTable vehicles={vehicles} />
              )}
            </>
          )}

          {/* Routes tab */}
          {activeTab === 'routes' && (
            <>
              <div className="mb-6">
                <RouteFilters onFiltersChange={setRouteFilters} />
              </div>
              {routesLoading ? (
                <div className="py-16"><Spinner size="lg" /></div>
              ) : routes.length === 0 ? (
                <EmptyState
                  icon={<Route size={48} strokeWidth={1} />}
                  title="No Routes Found"
                  description="Try adjusting your filters or create a new route."
                />
              ) : (
                <RouteTable routes={routes} />
              )}
            </>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
