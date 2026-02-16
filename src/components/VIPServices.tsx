import { ClipboardCheck, Car, Headphones } from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: ClipboardCheck,
    title: "Visa Services",
    description:
      "Hassle-free entry arrangements and VIP processing for individuals and groups. We handle the paperwork, you enjoy the arrival.",
  },
  {
    icon: Car,
    title: "Private Transfers",
    description:
      "Travel in comfort with our luxury fleet of late-model vehicles. Professional chauffeurs trained in executive protection and service.",
  },
  {
    icon: Headphones,
    title: "Meet & Assist",
    description:
      "Our airport greeting and fast-track service ensures you bypass the queues and reach your destination with ease and elegance.",
  },
];

export default function VIPServices() {
  return (
    <section id="vip" className="py-32 bg-bg-vip relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 font-sans">
            Concierge Excellence
          </h2>
          <h3 className="text-4xl md:text-7xl font-serif text-white mb-8 tracking-tight">
            VIP & Exclusive Services
          </h3>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10" />
          <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed font-sans">
            Experience Egypt without limits. Our dedicated lifestyle managers
            ensure every detail of your journey is handled with absolute
            discretion.
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
            Request Personal Concierge
          </button>
        </div>
      </div>
    </section>
  );
}
