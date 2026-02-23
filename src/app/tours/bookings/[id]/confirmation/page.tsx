'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { CheckCircle, Download, Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge } from '@/components/ui';
import { toursApi } from '@/lib/api/tours';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import type { TourBooking } from '@/types/tour';

const statusColors: Record<string, 'yellow' | 'green' | 'red' | 'gray' | 'purple'> = {
  pending: 'yellow',
  confirmed: 'green',
  cancelled: 'gray',
  completed: 'purple',
  no_show: 'red',
};

function ConfirmationContent({ id }: { id: string }) {
  const { toast } = useToast();
  const [booking, setBooking] = useState<TourBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await toursApi.getBooking(id);
        setBooking(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load booking');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleDownloadVoucher = async () => {
    try {
      const blob = await toursApi.downloadVoucher(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voucher-${booking?.booking_reference || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast('error', 'Failed to download voucher');
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="pt-36 pb-32 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Booking Not Found</h2>
        <Link href="/dashboard/bookings"><Button variant="outline">My Bookings</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Success header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <CheckCircle size={56} strokeWidth={1} className="text-emerald-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--text-primary)] mb-3">Booking Submitted</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans">Your booking reference is</p>
          <p className="text-2xl font-serif text-primary mt-2">{booking.booking_reference}</p>
        </div>

        {/* Booking details card */}
        <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {/* Status */}
          <div className="p-6 flex items-center justify-between">
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Status</p>
            <Badge label={booking.status_label} color={statusColors[booking.status] || 'gray'} />
          </div>

          {/* Tour info */}
          <div className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-lg font-serif text-[var(--text-primary)]">{booking.tour.translated_title}</p>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{booking.tour.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.tour_date}</p>
            </div>
            {(booking.tour.duration_days > 0 || booking.tour.duration_hours > 0) && (
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--text-secondary)] font-sans">
                  {booking.tour.duration_days > 0 ? `${booking.tour.duration_days}d ${booking.tour.duration_hours}h` : `${booking.tour.duration_hours}h`}
                </p>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Users size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)] font-sans">
                {booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Guests */}
          {booking.guests.length > 0 && (
            <div className="p-6">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">Guests</p>
              <div className="space-y-1">
                {booking.guests.map((guest, i) => (
                  <p key={i} className="text-xs text-[var(--text-muted)] font-sans">
                    {guest.name} {guest.surname} ({guest.type === 'AD' ? 'Adult' : `Child, ${guest.age}y`})
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Special requests */}
          {booking.special_requests && (
            <div className="p-6">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-2">Special Requests</p>
              <p className="text-sm text-[var(--text-secondary)] font-sans">{booking.special_requests}</p>
            </div>
          )}

          {/* Price */}
          <div className="p-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-[var(--text-secondary)] font-sans">Price per person</p>
              <p className="text-sm font-serif text-[var(--text-primary)]">{formatPrice(booking.price_per_person, booking.currency)}</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Total</p>
              <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(booking.total_price, booking.currency)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          {booking.voucher_path && (
            <Button variant="outline" icon={<Download size={14} />} onClick={handleDownloadVoucher} className="flex-1">
              Download Voucher
            </Button>
          )}
          <Link href="/dashboard/bookings" className="flex-1">
            <Button variant="ghost" icon={<ArrowRight size={14} />} className="w-full">
              My Bookings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TourBookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <Navbar />
      <ConfirmationContent id={id} />
      <Footer />
    </ProtectedRoute>
  );
}
