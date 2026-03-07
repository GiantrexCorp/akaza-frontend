'use client';

import { useState, useMemo, useEffect, Suspense, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Users, Search, LayoutGrid, List, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HotelCard from '@/components/HotelCard';
import { Input, DateRangePicker, Button, Spinner, Pagination, EmptyState, Autocomplete, Select, Toggle } from '@/components/ui';
import type { AutocompleteOption, DateRange } from '@/components/ui';
import { useHotelSearch } from '@/hooks/useHotels';
import { useDestinationSearch } from '@/hooks/useDestinationSearch';
import { hotelsApi } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import type { HotelSearchResult } from '@/types/hotel';
import { formatPrice } from '@/lib/utils/format';

type SortOption = 'price_asc' | 'price_desc' | 'stars_desc' | 'name_asc';

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'stars_desc', label: 'Stars: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
];

function parseStars(categoryName: string): number {
  const match = categoryName.match(/(\d)/);
  return match ? parseInt(match[1], 10) : 0;
}

function hasFreeCancellation(hotel: HotelSearchResult): boolean {
  return hotel.rooms.some((r) => r.cancellation_policies.length > 0);
}

function HotelSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destinationCode, setDestinationCode] = useState(searchParams.get('destination') || '');
  const [destinationName, setDestinationName] = useState(searchParams.get('destinationName') || '');
  const [dates, setDates] = useState<DateRange>({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  });
  const [adults, setAdults] = useState(searchParams.get('adults') || '2');
  const [children, setChildren] = useState(searchParams.get('children') || '0');

  const destSearch = useDestinationSearch();
  const destinationOptions: AutocompleteOption[] = destSearch.results.map((d) => ({
    value: d.code,
    label: d.name,
    sublabel: d.country_name || d.country_code,
  }));

  const [results, setResults] = useState<HotelSearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter & sort state
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [freeCancellation, setFreeCancellation] = useState(false);

  // Derive available filter options from results
  const availableStars = useMemo(() => {
    const stars = new Set<number>();
    results.forEach((h) => {
      const s = parseStars(h.category_name);
      if (s > 0) stars.add(s);
    });
    return Array.from(stars).sort((a, b) => a - b);
  }, [results]);

  const availableBoards = useMemo(() => {
    const boards = new Set<string>();
    results.forEach((h) => h.rooms.forEach((r) => boards.add(r.board_name)));
    return Array.from(boards).sort();
  }, [results]);

  const isFilterActive = selectedStars.length > 0 || selectedBoards.length > 0 || minPrice !== '' || maxPrice !== '' || freeCancellation;

  const clearAllFilters = () => {
    setSelectedStars([]);
    setSelectedBoards([]);
    setMinPrice('');
    setMaxPrice('');
    setFreeCancellation(false);
    setSortBy('price_asc');
    setCurrentPage(1);
  };

  // Pipeline: filter → sort → paginate
  const filteredAndSorted = useMemo(() => {
    let filtered = results;

    if (selectedStars.length > 0) {
      filtered = filtered.filter((h) => selectedStars.includes(parseStars(h.category_name)));
    }

    if (selectedBoards.length > 0) {
      filtered = filtered.filter((h) =>
        h.rooms.some((r) => selectedBoards.includes(r.board_name))
      );
    }

    const minP = minPrice !== '' ? parseFloat(minPrice) : null;
    const maxP = maxPrice !== '' ? parseFloat(maxPrice) : null;
    if (minP !== null) filtered = filtered.filter((h) => h.min_selling_price >= minP);
    if (maxP !== null) filtered = filtered.filter((h) => h.min_selling_price <= maxP);

    if (freeCancellation) {
      filtered = filtered.filter(hasFreeCancellation);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => a.min_selling_price - b.min_selling_price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.min_selling_price - a.min_selling_price);
        break;
      case 'stars_desc':
        sorted.sort((a, b) => parseStars(b.category_name) - parseStars(a.category_name));
        break;
      case 'name_asc':
        sorted.sort((a, b) => a.hotel_name.localeCompare(b.hotel_name));
        break;
    }

    return sorted;
  }, [results, selectedStars, selectedBoards, minPrice, maxPrice, freeCancellation, sortBy]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = PAGE_SIZE.GRID;
  const totalPages = Math.ceil(filteredAndSorted.length / perPage);
  const paginatedResults = filteredAndSorted.slice((currentPage - 1) * perPage, currentPage * perPage);

  const toggleStar = (star: number) => {
    setSelectedStars((prev) => prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]);
    setCurrentPage(1);
  };

  const toggleBoard = (board: string) => {
    setSelectedBoards((prev) => prev.includes(board) ? prev.filter((b) => b !== board) : [...prev, board]);
    setCurrentPage(1);
  };

  const searchMutation = useHotelSearch();
  useQueryErrorToast(searchMutation.isError, searchMutation.error, 'Search failed');

  const handleSearch = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!destinationCode || !dates.checkIn || !dates.checkOut) return;

    setSearched(true);
    setCurrentPage(1);

    searchMutation.mutate(
      {
        destination: destinationCode,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        occupancies: [{ adults: parseInt(adults), children: parseInt(children) }],
      },
      {
        onSuccess: (data) => {
          setResults(data);
          const params = new URLSearchParams({ destination: destinationCode, destinationName, checkIn: dates.checkIn, checkOut: dates.checkOut, adults, children });
          router.replace(`/hotels/search?${params.toString()}`, { scroll: false });
        },
        onError: () => {
          setResults([]);
        },
      },
    );
  };

  // Auto-search on mount when URL has valid search params (direct API call to avoid mutation lifecycle issues during client navigation)
  useEffect(() => {
    const dest = searchParams.get('destination');
    const ci = searchParams.get('checkIn');
    const co = searchParams.get('checkOut');
    if (!dest || !ci || !co) return;

    let cancelled = false;
    setSearched(true);
    setIsAutoSearching(true);
    setCurrentPage(1);

    hotelsApi
      .search({
        destination: dest,
        check_in: ci,
        check_out: co,
        occupancies: [
          {
            adults: parseInt(searchParams.get('adults') || '2'),
            children: parseInt(searchParams.get('children') || '0'),
          },
        ],
      })
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsAutoSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Search Bar */}
      <section className="pt-32 pb-8 bg-[var(--surface-page)]">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--text-primary)] mb-2">Find Your Hotel</h1>
          <p className="text-sm text-[var(--text-muted)] font-sans mb-8">Search luxury hotels across Egypt and beyond</p>

          <form onSubmit={handleSearch} className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div className="md:col-span-2">
                <Autocomplete
                  label="Destination"
                  placeholder="Search city or destination"
                  icon={<MapPin size={18} />}
                  size="sm"
                  query={destSearch.query}
                  onQueryChange={destSearch.setQuery}
                  options={destinationOptions}
                  isLoading={destSearch.isLoading}
                  selectedLabel={destinationName}
                  onSelect={(opt) => {
                    setDestinationCode(opt.value);
                    setDestinationName(opt.label);
                  }}
                  onClear={() => {
                    setDestinationCode('');
                    setDestinationName('');
                    destSearch.clear();
                  }}
                />
              </div>
              <div>
                <DateRangePicker
                  label="Dates"
                  value={dates}
                  onChange={setDates}
                  minDate={new Date().toISOString().split('T')[0]}
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
          {(searchMutation.isPending || isAutoSearching) ? (
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
              {/* Filter Bar */}
              <div className="bg-[var(--surface-card)] border border-[var(--line-soft)] p-4 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Sort */}
                  <div className="w-48">
                    <Select
                      size="sm"
                      label="Sort by"
                      options={SORT_OPTIONS}
                      value={sortBy}
                      onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
                    />
                  </div>

                  {/* Star Rating Pills */}
                  {availableStars.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Stars</span>
                      {availableStars.map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => toggleStar(star)}
                          className={`px-3 py-1 text-xs font-sans border rounded-full transition-colors ${
                            selectedStars.includes(star)
                              ? 'bg-primary/10 text-primary border-primary'
                              : 'border-[var(--line-soft)] text-[var(--text-muted)] hover:border-primary/40'
                          }`}
                        >
                          ★{star}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Board Type Pills */}
                  {availableBoards.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Board</span>
                      {availableBoards.map((board) => (
                        <button
                          key={board}
                          type="button"
                          onClick={() => toggleBoard(board)}
                          className={`px-3 py-1 text-xs font-sans border rounded-full transition-colors ${
                            selectedBoards.includes(board)
                              ? 'bg-primary/10 text-primary border-primary'
                              : 'border-[var(--line-soft)] text-[var(--text-muted)] hover:border-primary/40'
                          }`}
                        >
                          {board}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price Range */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans">Price</span>
                    <div className="w-24">
                      <Input
                        size="sm"
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                    <span className="text-[var(--text-muted)] text-xs">–</span>
                    <div className="w-24">
                      <Input
                        size="sm"
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                      />
                    </div>
                  </div>

                  {/* Free Cancellation */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] font-sans whitespace-nowrap">Free cancellation</span>
                    <Toggle
                      size="sm"
                      checked={freeCancellation}
                      onChange={(val) => { setFreeCancellation(val); setCurrentPage(1); }}
                    />
                  </div>

                  {/* Clear All */}
                  {isFilterActive && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="flex items-center gap-1 px-3 py-1 text-xs font-sans text-primary hover:text-primary-dark transition-colors"
                    >
                      <X size={12} />
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Results header */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-[var(--text-muted)] font-sans">
                  {isFilterActive ? (
                    <>
                      <span className="text-primary font-bold">{filteredAndSorted.length}</span> of {results.length} hotels
                    </>
                  ) : (
                    <>
                      <span className="text-primary font-bold">{results.length}</span> hotels found
                    </>
                  )}
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
              {filteredAndSorted.length === 0 ? (
                <EmptyState
                  title="No Matching Hotels"
                  description="Try adjusting your filters to see more results."
                />
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {paginatedResults.map((hotel) => (
                    <HotelCard key={hotel.hotel_code} hotel={hotel} viewMode={viewMode} formatPrice={formatPrice} checkIn={dates.checkIn} checkOut={dates.checkOut} adults={adults} childrenCount={children} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {filteredAndSorted.length > 0 && (
                <div className="mt-12">
                  <Pagination currentPage={currentPage} lastPage={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
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
