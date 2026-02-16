import { ArrowRight } from "lucide-react";

interface DestinationCardProps {
  gradient: string;
  alt: string;
  category: string;
  title: string;
  description: string;
  price: string;
}

export default function DestinationCard({
  gradient,
  alt,
  category,
  title,
  description,
  price,
}: DestinationCardProps) {
  return (
    <div className="group relative overflow-hidden transition-all cursor-pointer h-[550px]">
      {/* Hover border frame */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 z-20 transition-all duration-500 pointer-events-none m-4" />

      {/* Placeholder gradient background */}
      <div
        className={`absolute inset-0 ${gradient}`}
        aria-label={alt}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-10 w-full z-10">
        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block font-sans">
          {category}
        </span>
        <h4 className="text-4xl font-serif text-white mb-4 italic">{title}</h4>
        <div className="w-12 h-[1px] bg-primary mb-6" />
        <p className="text-slate-300 text-sm mb-6 line-clamp-2 font-light leading-relaxed font-sans">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white font-serif text-lg">from {price}</span>
          <div className="w-12 h-12 flex items-center justify-center text-white border border-white/30 group-hover:bg-primary group-hover:border-primary transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
