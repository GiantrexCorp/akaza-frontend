'use client';

import { useState, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Car, Plane, Calendar, Clock, Users, Briefcase } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input, Button, Spinner, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { transfersApi } from '@/lib/api/transfers';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { ProtectedRoute } from '@/lib/auth';

function TransferBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const routeId = searchParams.get('routeId') || '';
  const vehicleId = searchParams.get('vehicleId') || '';
  const price = parseFloat(searchParams.get('price') || '0');
  const currency = searchParams.get('currency') || 'EUR';
  const pickup = searchParams.get('pickup') || '';
  const dropoff = searchParams.get('dropoff') || '';
  const transferType = searchParams.get('type') || '';
  const vehicleName = searchParams.get('vehicleName') || '';
  const maxPax = parseInt(searchParams.get('maxPax') || '4');
  const maxLuggage = parseInt(searchParams.get('maxLuggage') || '4');

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState<E164Number | undefined>(undefined);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [luggageCount, setLuggageCount] = useState(1);
  const [flightNumber, setFlightNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(p);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactPhone) {
      toast('error', 'Please fill in contact information');
      return;
    }
    const phoneErr = validatePhone(contactPhone);
    if (phoneErr) {
      toast('error', phoneErr);
      return;
    }
    if (!pickupDate || !pickupTime) {
      toast('error', 'Please select pickup date and time');
      return;
    }
    if (!agreed) {
      toast('error', 'Please accept the terms');
      return;
    }

    setLoading(true);
    try {
      const booking = await transfersApi.createBooking({
        transfer_route_id: routeId,
        transfer_vehicle_id: vehicleId,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        passengers,
        luggage_count: luggageCount,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        flight_number: flightNumber || undefined,
        special_requests: specialRequests || undefined,
      });
      toast('success', 'Transfer booked successfully!');
      router.push(`/transfers/bookings/${booking.id}/confirmation`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Booking failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <Link href="/transfers" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Transfers
        </Link>

        <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">Book Your Transfer</h1>
        <p className="text-sm text-[var(--text-muted)] font-sans mb-10">{pickup} &rarr; {dropoff}</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Contact info */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="John Doe" value={contactName} onChange={(e) => setContactName(e.target.value)} icon={<User size={18} />} />
                  <Input label="Email" type="email" placeholder="your@email.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} icon={<Mail size={18} />} />
                  <PhoneInput label="Phone" value={contactPhone} onChange={setContactPhone} required />
                </div>
              </div>

              {/* Trip details */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Trip Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Pickup Date" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} icon={<Calendar size={18} />} />
                  <Input label="Pickup Time" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} icon={<Clock size={18} />} />
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">Passengers</p>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setPassengers((p) => Math.max(1, p - 1))} className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors text-lg">-</button>
                      <span className="text-xl font-serif text-[var(--text-primary)] w-8 text-center">{passengers}</span>
                      <button type="button" onClick={() => setPassengers((p) => Math.min(maxPax, p + 1))} className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors text-lg">+</button>
                      <span className="text-[10px] text-[var(--text-muted)] font-sans">Max {maxPax}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">Luggage</p>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setLuggageCount((l) => Math.max(0, l - 1))} className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors text-lg">-</button>
                      <span className="text-xl font-serif text-[var(--text-primary)] w-8 text-center">{luggageCount}</span>
                      <button type="button" onClick={() => setLuggageCount((l) => Math.min(maxLuggage, l + 1))} className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors text-lg">+</button>
                      <span className="text-[10px] text-[var(--text-muted)] font-sans">Max {maxLuggage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flight & special requests */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Additional Information</h2>
                {transferType === 'airport' && (
                  <div className="mb-6">
                    <Input label="Flight Number (optional)" placeholder="MS 123" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} icon={<Plane size={18} />} />
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">Special Requests (optional)</p>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Child seat, wheelchair access, or any special requirements..."
                    rows={3}
                    className="w-full bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] font-serif text-lg outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-primary mt-0.5" />
                <span className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                  I accept the booking terms and confirm all details are correct.
                </span>
              </label>
            </div>

            {/* Price sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Booking Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Route</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans text-right">{pickup} &rarr; {dropoff}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Vehicle</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{vehicleName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Passengers</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{passengers}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-[var(--text-secondary)] font-sans">Luggage</p>
                    <p className="text-sm text-[var(--text-primary)] font-sans">{luggageCount}</p>
                  </div>
                  {pickupDate && (
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--text-secondary)] font-sans">Date</p>
                      <p className="text-sm text-[var(--text-primary)] font-sans">{pickupDate}</p>
                    </div>
                  )}
                  {pickupTime && (
                    <div className="flex justify-between">
                      <p className="text-sm text-[var(--text-secondary)] font-sans">Time</p>
                      <p className="text-sm text-[var(--text-primary)] font-sans">{pickupTime}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--line-soft)] pt-4 mb-6">
                  <div className="flex items-end justify-between">
                    <p className="text-xs text-[var(--text-muted)] font-sans uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(price)}</p>
                  </div>
                </div>

                <Button type="submit" variant="gradient" loading={loading} className="w-full">
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

export default function TransferBookPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <Suspense fallback={<div className="pt-36 pb-32"><Spinner size="lg" /></div>}>
        <TransferBookingForm />
      </Suspense>
      <Footer />
    </ProtectedRoute>
  );
}
