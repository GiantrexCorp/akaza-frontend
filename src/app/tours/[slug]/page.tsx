'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users, Check, X, Calendar, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button, Spinner, Badge } from '@/components/ui';
import { toursApi } from '@/lib/api/tours';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import type { Tour, TourAvailability } from '@/types/tour';

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { toast } = useToast();
  const [tour, setTour] = useState<Tour | null>(null);
  const [availabilities, setAvailabilities] = useState<TourAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAvailability, setSelectedAvailability] = useState<TourAvailability | null>(null);
  const [guests, setGuests] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await toursApi.get(slug);
        setTour(data);
        if (data.availabilities?.length) {
          setAvailabilities(data.availabilities);
        } else {
          const avail = await toursApi.getAvailabilities(data.id);
          setAvailabilities(avail);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          toast('error', err.errors[0] || 'Failed to load tour');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-36 pb-32"><Spinner size="lg" /></div>
        <Footer />
      </>
    );
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <div className="pt-36 pb-32 max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-serif text-[var(--text-primary)] mb-4">Tour Not Found</h2>
          <Link href="/tours"><Button variant="outline">Browse Tours</Button></Link>
        </div>
        <Footer />
      </>
    );
  }

  const selectedPrice = selectedAvailability?.effective_price || tour.price_per_person;
  const totalPrice = selectedPrice * guests;

  return (
    <>
      <Navbar />

      {/* Hero Gallery */}
      <section className="pt-24 relative">
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          {tour.images.length > 0 ? (
            <>
              <Image
                src={tour.images[currentImageIndex].url}
                alt={tour.translated_title}
                fill
                className="object-cover"
                priority
              />
              {tour.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((p) => (p === 0 ? tour.images.length - 1 : p - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((p) => (p === tour.images.length - 1 ? 0 : p + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {tour.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentImageIndex ? 'bg-primary w-6' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-bg-darker" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-page)] via-transparent to-transparent" />
        </div>
      </section>

      {/* Content */}
      <section className="pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Title */}
              <div>
                <Link href="/tours" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary text-xs uppercase tracking-widest font-sans mb-4 transition-colors">
                  <ChevronLeft size={14} />
                  All Tours
                </Link>
                <h1 className="text-3xl md:text-5xl font-serif text-[var(--text-primary)] mb-4">{tour.translated_title}</h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] font-sans">
                    <MapPin size={14} className="text-primary" /> {tour.location}
                  </span>
                  {(tour.duration_days > 0 || tour.duration_hours > 0) && (
                    <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] font-sans">
                      <Clock size={14} className="text-primary" />
                      {tour.duration_days > 0 ? `${tour.duration_days}d ${tour.duration_hours}h` : `${tour.duration_hours}h`}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] font-sans">
                    <Users size={14} className="text-primary" /> Max {tour.max_capacity} guests
                  </span>
                </div>
                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">About This Tour</h2>
                <p className="text-[var(--text-secondary)] font-sans leading-relaxed whitespace-pre-line">{tour.description}</p>
              </div>

              {/* Highlights */}
              {tour.highlights.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Highlights</h2>
                  <ul className="space-y-2">
                    {tour.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check size={14} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-[var(--text-secondary)] font-sans">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes / Excludes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tour.includes.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">What&apos;s Included</h2>
                    <ul className="space-y-2">
                      {tour.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-[var(--text-secondary)] font-sans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Not Included</h2>
                    <ul className="space-y-2">
                      {tour.excludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <X size={14} className="text-red-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-[var(--text-secondary)] font-sans">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Availability Calendar */}
              {availabilities.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-4">Available Dates</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availabilities.map((avail) => {
                      const isSelected = selectedAvailability?.id === avail.id;
                      const isSoldOut = avail.status === 'sold_out';
                      const fewSpots = avail.remaining_spots <= 3 && avail.remaining_spots > 0;

                      return (
                        <button
                          key={avail.id}
                          onClick={() => !isSoldOut && setSelectedAvailability(isSelected ? null : avail)}
                          disabled={isSoldOut}
                          className={`p-3 border text-left transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-[var(--line-soft)] hover:border-primary/40'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Calendar size={12} className="text-primary" />
                            <p className="text-sm font-serif text-[var(--text-primary)]">
                              {new Date(avail.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          <p className="text-[10px] text-[var(--text-muted)] font-sans">{avail.start_time}</p>
                          <p className="text-sm font-serif text-primary mt-1">{formatPrice(avail.effective_price, tour.currency)}</p>
                          {isSoldOut ? (
                            <Badge label="Sold Out" color="red" size="sm" />
                          ) : fewSpots ? (
                            <p className="text-[10px] text-orange-400 font-sans mt-1">{avail.remaining_spots} spots left</p>
                          ) : (
                            <p className="text-[10px] text-[var(--text-muted)] font-sans mt-1">{avail.remaining_spots} spots</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Booking sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-[var(--surface-card)] border border-[var(--line-soft)] p-6">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] font-sans mb-6">Book This Tour</h3>

                <div className="mb-6">
                  <p className="text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-wider">Price per person</p>
                  <p className="text-3xl font-serif text-[var(--text-primary)]">{formatPrice(selectedPrice, tour.currency)}</p>
                </div>

                {selectedAvailability && (
                  <div className="mb-6 p-3 border border-primary/20 bg-primary/5">
                    <p className="text-xs text-primary font-sans font-bold">
                      {new Date(selectedAvailability.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] font-sans mt-1">Starting at {selectedAvailability.start_time}</p>
                  </div>
                )}

                {/* Guest count */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans mb-3">Number of Guests</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-xl font-serif text-[var(--text-primary)] w-8 text-center">{guests}</span>
                    <button
                      onClick={() => setGuests((g) => Math.min(selectedAvailability?.remaining_spots || tour.max_capacity, g + 1))}
                      className="w-9 h-9 border border-[var(--line-strong)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-[var(--line-soft)] pt-4 mb-6">
                  <div className="flex items-end justify-between">
                    <p className="text-xs text-[var(--text-muted)] font-sans uppercase tracking-wider">Total</p>
                    <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(totalPrice, tour.currency)}</p>
                  </div>
                </div>

                {selectedAvailability ? (
                  <Link href={`/tours/book?tourId=${tour.id}&availabilityId=${selectedAvailability.id}&guests=${guests}&price=${selectedPrice}&tourName=${encodeURIComponent(tour.translated_title)}&date=${selectedAvailability.date}&time=${selectedAvailability.start_time}&currency=${tour.currency}`}>
                    <Button variant="gradient" className="w-full">
                      Book Now
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm text-[var(--text-muted)] font-sans text-center py-2">Select a date to book</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
