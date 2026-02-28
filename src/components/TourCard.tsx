import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ArrowRight } from 'lucide-react';
import type { Tour } from '@/types/tour';

interface TourCardProps {
  tour: Tour;
  formatPrice: (price: number, currency: string) => string;
}

export default function TourCard({ tour, formatPrice }: TourCardProps) {
  const heroImage = tour.images[0];

  return (
    <Link href={`/tours/${tour.slug}`} className="group block relative h-[520px] overflow-hidden">
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

      <div className="absolute inset-0 m-4 border-2 border-primary/0 group-hover:border-primary/50 transition-all duration-500 pointer-events-none z-10" />

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
