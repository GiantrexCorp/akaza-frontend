import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-pyramids.png"
          alt="Ancient Egyptian Pyramids at sunset"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-overlay-start)] to-[var(--hero-overlay-end)]" />
        <div className="absolute inset-0 bg-[var(--hero-overlay-blend)] mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-12">
        <span className="inline-block px-4 py-1.5 border border-primary/40 bg-[var(--hero-pill-bg)] backdrop-blur-sm text-xs font-serif italic tracking-wider text-primary mb-8">
          Travel, handled.
        </span>

        <h1 className="text-5xl md:text-8xl font-serif text-[var(--text-primary)] mb-8 tracking-wide leading-tight drop-shadow-2xl">
          Your journey,{" "}
          <br />
          <span className="text-primary italic">privately handled.</span>
        </h1>

        <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md font-sans">
          Premium travel planning, handpicked stays, VIP transfers, and
          concierge-level handling across Egypt and key regional destinations.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-4 font-serif text-lg tracking-wide transition-all duration-300 min-w-[200px]">
            Plan My Journey
          </button>
          <button className="w-full md:w-auto border border-[var(--hero-secondary-btn-border)] bg-[var(--hero-secondary-btn-bg)] backdrop-blur-md text-[var(--text-primary)] px-10 py-4 font-serif text-lg tracking-wide hover:bg-white/90 transition-all min-w-[200px]">
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
}
