'use client';

import { useState, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Calendar, Users, Search, LayoutGrid, List } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import { Input, Button, Spinner, Pagination, EmptyState } from '@/components/ui';
import { useHotelSearch } from '@/hooks/useHotels';
import { PAGE_SIZE } from '@/lib/constants';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import type { HotelSearchResult } from '@/types/hotel';
import { formatPrice } from '@/lib/utils/format';

function HotelSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [adults, setAdults] = useState(searchParams.get('adults') || '2');
  const [children, setChildren] = useState(searchParams.get('children') || '0');

  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = PAGE_SIZE.GRID;
  const totalPages = Math.ceil(results.length / perPage);
  const paginatedResults = results.slice((currentPage - 1) * perPage, currentPage * perPage);

  const searchMutation = useHotelSearch();
  useQueryErrorToast(searchMutation.isError, searchMutation.error, 'Search failed');

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!destination || !checkIn || !checkOut) return;

    setSearched(true);
    setCurrentPage(1);

    searchMutation.mutate(
      {
        destination,
        checkIn,
        checkOut,
        occupancies: [{ adults: parseInt(adults), children: parseInt(children) }],
      },
      {
        onSuccess: (data) => {
          setResults(data);
          const params = new URLSearchParams({ destination, checkIn, checkOut, adults, children });
          router.replace(`/hotels/search?${params.toString()}`, { scroll: false });
        },
        onError: () => {
          setResults([]);
        },
      },
    );
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
                <Button type="submit" variant="primary" loading={searchMutation.isPending} className="w-full h-[42px]" size="sm">
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
          {searchMutation.isPending ? (
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
                  <HotelCard key={hotel.hotel_code} hotel={hotel} viewMode={viewMode} formatPrice={formatPrice} checkIn={checkIn} checkOut={checkOut} adults={adults} childrenCount={children} />
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
