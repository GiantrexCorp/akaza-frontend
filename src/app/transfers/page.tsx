'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Car, Users, Briefcase, Plane, MapPin, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge, EmptyState } from '@/components/ui';
import { useTransferVehicles, useTransferRoutes, useTransferRoutePrices } from '@/hooks/useTransfers';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import type { TransferRoute } from '@/types/transfer';
import { formatPrice } from '@/lib/utils/format';

const typeIcons: Record<string, typeof Plane> = {
  airport: Plane,
  city: MapPin,
  chauffeur: Car,
};

export default function TransfersPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<TransferRoute | null>(null);

  const { data: vehicles = [], isLoading: loadingVehicles, isError: isVehiclesError, error: vehiclesError } = useTransferVehicles();
  const { data: routes = [], isLoading: loadingRoutes, isError: isRoutesError, error: routesError } = useTransferRoutes();
  const { data: routePrices = [], isLoading: loadingPrices } = useTransferRoutePrices(selectedRoute?.id ?? '');

  useQueryErrorToast(isVehiclesError, vehiclesError, 'Failed to load vehicles');
  useQueryErrorToast(isRoutesError, routesError, 'Failed to load routes');

  const loading = loadingVehicles || loadingRoutes;

  const handleSelectRoute = (route: TransferRoute) => {
    if (selectedRoute?.id === route.id) {
      setSelectedRoute(null);
      return;
    }
    setSelectedRoute(route);
  };

  const filteredRoutes = selectedType === 'all' ? routes : routes.filter((r) => r.transfer_type === selectedType);

  const transferTypes = [
    { value: 'all', label: 'All' },
    { value: 'airport', label: 'Airport' },
    { value: 'city', label: 'City' },
    { value: 'chauffeur', label: 'Chauffeur' },
  ];

  const getVehicleById = (id: string) => vehicles.find((v) => v.id === id);

  const effectivePrices = selectedRoute?.prices?.length ? selectedRoute.prices : routePrices;

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">Private Transfers</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-4">
              Travel in <span className="italic">Style</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-2xl">
              Premium private transfers across Egypt with professional drivers and luxury vehicles
            </p>
            <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>
      </section>

      {/* Vehicles Showcase */}
      <section className="pb-16 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Our Fleet</h2>

          {loading ? (
            <div className="py-12"><Spinner size="lg" /></div>
          ) : vehicles.length === 0 ? (
            <EmptyState title="No Vehicles Available" description="Check back later." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-[var(--surface-card)] border border-[var(--line-soft)] overflow-hidden group">
                  <div className="relative h-48">
                    {vehicle.image_url ? (
                      <Image src={vehicle.image_url} alt={vehicle.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-bg-darker flex items-center justify-center">
                        <Car size={40} className="text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <Badge label={vehicle.type_label} color="blue" size="sm" />
                    <h3 className="text-lg font-serif text-[var(--text-primary)] mt-2 mb-2">{vehicle.name}</h3>
                    <p className="text-xs text-[var(--text-muted)] font-sans mb-3 line-clamp-2">{vehicle.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-sans">
                        <Users size={12} className="text-primary" /> {vehicle.max_passengers} pax
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-sans">
                        <Briefcase size={12} className="text-primary" /> {vehicle.max_luggage} bags
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Routes */}
      <section className="pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Available Routes</h2>
            <div className="flex gap-2">
              {transferTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setSelectedType(t.value)}
                  className={`px-4 py-2 text-xs font-sans font-bold uppercase tracking-wider border transition-all ${
                    selectedType === t.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-[var(--line-soft)] text-[var(--text-muted)] hover:border-primary/40'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12"><Spinner size="lg" /></div>
          ) : filteredRoutes.length === 0 ? (
            <EmptyState title="No Routes Found" description="Try a different transfer type." />
          ) : (
            <div className="space-y-4">
              {filteredRoutes.map((route) => {
                const isSelected = selectedRoute?.id === route.id;
                const Icon = typeIcons[route.transfer_type] || Car;

                return (
                  <div key={route.id}>
                    <button
                      onClick={() => handleSelectRoute(route)}
                      className={`w-full text-left bg-[var(--surface-card)] border p-6 transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-[var(--line-soft)] hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border border-primary/30 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-lg font-serif text-[var(--text-primary)]">
                              {route.pickup_name} <ArrowRight size={14} className="inline mx-2 text-primary" /> {route.dropoff_name}
                            </p>
                            <Badge label={route.transfer_type_label} color="blue" size="sm" />
                          </div>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-xs text-[var(--text-muted)] font-sans">{isSelected ? 'Tap to close' : 'View prices'}</p>
                        </div>
                      </div>
                    </button>

                    {/* Expanded price cards */}
                    {isSelected && (
                      <div className="border border-t-0 border-primary/30 bg-[var(--surface-card)] p-6">
                        {loadingPrices ? (
                          <Spinner size="sm" />
                        ) : effectivePrices.length === 0 ? (
                          <p className="text-sm text-[var(--text-muted)] font-sans">No prices available for this route.</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {effectivePrices.map((rp) => {
                              const vehicle = rp.vehicle || getVehicleById(rp.transfer_vehicle_id);
                              return (
                                <div key={rp.id} className="border border-[var(--line-soft)] p-4 hover:border-primary/40 transition-colors">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Car size={16} className="text-primary" />
                                    <p className="text-sm font-serif text-[var(--text-primary)]">{vehicle?.name || 'Vehicle'}</p>
                                  </div>
                                  {vehicle && (
                                    <div className="flex items-center gap-3 mb-3">
                                      <span className="text-[10px] text-[var(--text-muted)] font-sans">
                                        <Users size={10} className="inline mr-1" />{vehicle.max_passengers} pax
                                      </span>
                                      <span className="text-[10px] text-[var(--text-muted)] font-sans">
                                        <Briefcase size={10} className="inline mr-1" />{vehicle.max_luggage} bags
                                      </span>
                                    </div>
                                  )}
                                  <p className="text-xl font-serif text-primary mb-3">{formatPrice(rp.price, rp.currency)}</p>
                                  <Link
                                    href={`/transfers/book?routeId=${route.id}&vehicleId=${rp.transfer_vehicle_id}&price=${rp.price}&currency=${rp.currency}&pickup=${encodeURIComponent(route.pickup_name)}&dropoff=${encodeURIComponent(route.dropoff_name)}&type=${route.transfer_type}&vehicleName=${encodeURIComponent(vehicle?.name || '')}&maxPax=${vehicle?.max_passengers || 4}&maxLuggage=${vehicle?.max_luggage || 4}`}
                                  >
                                    <Button variant="primary" size="sm" className="w-full">
                                      Book Now
                                    </Button>
                                  </Link>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
