'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Users, ArrowRight, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input, Button, Spinner, Pagination, EmptyState } from '@/components/ui';
import { toursApi } from '@/lib/api/tours';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import type { Tour } from '@/types/tour';

export default function ToursPage() {
  const { toast } = useToast();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchTours = async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString() });
      if (searchQuery) params.set('filter[location]', searchQuery);
      const data = await toursApi.list(params.toString());
      const normalizedTours = Array.isArray(data?.data) ? data.data : [];
      setTours(normalizedTours);
      setCurrentPage(data?.meta?.current_page ?? 1);
      setLastPage(data?.meta?.last_page ?? 1);
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Failed to load tours');
      }
      setTours([]);
      setCurrentPage(1);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(1);
  }, []);

  const handleSearch = () => {
    fetchTours(1);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-8 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans mb-3">Curated Experiences</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[var(--text-primary)] leading-none mb-4">
              Explore Egypt&apos;s <span className="italic">Finest Tours</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] font-sans font-light max-w-2xl">
              Handpicked experiences across Egypt&apos;s most iconic destinations
            </p>
            <div className="mt-6 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          {/* Search bar */}
          <div className="flex gap-4 max-w-lg">
            <div className="flex-1">
              <Input
                placeholder="Search by location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                icon={<MapPin size={18} />}
                size="sm"
              />
            </div>
            <Button variant="primary" size="sm" onClick={handleSearch} icon={<Search size={14} />}>
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6 pt-8">
          {loading ? (
            <div className="py-20">
              <Spinner size="lg" />
            </div>
          ) : tours.length === 0 ? (
            <EmptyState title="No Tours Found" description="Check back later for new experiences." />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} formatPrice={formatPrice} />
                ))}
              </div>

              <div className="mt-12">
                <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={(p) => fetchTours(p)} />
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

interface TourCardProps {
  tour: Tour;
  formatPrice: (price: number, currency: string) => string;
}

function TourCard({ tour, formatPrice }: TourCardProps) {
  const heroImage = tour.images[0];

  return (
    <Link href={`/tours/${tour.slug}`} className="group block relative h-[520px] overflow-hidden">
      {/* Image */}
      <div className="absolute inset-0">
        {heroImage ? (
          <Image
            src={heroImage.url}
            alt={tour.translated_title}
            fill
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-bg-darker" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-overlay)] via-transparent to-transparent" />
      </div>

      {/* Hover border frame */}
      <div className="absolute inset-0 m-4 border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-500 pointer-events-none z-10" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">{tour.location}</p>
        <h3 className="text-2xl font-serif text-white italic mb-3 leading-snug">{tour.translated_title}</h3>
        <div className="w-10 h-[1px] bg-primary mb-3" />

        <div className="flex items-center gap-4 mb-4">
          {tour.duration_days > 0 && (
            <span className="flex items-center gap-1 text-slate-300 text-xs font-sans">
              <Clock size={12} /> {tour.duration_days}d {tour.duration_hours}h
            </span>
          )}
          {tour.duration_days === 0 && tour.duration_hours > 0 && (
            <span className="flex items-center gap-1 text-slate-300 text-xs font-sans">
              <Clock size={12} /> {tour.duration_hours}h
            </span>
          )}
          <span className="flex items-center gap-1 text-slate-300 text-xs font-sans">
            <Users size={12} /> Up to {tour.max_capacity}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">from</p>
            <p className="text-xl font-serif text-white">{formatPrice(tour.price_per_person, tour.currency)}</p>
            <p className="text-[10px] text-slate-400 font-sans">per person</p>
          </div>
          <div className="w-10 h-10 border border-white/30 flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </div>
    </Link>
  );
}
