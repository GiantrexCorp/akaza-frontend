'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { Input, Button, Select, Badge, PhoneInput } from '@/components/ui';
import type { E164Number } from '@/components/ui';
import { validatePhone } from '@/lib/validation/phone';
import { useFormValidation } from '@/hooks/useFormValidation';
import { hotelBookingSchema } from '@/lib/validation/schemas/booking';
import { useCreateHotelBooking } from '@/hooks/useHotels';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import type { HotelRoom, HotelBookingGuest } from '@/types/hotel';
import { formatPrice } from '@/lib/utils/format';

interface BookingData {
  hotelCode: string;
  hotelName: string;
  destinationCode: string;
  destinationName: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  rooms: HotelRoom[];
}

interface RoomGuests {
  guests: HotelBookingGuest[];
}

export default function HotelBookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  let bookingData: BookingData | null = null;
  try {
    bookingData = JSON.parse(searchParams.get('hotel') || '');
  } catch {
    bookingData = null;
  }

  const [holderName, setHolderName] = useState('');
  const [holderSurname, setHolderSurname] = useState('');
  const [holderEmail, setHolderEmail] = useState('');
  const [holderPhone, setHolderPhone] = useState<E164Number | undefined>(undefined);
  const [roomGuests, setRoomGuests] = useState<RoomGuests[]>(() =>
    (bookingData?.rooms || []).map((room) => ({
      guests: Array.from({ length: room.adults + room.children }, (_, i) => ({
        type: (i < room.adults ? 'AD' : 'CH') as 'AD' | 'CH',
        name: '',
        surname: '',
        age: i < room.adults ? null : 10,
      })),
    }))
  );
  const createBookingMutation = useCreateHotelBooking();
  const { errors, validate, clearError } = useFormValidation(hotelBookingSchema);
  const [agreed, setAgreed] = useState(false);

  if (!bookingData || !bookingData.rooms?.length) {
    return (
      <div className="pt-36 pb-32 max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">No Room Selected</h2>
        <p className="text-sm text-[var(--text-muted)] font-sans mb-8">Please select a room before booking.</p>
        <Link href="/hotels/search"><Button variant="outline">Search Hotels</Button></Link>
      </div>
    );
  }

  const totalPrice = bookingData.rooms.reduce((sum, r) => sum + r.selling_price, 0);

  const updateGuest = (roomIdx: number, guestIdx: number, field: keyof HotelBookingGuest, value: string | number | null) => {
    setRoomGuests((prev) => {
      const updated = [...prev];
      updated[roomIdx] = {
        ...updated[roomIdx],
        guests: updated[roomIdx].guests.map((g, i) => i === guestIdx ? { ...g, [field]: value } : g),
      };
      return updated;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate({ holderName, holderSurname, holderEmail })) return;
    const phoneErr = validatePhone(holderPhone);
    if (phoneErr) {
      toast('error', phoneErr);
      return;
    }
    if (!agreed) {
      toast('error', 'Please accept the terms');
      return;
    }

    const firstRoom = bookingData!.rooms[0];
    createBookingMutation.mutate(
      {
        rate_key: firstRoom.rate_key,
        rate_type: firstRoom.rate_type,
        holder_name: holderName,
        holder_surname: holderSurname,
        holder_email: holderEmail,
        holder_phone: holderPhone || '',
        rooms: bookingData!.rooms.map((room, i) => ({
          room_code: room.room_code,
          room_name: room.room_name,
          board_code: room.board_code,
          board_name: room.board_name,
          rate_key: room.rate_key,
          net_price: room.net_price,
          currency: room.currency,
          guests: roomGuests[i]?.guests || [],
        })),
        hotel_code: bookingData!.hotelCode,
        hotel_name: bookingData!.hotelName,
        destination_code: bookingData!.destinationCode,
        destination_name: bookingData!.destinationName,
        check_in: bookingData!.checkIn,
        check_out: bookingData!.checkOut,
        cancellation_policies: firstRoom.cancellation_policies,
      },
      {
        onSuccess: (booking) => {
          toast('success', 'Booking created successfully!');
          router.push(`/hotels/bookings/${booking.id}/confirmation`);
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
        <Link href="/hotels/search" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>

        <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">Complete Your Booking</h1>
        <p className="text-sm text-[var(--text-muted)] font-sans mb-10">{bookingData.hotelName} &middot; {bookingData.checkIn} to {bookingData.checkOut}</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" placeholder="John" value={holderName} onChange={(e) => { setHolderName(e.target.value); clearError('holderName'); }} error={errors.holderName} icon={<User size={18} />} />
                  <Input label="Last Name" placeholder="Doe" value={holderSurname} onChange={(e) => { setHolderSurname(e.target.value); clearError('holderSurname'); }} error={errors.holderSurname} icon={<User size={18} />} />
                  <Input label="Email" type="email" placeholder="your@email.com" value={holderEmail} onChange={(e) => { setHolderEmail(e.target.value); clearError('holderEmail'); }} error={errors.holderEmail} icon={<Mail size={18} />} />
                  <PhoneInput label="Phone" value={holderPhone} onChange={setHolderPhone} />
                </div>
              </div>

              {bookingData.rooms.map((room, roomIdx) => (
                <div key={room.rate_key} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans">Room {roomIdx + 1}: {room.room_name}</h2>
                    <Badge label={room.board_name} color="blue" size="sm" />
                  </div>
                  <div className="space-y-4">
                    {roomGuests[roomIdx]?.guests.map((guest, guestIdx) => (
                      <div key={`${roomIdx}-${guestIdx}-${guest.type}`} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <Input label={`Guest ${guestIdx + 1} First Name`} placeholder="First name" value={guest.name} onChange={(e) => updateGuest(roomIdx, guestIdx, 'name', e.target.value)} size="sm" />
                        <Input label="Last Name" placeholder="Last name" value={guest.surname} onChange={(e) => updateGuest(roomIdx, guestIdx, 'surname', e.target.value)} size="sm" />
                        <Select
                          label="Type"
                          options={[{ value: 'AD', label: 'Adult' }, { value: 'CH', label: 'Child' }]}
                          value={guest.type}
                          onChange={(e) => updateGuest(roomIdx, guestIdx, 'type', e.target.value)}
                          size="sm"
                        />
                        {guest.type === 'CH' && (
                          <Input label="Age" type="number" min="0" max="17" placeholder="Age" value={guest.age?.toString() || ''} onChange={(e) => updateGuest(roomIdx, guestIdx, 'age', parseInt(e.target.value) || null)} size="sm" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-primary mt-0.5" />
                <span className="text-xs text-[var(--text-muted)] font-sans leading-relaxed">
                  I accept the booking terms, cancellation policy, and confirm all guest details are correct.
                </span>
              </label>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Price Summary</h3>
                <div className="space-y-3 mb-6">
                  {bookingData.rooms.map((room) => (
                    <div key={room.rate_key} className="flex justify-between">
                      <p className="text-sm text-[var(--text-secondary)] font-sans truncate mr-2">{room.room_name}</p>
                      <p className="text-sm font-serif text-[var(--text-primary)] shrink-0">{formatPrice(room.selling_price, bookingData!.currency)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--line-soft)] pt-4 mb-6">
                  <div className="flex items-end justify-between">
                    <p className="text-xs text-[var(--text-muted)] font-sans uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(totalPrice, bookingData!.currency)}</p>
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
