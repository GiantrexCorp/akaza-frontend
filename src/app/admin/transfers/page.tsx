'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Car, Route, Plus } from 'lucide-react';
import VehicleFilters from '@/components/admin/transfers/VehicleFilters';
import VehicleTable from '@/components/admin/transfers/VehicleTable';
import RouteFilters from '@/components/admin/transfers/RouteFilters';
import RouteTable from '@/components/admin/transfers/RouteTable';
import { Spinner, EmptyState, Button } from '@/components/ui';
import { useAdminVehicleList, useAdminRouteList } from '@/hooks/admin/useAdminTransfers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { AdminProtectedRoute } from '@/lib/auth';

type Tab = 'vehicles' | 'routes';

export default function AdminTransfersPage() {
  useEffect(() => { document.title = 'Transfers | Akaza Admin'; }, []);
  const [activeTab, setActiveTab] = useState<Tab>('vehicles');
  const [vehicleFilters, setVehicleFilters] = useState<Record<string, string>>({});
  const [routeFilters, setRouteFilters] = useState<Record<string, string>>({});

  const vehicleQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('sort', 'sort_order');
    if (vehicleFilters.status) params.set('filter[status]', vehicleFilters.status);
    if (vehicleFilters.type) params.set('filter[type]', vehicleFilters.type);
    return params.toString();
  }, [vehicleFilters]);

  const routeQueryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set('sort', '-created_at');
    if (routeFilters.status) params.set('filter[status]', routeFilters.status);
    if (routeFilters.transfer_type) params.set('filter[transfer_type]', routeFilters.transfer_type);
    return params.toString();
  }, [routeFilters]);

  const {
    data: vehicles = [],
    isLoading: vehiclesLoading,
    isError: vehiclesError,
    error: vehiclesErr,
  } = useAdminVehicleList(vehicleQueryParams);
  useQueryErrorToast(vehiclesError, vehiclesErr, 'Failed to load vehicles');

  const {
    data: routes = [],
    isLoading: routesLoading,
    isError: routesError,
    error: routesErr,
  } = useAdminRouteList(routeQueryParams);
  useQueryErrorToast(routesError, routesErr, 'Failed to load routes');

  const vehicleList = Array.isArray(vehicles) ? vehicles : [];
  const routeList = Array.isArray(routes) ? routes : [];

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
              ) : vehicleList.length === 0 ? (
                <EmptyState
                  icon={<Car size={48} strokeWidth={1} />}
                  title="No Vehicles Found"
                  description="Try adjusting your filters or create a new vehicle."
                />
              ) : (
                <VehicleTable vehicles={vehicleList} />
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
              ) : routeList.length === 0 ? (
                <EmptyState
                  icon={<Route size={48} strokeWidth={1} />}
                  title="No Routes Found"
                  description="Try adjusting your filters or create a new route."
                />
              ) : (
                <RouteTable routes={routeList} />
              )}
            </>
          )}
        </div>
    </AdminProtectedRoute>
  );
}
