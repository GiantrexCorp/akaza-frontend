'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, X as XIcon, ShieldCheck, Info, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge, PageError } from '@/components/ui';
import { useHotelCheckRate, useHotelDetails } from '@/hooks/useHotels';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { ApiError } from '@/lib/api/client';
import type { HotelSearchResult, HotelRoom } from '@/types/hotel';
import { formatPrice } from '@/lib/utils/format';

function ImageGallery({ hotelCode }: { hotelCode: string }) {
  const { data: details, isLoading } = useHotelDetails(hotelCode);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = details?.images?.slice(0, 10).map((img) => ({
    ...img,
    originalPath: img.path.replace('/giata/bigger/', '/giata/original/'),
  })) ?? [];

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="h-80 md:h-[420px] bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />
      </div>
    );
  }

  if (images.length === 0) return null;

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="mb-8">
      <div className="relative h-80 md:h-[420px] overflow-hidden group">
        <Image
          src={images[currentIndex].originalPath}
          alt=""
          fill
          className="object-cover transition-opacity duration-300"
          sizes="100vw"
          quality={85}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 transition-all ${i === currentIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative w-20 h-14 shrink-0 overflow-hidden border-2 transition-all ${
                i === currentIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img.path} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function HotelInfo({ hotelCode, categoryName, destinationName }: { hotelCode: string; categoryName: string; destinationName: string }) {
  const { data: details } = useHotelDetails(hotelCode);

  const starMatch = categoryName.match(/(\d)/);
  const starCount = starMatch ? parseInt(starMatch[1], 10) : 0;

  const facilities = details?.facilities
    ?.filter((f, i, arr) => arr.findIndex((x) => x.description === f.description) === i)
    ?.filter((f) => f.description)
    ?.slice(0, 12) ?? [];

  return (
    <>
      {details?.description && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">About This Hotel</h2>
          <p className="text-sm text-[var(--text-secondary)] font-sans leading-relaxed">{details.description}</p>
        </div>
      )}

      {details?.address && (
        <div className="mb-6 flex items-start gap-2">
          <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-muted)] font-sans">
            {details.address}{details.city ? `, ${details.city}` : ''}
          </p>
        </div>
      )}

      {facilities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-3">Facilities</h2>
          <div className="flex flex-wrap gap-2">
            {facilities.map((f, i) => (
              <Badge key={i} label={f.description} color="gray" size="sm" />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function RoomSelectionContent() {
  const searchParams = useSearchParams();
  const rateKeys = searchParams.get('rateKeys')?.split(',') || [];
  const hotelCode = searchParams.get('hotelCode') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const destination = searchParams.get('destination') || '';
  const destinationName = searchParams.get('destinationName') || '';
  const adults = searchParams.get('adults') || '2';
  const childrenCount = searchParams.get('children') || '0';

  const backToSearchHref = `/hotels/search?${new URLSearchParams({ destination, destinationName, checkIn, checkOut, adults, children: childrenCount }).toString()}`;

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

  const starMatch = hotel.category_name.match(/(\d)/);
  const starCount = starMatch ? parseInt(starMatch[1], 10) : 0;

  return (
    <div className="pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back */}
        <Link href={backToSearchHref} className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-6 transition-colors">
          <ArrowLeft size={14} />
          Back to Results
        </Link>

        {/* Image gallery */}
        <ImageGallery hotelCode={hotelCode} />

        {/* Hotel header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {starCount > 0 && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: starCount }, (_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">{hotel.hotel_name}</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans">{hotel.destination_name} &middot; {checkIn} to {checkOut}</p>
          <div className="mt-4 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Hotel info (description, address, facilities) */}
        <HotelInfo hotelCode={hotelCode} categoryName={hotel.category_name} destinationName={hotel.destination_name} />

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

                        {room.rate_comments && (
                          <div className="mt-2 flex items-start gap-2">
                            <Info size={14} className="text-[var(--text-muted)] shrink-0 mt-0.5" />
                            <p className="text-xs text-[var(--text-muted)] font-sans">{room.rate_comments}</p>
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
