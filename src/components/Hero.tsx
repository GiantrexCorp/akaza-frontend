import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] pt-40 pb-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero/hero-main-v2.png"
          alt="Ancient Egyptian Pyramids at sunset"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/20 to-black/38" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1b3a42]/12 via-transparent to-[#b97532]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl bg-black/20 backdrop-blur-[2px] border border-white/10 p-8 md:p-10">
          <span className="inline-block px-5 py-2 border border-white/35 bg-black/25 backdrop-blur-sm text-xs uppercase tracking-[0.2em] text-primary mb-7 rounded-full font-semibold">
            Travel, handled.
          </span>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-7 tracking-[0.01em] leading-[0.95] drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)]">
            Your journey,
            <br />
            <span className="italic bg-gradient-to-r from-[#B97532] to-[#753F20] bg-clip-text text-transparent">privately handled.</span>
          </h1>

          <p className="text-lg md:text-[1.25rem] text-white/92 mb-10 max-w-3xl font-normal leading-relaxed tracking-[0.01em] drop-shadow-[0_8px_22px_rgba(0,0,0,0.45)]">
            Premium travel planning, handpicked stays, VIP transfers, and
            concierge-level handling across Egypt and key regional destinations.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-10 py-4 text-sm uppercase tracking-[0.2em] transition-all duration-300 min-w-[220px] font-semibold">
              Plan My Journey
            </button>
            <button className="w-full sm:w-auto border border-white/35 bg-black/22 backdrop-blur-md text-white px-10 py-4 text-sm uppercase tracking-[0.2em] hover:bg-black/32 transition-all min-w-[220px] font-semibold">
              Explore Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
