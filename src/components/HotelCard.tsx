import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import type { HotelSearchResult } from '@/types/hotel';

interface HotelCardProps {
  hotel: HotelSearchResult;
  viewMode: 'grid' | 'list';
  formatPrice: (price: number, currency: string) => string;
  checkIn: string;
  checkOut: string;
  adults: string;
  childrenCount: string;
}

export default function HotelCard({ hotel, viewMode, formatPrice, checkIn, checkOut, adults, childrenCount }: HotelCardProps) {
  const rateKeys = hotel.rooms.map((r) => r.rate_key).join(',');
  const href = `/hotels/search/rooms?rateKeys=${encodeURIComponent(rateKeys)}&hotelCode=${hotel.hotel_code}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}`;

  if (viewMode === 'list') {
    return (
      <Link href={href} className="group block bg-[var(--surface-card)] border border-[var(--line-soft)] hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
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
