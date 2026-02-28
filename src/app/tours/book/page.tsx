'use client';

import { useState, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input, Button, Spinner, Select, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useFormValidation } from '@/hooks/useFormValidation';
import { tourBookingSchema } from '@/lib/validation/schemas/booking';
import { useCreateTourBooking } from '@/hooks/useTours';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';
import type { TourBookingGuest } from '@/types/tour';

function TourBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const tourId = searchParams.get('tourId') || '';
  const availabilityId = searchParams.get('availabilityId') || '';
  const guestsCount = parseInt(searchParams.get('guests') || '1');
  const price = parseFloat(searchParams.get('price') || '0');
  const tourName = searchParams.get('tourName') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const currency = searchParams.get('currency') || 'EUR';

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState<E164Number | undefined>(undefined);
  const [specialRequests, setSpecialRequests] = useState('');
  const [guests, setGuests] = useState<(TourBookingGuest & { _key: string })[]>(() =>
    Array.from({ length: guestsCount }, () => ({ name: '', surname: '', type: 'AD' as const, age: null, _key: crypto.randomUUID() }))
  );
  const createBookingMutation = useCreateTourBooking();
  const { errors, validate, clearError } = useFormValidation(tourBookingSchema);
  const [agreed, setAgreed] = useState(false);

  const totalPrice = price * guests.length;

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(p);
  };

  const updateGuest = (idx: number, field: keyof TourBookingGuest, value: string | number | null) => {
    setGuests((prev) => prev.map((g, i) => i === idx ? { ...g, [field]: value } : g));
  };

  const addGuest = () => {
    setGuests((prev) => [...prev, { name: '', surname: '', type: 'AD', age: null, _key: crypto.randomUUID() }]);
  };

  const removeGuest = (idx: number) => {
    if (guests.length <= 1) return;
    setGuests((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate({ contactName, contactEmail })) return;
    const phoneErr = validatePhone(contactPhone);
    if (phoneErr) {
      toast('error', phoneErr);
      return;
    }
    if (!agreed) {
      toast('error', 'Please accept the terms');
      return;
    }

    createBookingMutation.mutate(
      {
        tour_id: tourId,
        availability_id: availabilityId,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || '',
        special_requests: specialRequests || undefined,
        guests,
      },
      {
        onSuccess: (booking) => {
          toast('success', 'Tour booked successfully!');
          router.push(`/tours/bookings/${booking.id}/confirmation`);
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            toast('error', err.errors[0] || 'Booking failed');
          }
        },
      },
    );
  };

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/tours" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Tours
        </Link>

        <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">Book Your Tour</h1>
        <p className="text-sm text-[var(--text-muted)] font-sans mb-10">{tourName} &middot; {date} at {time}</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Contact info */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="John Doe" value={contactName} onChange={(e) => { setContactName(e.target.value); clearError('contactName'); }} error={errors.contactName} icon={<User size={18} />} />
                  <Input label="Email" type="email" placeholder="your@email.com" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); clearError('contactEmail'); }} error={errors.contactEmail} icon={<Mail size={18} />} />
                  <PhoneInput label="Phone" value={contactPhone} onChange={setContactPhone} />
                </div>
              </div>

              {/* Guests */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Guest Details</h2>
                  <button type="button" onClick={addGuest} className="flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-sans font-bold uppercase tracking-wider transition-colors">
                    <Plus size={14} /> Add Guest
                  </button>
                </div>
                <div className="space-y-4">
                  {guests.map((guest, idx) => (
                    <div key={guest._key} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <Input label={`Guest ${idx + 1} First Name`} placeholder="First name" value={guest.name} onChange={(e) => updateGuest(idx, 'name', e.target.value)} size="sm" />
                      <Input label="Last Name" placeholder="Last name" value={guest.surname} onChange={(e) => updateGuest(idx, 'surname', e.target.value)} size="sm" />
                      <Select
                        label="Type"
                        options={[{ value: 'AD', label: 'Adult' }, { value: 'CH', label: 'Child' }]}
                        value={guest.type}
                        onChange={(e) => updateGuest(idx, 'type', e.target.value)}
                        size="sm"
                      />
                      {guest.type === 'CH' && (
                        <Input label="Age" type="number" min="0" max="17" value={guest.age?.toString() || ''} onChange={(e) => updateGuest(idx, 'age', parseInt(e.target.value) || null)} size="sm" />
                      )}
                      {guests.length > 1 && (
                        <button type="button" onClick={() => removeGuest(idx)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors pb-2">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special requests */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Special Requests (optional)</h2>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any dietary requirements, accessibility needs, or special requests..."
                  rows={3}
                  className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-lg outline-none transition-colors resize-none"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-primary mt-0.5" />
                <span className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                  I accept the booking terms and confirm all guest details are correct.
                </span>
              </label>
            </div>

            {/* Price sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Booking Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Tour</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{tourName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Date</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{date}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Guests</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{guests.length}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Price/person</p>
                    <p className="text-sm font-serif text-[var(--text-primary)]">{formatPrice(price)}</p>
                  </div>
                </div>

                <div className="border-t border-[var(--line-soft)] pt-4 mb-6">
                  <div className="flex items-end justify-between">
                    <p className="text-xs text-[var(--text-muted)] font-sans uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(totalPrice)}</p>
                  </div>
                </div>

                <Button type="submit" variant="gradient" loading={createBookingMutation.isPending} className="w-full">
                  Confirm Booking
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TourBookPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Suspense fallback={<div className="pt-36 pb-32"><Spinner size="lg" /></div>}>
        <TourBookingForm />
      </Suspense>
      <Footer />
    </ProtectedRoute>
  );
}
