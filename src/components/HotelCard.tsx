'use client';

import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { Star, ArrowRight, Utensils } from 'lucide-react';
import { useHotelDetails } from '@/hooks/useHotels';
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

function parseStarCount(categoryName: string): number {
  const match = categoryName.match(/(\d)/);
  return match ? parseInt(match[1], 10) : 0;
}

function StarRating({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} size={12} className="fill-primary text-primary" />
      ))}
    </div>
  );
}

function BoardBadge({ boardName }: { boardName: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider font-sans">
      <Utensils size={10} />
      {boardName}
    </span>
  );
}

function HotelImage({ hotelCode }: { hotelCode: string }) {
  const { data: details, isLoading } = useHotelDetails(hotelCode);
  const firstImage = details?.images?.[0];

  if (isLoading) {
    return <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent animate-pulse" />;
  }

  if (firstImage?.path) {
    return (
      <Image
        src={firstImage.path}
        alt=""
        fill
        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
      <Star size={40} strokeWidth={1} className="text-primary/30" />
    </div>
  );
}

export default function HotelCard({ hotel, viewMode, formatPrice, checkIn, checkOut, adults, childrenCount }: HotelCardProps) {
  const rateKeys = hotel.rooms.map((r) => r.rate_key).join(',');
  const href = `/hotels/search/rooms?rateKeys=${encodeURIComponent(rateKeys)}&hotelCode=${hotel.hotel_code}&checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${childrenCount}&destination=${hotel.destination_code}&destinationName=${encodeURIComponent(hotel.destination_name)}`;

  const starCount = parseStarCount(hotel.category_name);
  const cheapestRoom = hotel.rooms.reduce((min, r) => (r.selling_price < min.selling_price ? r : min), hotel.rooms[0]);

  if (viewMode === 'list') {
    return (
      <Link href={href} className="group block bg-[var(--surface-card)] border border-[var(--line-soft)] hover:border-primary/30 transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-64 h-48 md:h-auto relative shrink-0 overflow-hidden">
            <HotelImage hotelCode={hotel.hotel_code} />
          </div>
          <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <StarRating count={starCount} />
                {cheapestRoom && <BoardBadge boardName={cheapestRoom.board_name} />}
              </div>
              <h3 className="text-xl font-serif text-[var(--text-primary)] group-hover:text-primary transition-colors">{hotel.hotel_name}</h3>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{hotel.destination_name}</p>
              <p className="text-xs text-[var(--text-muted)] font-sans mt-1">{hotel.rooms.length} room type{hotel.rooms.length !== 1 ? 's' : ''} available</p>
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
      <div className="h-48 relative overflow-hidden">
        <HotelImage hotelCode={hotel.hotel_code} />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <StarRating count={starCount} />
          {cheapestRoom && <BoardBadge boardName={cheapestRoom.board_name} />}
        </div>
        <h3 className="text-lg font-serif text-[var(--text-primary)] group-hover:text-primary transition-colors mb-1">{hotel.hotel_name}</h3>
        <p className="text-xs text-[var(--text-muted)] font-sans mb-1">{hotel.destination_name}</p>
        <p className="text-xs text-[var(--text-muted)] font-sans mb-4">{hotel.rooms.length} room type{hotel.rooms.length !== 1 ? 's' : ''}</p>
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
