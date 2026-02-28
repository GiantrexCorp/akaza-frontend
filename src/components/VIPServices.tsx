import { ClipboardCheck, Car, Headphones } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: ClipboardCheck,
    title: "Tailored Travel Planning",
    description:
      "Custom itinerary design based on travel purpose, timing, traveler profile, and preferred pace.",
  },
  {
    icon: Car,
    title: "VIP Transfers",
    description:
      "Private airport transfers, executive mobility, and premium movement planning with trusted partners.",
  },
  {
    icon: Headphones,
    title: "Concierge Handling",
    description:
      "Human-led support for reservations, special requests, and in-trip coordination from inquiry to return.",
  },
];

export default function VIPServices() {
  return (
    <section id="vip" className="py-32 bg-[var(--surface-section)] relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 font-sans">
            Premium Service Model
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-7xl font-serif text-[var(--text-primary)] mb-8 tracking-tight">
            Private Handling, End To End
          </h3>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10" />
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg font-light leading-relaxed font-sans">
            Luxury is clarity. We reduce uncertainty with structured delivery
            before, during, and after every journey.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-white px-12 py-5 font-bold uppercase tracking-widest text-xs transition-all duration-300">
            Request Private Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
