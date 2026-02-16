import { ArrowRight } from "lucide-react";
import DestinationCard from "./DestinationCard";

const destinations = [
  {
    gradient: "bg-gradient-to-br from-sky-800 via-cyan-700 to-blue-900",
    alt: "Hurghada Coastline",
    category: "Red Sea Luxury",
    title: "Hurghada",
    description:
      "Crystal clear waters and private yacht charters among vibrant coral reefs.",
    price: "$299",
  },
  {
    gradient: "bg-gradient-to-br from-teal-800 via-emerald-700 to-cyan-900",
    alt: "Diving in Marsa Alam",
    category: "Nature & Serenity",
    title: "Marsa Alam",
    description:
      "Untouched marine life and exclusive eco-luxury resorts for the ultimate escape.",
    price: "$450",
  },
  {
    gradient: "bg-gradient-to-br from-amber-800 via-orange-700 to-yellow-900",
    alt: "Cairo Skyline and Nile",
    category: "Historic Grandeur",
    title: "Cairo & Giza",
    description:
      "Private access to ancient wonders and world-class fine dining in the heart of history.",
    price: "$1,200",
  },
];

export default function DestinationsSection() {
  return (
    <section id="destinations" className="py-32 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-slate-800 pb-8">
        <div className="max-w-2xl">
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 font-sans">
            Curated Experiences
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif text-white leading-none">
            Iconic Destinations{" "}
            <br />
            <span className="italic text-slate-500">Told Through Luxury</span>
          </h3>
        </div>
        <a
          href="#"
          className="group text-white font-medium flex items-center gap-3 hover:text-primary transition-all uppercase tracking-widest text-xs font-sans"
        >
          Explore All{" "}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <DestinationCard key={dest.title} {...dest} />
        ))}
      </div>
    </section>
  );
}
