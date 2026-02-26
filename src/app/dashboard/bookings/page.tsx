'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hotel, Ship, Car, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardLayout from '@/components/DashboardLayout';
import { Spinner, Badge, EmptyState, Pagination } from '@/components/ui';
import { hotelsApi } from '@/lib/api/hotels';
import { toursApi } from '@/lib/api/tours';
import { transfersApi } from '@/lib/api/transfers';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import type { HotelBooking } from '@/types/hotel';
import type { TourBooking } from '@/types/tour';
import type { TransferBooking } from '@/types/transfer';

type Tab = 'hotels' | 'tours' | 'transfers';

const statusColors: Record<string, 'yellow' | 'green' | 'red' | 'gray' | 'orange' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  failed: 'red',
  cancelled: 'gray',
  completed: 'purple',
  no_show: 'red',
  pending_cancellation: 'orange',
  cancellation_failed: 'red',
  pending_reconciliation: 'purple',
};

export default function BookingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('hotels');

  const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [transferBookings, setTransferBookings] = useState<TransferBooking[]>([]);

  const [hotelPage, setHotelPage] = useState(1);
  const [tourPage, setTourPage] = useState(1);
  const [transferPage, setTransferPage] = useState(1);

  const [hotelLastPage, setHotelLastPage] = useState(1);
  const [tourLastPage, setTourLastPage] = useState(1);
  const [transferLastPage, setTransferLastPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const fetchBookings = async (tab: Tab, page: number) => {
    setLoading(true);
    try {
      const params = `page=${page}`;
      if (tab === 'hotels') {
        const data = await hotelsApi.listBookings(params);
        setHotelBookings(data.data);
        setHotelPage(data.meta.current_page);
        setHotelLastPage(data.meta.last_page);
      } else if (tab === 'tours') {
        const data = await toursApi.listBookings(params);
        setTourBookings(data.data);
        setTourPage(data.meta.current_page);
        setTourLastPage(data.meta.last_page);
      } else {
        const data = await transfersApi.listBookings(params);
        setTransferBookings(data.data);
        setTransferPage(data.meta.current_page);
        setTransferLastPage(data.meta.last_page);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab, 1);
  }, [activeTab]);

  const tabs: { key: Tab; label: string; icon: typeof Hotel }[] = [
    { key: 'hotels', label: 'Hotels', icon: Hotel },
    { key: 'tours', label: 'Tours', icon: Ship },
    { key: 'transfers', label: 'Transfers', icon: Car },
  ];

  return (
    <ProtectedRoute>
      <Navbar />
      <DashboardLayout>
        <div>
          <h1 className="text-2xl font-serif text-[var(--text-primary)] mb-6">My Bookings</h1>

          {/* Tabs */}
          <div className="flex border-b border-[var(--line-soft)] mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-sans font-bold transition-all border-b-2 -mb-[1px] ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-[var(--text-muted)] hover:text-primary'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="py-16"><Spinner size="lg" /></div>
          ) : (
            <>
              {/* Hotel bookings */}
              {activeTab === 'hotels' && (
                hotelBookings.length === 0 ? (
                  <EmptyState title="No Hotel Bookings" description="Book a hotel to see your reservations here." />
                ) : (
                  <>
                    <div className="space-y-4">
                      {hotelBookings.map((booking) => (
                        <Link key={booking.id} href={`/dashboard/bookings/hotels/${booking.id}`} className="block bg-[var(--surface-card)] border border-[var(--line-soft)] p-5 hover:border-primary/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Hotel size={16} className="text-primary shrink-0" />
                                <p className="text-lg font-serif text-[var(--text-primary)] truncate">{booking.hotel_name}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Calendar size={12} /> {booking.check_in} — {booking.check_out}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Users size={12} /> {booking.total_rooms} room{booking.total_rooms > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} size="sm" />
                              <p className="text-lg font-serif text-[var(--text-primary)]">{booking.formatted_selling_price}</p>
                              <ArrowRight size={16} className="text-[var(--text-muted)]" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Pagination currentPage={hotelPage} lastPage={hotelLastPage} onPageChange={(p) => fetchBookings('hotels', p)} />
                    </div>
                  </>
                )
              )}

              {/* Tour bookings */}
              {activeTab === 'tours' && (
                tourBookings.length === 0 ? (
                  <EmptyState title="No Tour Bookings" description="Book a tour to see your reservations here." />
                ) : (
                  <>
                    <div className="space-y-4">
                      {tourBookings.map((booking) => (
                        <Link key={booking.id} href={`/dashboard/bookings/tours/${booking.id}`} className="block bg-[var(--surface-card)] border border-[var(--line-soft)] p-5 hover:border-primary/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Ship size={16} className="text-primary shrink-0" />
                                <p className="text-lg font-serif text-[var(--text-primary)] truncate">{booking.tour.translated_title}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Calendar size={12} /> {booking.tour_date}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Users size={12} /> {booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <MapPin size={12} /> {booking.tour.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} size="sm" />
                              <p className="text-lg font-serif text-[var(--text-primary)]">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: booking.currency }).format(booking.total_price)}
                              </p>
                              <ArrowRight size={16} className="text-[var(--text-muted)]" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Pagination currentPage={tourPage} lastPage={tourLastPage} onPageChange={(p) => fetchBookings('tours', p)} />
                    </div>
                  </>
                )
              )}

              {/* Transfer bookings */}
              {activeTab === 'transfers' && (
                transferBookings.length === 0 ? (
                  <EmptyState title="No Transfer Bookings" description="Book a transfer to see your reservations here." />
                ) : (
                  <>
                    <div className="space-y-4">
                      {transferBookings.map((booking) => (
                        <Link key={booking.id} href={`/dashboard/bookings/transfers/${booking.id}`} className="block bg-[var(--surface-card)] border border-[var(--line-soft)] p-5 hover:border-primary/40 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-2">
                                <Car size={16} className="text-primary shrink-0" />
                                <p className="text-lg font-serif text-[var(--text-primary)] truncate">{booking.pickup_location} &rarr; {booking.dropoff_location}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Calendar size={12} /> {booking.pickup_date} at {booking.pickup_time}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-sans">
                                  <Users size={12} /> {booking.passengers} pax
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} size="sm" />
                              <p className="text-lg font-serif text-[var(--text-primary)]">{booking.formatted_price}</p>
                              <ArrowRight size={16} className="text-[var(--text-muted)]" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-8">
                      <Pagination currentPage={transferPage} lastPage={transferLastPage} onPageChange={(p) => fetchBookings('transfers', p)} />
                    </div>
                  </>
                )
              )}
            </>
          )}
        </div>
      </DashboardLayout>
      <Footer />
    </ProtectedRoute>
  );
}
