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
    <div className="group relative overflow-hidden transition-all cursor-pointer h-[550px]">
      {/* Hover border frame */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 z-20 transition-all duration-500 pointer-events-none m-4" />

      {/* Image */}
      <img
        alt={alt}
        src={image}
        className={`absolute inset-0 w-full h-full object-cover ${grayscaleClass} group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000`}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg-darker via-transparent to-transparent opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-10 w-full z-10">
        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block font-sans">
          {category}
        </span>
        <h4 className={titleClass}>{title}</h4>
        <div className="w-12 h-[1px] bg-primary mb-6" />

        {features ? (
          <ul className="text-slate-300 text-sm mb-6 space-y-1 font-light leading-relaxed font-sans">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-300 text-sm mb-6 line-clamp-2 font-light leading-relaxed font-sans">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-white font-serif text-lg">
            {pricePrefix} {price}
          </span>
          <div className="w-12 h-12 flex items-center justify-center text-white border border-white/30 group-hover:bg-primary group-hover:border-primary transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
