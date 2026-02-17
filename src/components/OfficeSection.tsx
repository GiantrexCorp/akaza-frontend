import { Phone, Mail } from "lucide-react";

export default function OfficeSection() {
  return (
    <section className="h-[450px] w-full relative">
      <div className="absolute inset-0 bg-bg-dark/60 z-10 pointer-events-none" />
      <img
        alt="Egypt Map Stylized"
        src="/images/map-egypt.jpg"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-bg-vip/95 backdrop-blur-xl border border-white/10 p-12 text-center shadow-2xl max-w-md w-full mx-4">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-primary mb-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 22H7L12 12L17 22H22L12 2ZM12 5.8L15.1 12H8.9L12 5.8Z" />
            </svg>
            <span className="text-white text-lg font-serif tracking-widest block">
              AKAZA
            </span>
          </div>

          <h5 className="text-white text-xl font-serif mb-2 italic">
            Our Main Office
          </h5>
          <p className="text-slate-400 text-sm font-medium mb-8 uppercase tracking-wider font-sans">
            El Kawthar District, Hurghada, Egypt
          </p>

          <div className="space-y-3 text-slate-300 font-light font-sans">
            <div className="flex items-center justify-center gap-2 text-sm">
              <Phone size={12} className="text-primary" />
              +20 123 456 789
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Mail size={12} className="text-primary" />
              info@akaza-travel.com
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
