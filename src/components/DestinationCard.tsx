import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";

interface DestinationCardProps {
  image: string;
  alt: string;
  category: string;
  title: string;
  description?: string;
  features?: string[];
  price: string;
  pricePrefix?: string;
  titleSize?: "lg" | "sm";
  grayscale?: "30" | "20";
}

export default function DestinationCard({
  image,
  alt,
  category,
  title,
  description,
  features,
  price,
  pricePrefix = "from",
  titleSize = "lg",
  grayscale = "30",
}: DestinationCardProps) {
  const titleClass =
    titleSize === "lg"
      ? "text-4xl font-serif text-white mb-4 italic"
      : "text-3xl font-serif text-white mb-4 italic leading-snug";

  const grayscaleClass =
    grayscale === "30" ? "grayscale-[30%]" : "grayscale-[20%]";

  return (
    <article className="group relative overflow-hidden transition-all duration-500 cursor-pointer h-[590px] bg-black/30 border border-white/10 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.42)]">
      {/* Hover border frame */}
      <div className="absolute inset-0 border border-transparent group-hover:border-primary/50 z-20 transition-all duration-500 pointer-events-none m-3" />

      {/* Image */}
      <Image
        alt={alt}
        src={image}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className={`object-cover ${grayscaleClass} group-hover:grayscale-0 group-hover:scale-[1.06] transition-all duration-1000`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/18 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#1b3a42]/22" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-7 w-full z-10">
        <span className="text-primary text-[10px] font-semibold uppercase tracking-[0.24em] mb-2 block font-sans">
          {category}
        </span>
        <h4 className={titleClass}>{title}</h4>
        <div className="w-12 h-[1px] bg-primary mb-6" />

        {features ? (
          <ul className="text-slate-200 text-sm mb-6 space-y-1 font-light leading-relaxed font-sans">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-200 text-sm mb-6 line-clamp-2 font-light leading-relaxed font-sans min-h-[44px]">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-white font-serif text-xl">
            {pricePrefix} {price}
          </span>
          <div className="w-12 h-12 flex items-center justify-center text-white border border-white/30 bg-white/5 group-hover:bg-primary group-hover:border-primary transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </article>
  );
}
