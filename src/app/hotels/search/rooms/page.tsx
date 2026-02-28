'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, X as XIcon, ShieldCheck, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge, PageError } from '@/components/ui';
import { useHotelCheckRate } from '@/hooks/useHotels';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import type { HotelSearchResult, HotelRoom } from '@/types/hotel';

function RoomSelectionContent() {
  const searchParams = useSearchParams();
  const rateKeys = searchParams.get('rateKeys')?.split(',') || [];
  const hotelCode = searchParams.get('hotelCode') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const [hotel, setHotel] = useState<HotelSearchResult | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<HotelRoom[]>([]);

  const checkRateMutation = useHotelCheckRate();
  useQueryErrorToast(checkRateMutation.isError, checkRateMutation.error, 'Rate check failed');

  const loading = checkRateMutation.isPending;
  const error = checkRateMutation.error instanceof ApiError ? checkRateMutation.error : null;

  useEffect(() => {
    if (rateKeys.length === 0) return;
    checkRateMutation.mutate(
      { rate_keys: rateKeys },
      {
        onSuccess: (results) => {
          const match = results.find((h) => h.hotel_code === hotelCode) || results[0];
          setHotel(match || null);
        },
      },
    );
  }, []);

  const toggleRoom = (room: HotelRoom) => {
    setSelectedRooms((prev) => {
      const exists = prev.find((r) => r.rate_key === room.rate_key);
      if (exists) return prev.filter((r) => r.rate_key !== room.rate_key);
      return [...prev, room];
    });
  };

  const totalPrice = selectedRooms.reduce((sum, r) => sum + r.selling_price, 0);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-36 pb-32">
        <Spinner size="lg" />
        <p className="text-center text-sm text-[var(--text-muted)] font-sans mt-4">Verifying rates...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="pt-36 pb-32 max-w-7xl mx-auto px-6">
        <PageError
          status={error?.status ?? 404}
          title={error?.status === 404 ? 'Rates Unavailable' : undefined}
          description={error?.status === 404 ? 'The selected hotel rates are no longer available. Please search again.' : undefined}
          onRetry={() => checkRateMutation.mutate(
            { rate_keys: rateKeys },
            {
              onSuccess: (results) => {
                const match = results.find((h) => h.hotel_code === hotelCode) || results[0];
                setHotel(match || null);
              },
            },
          )}
          backHref="/hotels/search"
          backLabel="Back to Search"
        />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back + Hotel Info */}
        <Link href="/hotels/search" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Results
        </Link>

        <div className="mb-10">
          <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">{hotel.category_name}</p>
          <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">{hotel.hotel_name}</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans">{hotel.destination_name} &middot; {checkIn} to {checkOut}</p>
          <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rooms list */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Available Rooms</h2>

            {hotel.rooms.map((room) => {
              const isSelected = selectedRooms.some((r) => r.rate_key === room.rate_key);
              return (
                <div
                  key={room.rate_key}
                  className={`bg-[var(--surface-card)] border transition-all duration-300 ${isSelected ? 'border-primary shadow-lg shadow-primary/10' : 'border-[var(--line-soft)]'}`}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-serif text-[var(--text-primary)]">{room.room_name}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Badge label={room.board_name} color="blue" size="sm" />
                          <Badge label={`${room.adults} Adults${room.children > 0 ? `, ${room.children} Children` : ''}`} color="gray" size="sm" />
                          {room.packaging && <Badge label="Package" color="purple" size="sm" />}
                        </div>

                        {room.cancellation_policies.length > 0 && (
                          <div className="mt-3 flex items-start gap-2">
                            <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-[var(--text-muted)] font-sans">
                              Free cancellation before {new Date(room.cancellation_policies[0].from).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {room.promotions.length > 0 && (
                          <div className="mt-2 flex items-start gap-2">
                            <Info size={14} className="text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-primary font-sans">{room.promotions[0]}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(room.selling_price, room.currency)}</p>
                        <p className="text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-wider">total stay</p>
                        <button
                          onClick={() => toggleRoom(room)}
                          className={`mt-3 inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold uppercase tracking-widest font-sans transition-all duration-300 ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'border border-primary text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {isSelected ? <><Check size={12} /> Selected</> : 'Select Room'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Booking Summary</h3>

              {selectedRooms.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] font-sans py-8 text-center">Select a room to continue</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {selectedRooms.map((room) => (
                      <div key={room.rate_key} className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-sans text-[var(--text-secondary)] truncate">{room.room_name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] font-sans">{room.board_name}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-sm font-serif text-[var(--text-primary)]">{formatPrice(room.selling_price, room.currency)}</p>
                          <button onClick={() => toggleRoom(room)} className="text-[var(--text-muted)] hover:text-red-400 transition-colors">
                            <XIcon size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[var(--line-soft)] pt-4 mb-6">
                    <div className="flex items-end justify-between">
                      <p className="text-xs text-[var(--text-muted)] font-sans uppercase tracking-wider">Total</p>
                      <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(totalPrice, hotel.currency)}</p>
                    </div>
                  </div>

                  <Link href={`/hotels/book?hotel=${encodeURIComponent(JSON.stringify({
                    hotelCode: hotel.hotel_code,
                    hotelName: hotel.hotel_name,
                    destinationCode: hotel.destination_code,
                    destinationName: hotel.destination_name,
                    checkIn: hotel.check_in,
                    checkOut: hotel.check_out,
                    currency: hotel.currency,
                    rooms: selectedRooms,
                  }))}`}>
                    <Button variant="gradient" className="w-full">
                      Proceed to Booking
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-36 pb-32"><Spinner size="lg" /></div>}>
        <RoomSelectionContent />
      </Suspense>
      <Footer />
    </>
  );
}
