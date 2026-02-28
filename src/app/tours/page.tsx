'use client';

import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { Input, Button, Spinner, Pagination, EmptyState } from '@/components/ui';
import { useTourList } from '@/hooks/useTours';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { formatPrice } from '@/lib/utils/format';

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const params = new URLSearchParams({ page: currentPage.toString() });
  if (appliedSearch) params.set('filter[location]', appliedSearch);

  const { data, isLoading, error, isError } = useTourList(params.toString());
  useQueryErrorToast(isError, error, 'Failed to load tours');

  const tours = Array.isArray(data?.data) ? data.data : [];
  const lastPage = data?.meta?.last_page ?? 1;

  const handleSearch = () => {
    setAppliedSearch(searchQuery);
    setCurrentPage(1);
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
          {isLoading ? (
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
                <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}

