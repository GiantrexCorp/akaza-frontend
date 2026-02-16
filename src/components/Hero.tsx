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
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/30 to-bg-dark/80" />
        <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6 mt-12">
        <span className="inline-block px-4 py-1.5 border border-primary/40 bg-black/20 backdrop-blur-sm text-xs font-serif italic tracking-wider text-primary mb-8">
          Curated for the Extraordinary
        </span>

        <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 tracking-wide leading-tight drop-shadow-2xl">
          Explore the Wonders{" "}
          <br />
          <span className="text-primary italic">of Egypt</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-200 mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide drop-shadow-md font-sans">
          Bespoke journeys and luxury concierge services tailored for the
          discerning traveler seeking the extraordinary.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <button className="w-full md:w-auto bg-primary hover:bg-white hover:text-bg-dark text-white px-10 py-4 font-serif text-lg tracking-wide transition-all duration-300 min-w-[200px]">
            Explore Excursions
          </button>
          <button className="w-full md:w-auto border border-white/40 bg-white/5 backdrop-blur-md text-white px-10 py-4 font-serif text-lg tracking-wide hover:bg-white/10 transition-all min-w-[200px]">
            View Packages
          </button>
        </div>
      </div>
    </section>
  );
}
