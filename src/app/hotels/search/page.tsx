'use client';

import { useState, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Users, Search, Star, ArrowRight, LayoutGrid, List } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input, Button, Spinner, Pagination, EmptyState } from '@/components/ui';
import { hotelsApi } from '@/lib/api/hotels';
import { ApiError } from '@/lib/api/client';
import { useToast } from '@/components/ui/Toast';
import type { HotelSearchResult } from '@/types/hotel';

function HotelSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [adults, setAdults] = useState(searchParams.get('adults') || '2');
  const [children, setChildren] = useState(searchParams.get('children') || '0');

  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;
  const totalPages = Math.ceil(results.length / perPage);
  const paginatedResults = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!destination || !checkIn || !checkOut) {
      toast('error', 'Please fill in all search fields');
      return;
    }

    setLoading(true);
    setSearched(true);
    setCurrentPage(1);
    try {
      const data = await hotelsApi.search({
        destination,
        checkIn,
        checkOut,
        occupancies: [{ adults: parseInt(adults), children: parseInt(children) }],
      });
      setResults(data);

      const params = new URLSearchParams({ destination, checkIn, checkOut, adults, children });
      router.replace(`/hotels/search?${params.toString()}`, { scroll: false });
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Search failed');
      }
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  return (
    <>
      {/* Search Bar */}
      <section className="pt-32 pb-8 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">Find Your Hotel</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mb-8">Search luxury hotels across Egypt and beyond</p>

          <form onSubmit={handleSearch} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
              <div className="md:col-span-2">
                <Input
                  label="Destination"
                  placeholder="City or destination code"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  icon={<MapPin size={18} />}
                  size="sm"
                />
              </div>
              <div>
                <Input
                  label="Check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  icon={<Calendar size={18} />}
                  size="sm"
                />
              </div>
              <div>
                <Input
                  label="Check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  icon={<Calendar size={18} />}
                  size="sm"
                />
              </div>
              <div>
                <Input
                  label="Adults"
                  type="number"
                  min="1"
                  max="6"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  icon={<Users size={18} />}
                  size="sm"
                />
              </div>
              <div>
                <Button type="submit" variant="primary" loading={loading} className="w-full h-[42px]" size="sm">
                  <Search size={14} />
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="pb-32 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="py-20">
              <Spinner size="lg" />
              <p className="text-center text-sm text-[var(--text-muted)] font-sans mt-4">Searching hotels...</p>
            </div>
          ) : searched && results.length === 0 ? (
            <EmptyState
              title="No Hotels Found"
              description="Try adjusting your search criteria or destination."
            />
          ) : results.length > 0 ? (
            <>
              {/* Results header */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-[var(--text-muted)] font-sans">
                  <span className="text-primary font-bold">{results.length}</span> hotels found
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-primary'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${viewMode === 'list' ? 'text-primary' : 'text-[var(--text-muted)] hover:text-primary'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Grid / List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {paginatedResults.map((hotel) => (
                  <HotelCard key={hotel.hotel_code} hotel={hotel} viewMode={viewMode} formatPrice={formatPrice} checkIn={checkIn} checkOut={checkOut} adults={adults} children={children} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12">
                <Pagination currentPage={currentPage} lastPage={totalPages} onPageChange={setCurrentPage} />
              </div>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}

interface HotelCardProps {
  hotel: HotelSearchResult;
  viewMode: 'grid' | 'list';
  formatPrice: (price: number, currency: string) => string;
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
}

function HotelCard({ hotel, viewMode, formatPrice, checkIn, checkOut, adults, children }: HotelCardProps) {
  const rateKeys = hotel.rooms.map((r) => r.rate_key).join(',');
  const href = `/hotels/search/rooms?rateKeys=${encodeURIComponent(rateKeys)}&hotelCode=${hotel.hotel_code}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}`;

  if (viewMode === 'list') {
    return (
      <Link href={href} className="group block bg-[var(--surface-card)] border border-[var(--line-soft)] hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Image placeholder */}
          <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center shrink-0">
            <Star size={32} strokeWidth={1} className="text-primary/30" />
          </div>
          <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-1">{hotel.category_name}</p>
              <h3 className="text-xl font-serif text-[var(--text-primary)] group-hover:text-primary transition-colors">{hotel.hotel_name}</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{hotel.destination_name}</p>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{hotel.rooms.length} room types available</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-wider">from</p>
              <p className="text-2xl font-serif text-[var(--text-primary)]">{formatPrice(hotel.min_selling_price, hotel.currency)}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-sans">per night</p>
            </div>
          </div>
          <div className="hidden md:flex items-center pr-6">
            <ArrowRight size={20} className="text-[var(--text-muted)] group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block bg-[var(--surface-card)] border border-[var(--line-soft)] hover:border-primary/30 transition-all duration-300 overflow-hidden">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
        <Star size={40} strokeWidth={1} className="text-primary/30" />
      </div>
      <div className="p-5">
        <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-sans mb-2">{hotel.category_name}</p>
        <h3 className="text-lg font-serif text-[var(--text-primary)] group-hover:text-primary transition-colors mb-1">{hotel.hotel_name}</h3>
        <p className="text-xs text-[var(--text-muted)] font-sans mb-4">{hotel.destination_name}</p>
        <div className="w-10 h-[1px] bg-primary mb-4" />
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] font-sans uppercase tracking-wider">from</p>
            <p className="text-xl font-serif text-[var(--text-primary)]">{formatPrice(hotel.min_selling_price, hotel.currency)}</p>
          </div>
          <div className="w-10 h-10 border border-[var(--line-strong)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all">
            <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HotelSearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="pt-32 pb-32"><Spinner size="lg" /></div>}>
        <HotelSearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
