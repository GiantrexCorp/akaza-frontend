import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SubpageHero from "@/components/SubpageHero";

type DestinationLayout = "mosaic" | "grid" | "programs";

type Destination = {
  name: string;
  image: string;
  teaser: string;
  eyebrow?: string;
};

type DestinationGroup = {
  title: string;
  subtitle: string;
  basePath: string;
  layout: DestinationLayout;
  guideLabel: string;
  destinations: Destination[];
};

const destinationGroups: DestinationGroup[] = [
  {
    title: "Egypt",
    subtitle: "Ancient wonders and coastal luxury",
    basePath: "/destinations/egypt",
    layout: "mosaic",
    guideLabel: "View Country Guide",
    destinations: [
      {
        name: "Cairo",
        image: "https://as2.ftcdn.net/v2/jpg/01/22/84/81/1000_F_122848186_G6tXIbaMJhdbY8kyfx0vM3h89YrxKutR.jpg",
        teaser: "Tailored city program through timeless Egyptian icons.",
        eyebrow: "The Eternal Capital",
      },
      {
        name: "Hurghada",
        image: "https://www.barcelo.com/guia-turismo/wp-content/uploads/2024/11/hurghada-2.jpg",
        teaser: "Luxury coast programs and private sea experiences.",
        eyebrow: "Red Sea Riviera",
      },
      {
        name: "Marsa Alam",
        image: "https://as1.ftcdn.net/v2/jpg/01/68/49/56/1000_F_168495607_hr4geq8zE1njFcWtBfA1fo5UwaVg9SXg.jpg",
        teaser: "Nature-forward escapes for slower premium travel.",
        eyebrow: "Pristine Nature",
      },
      {
        name: "Sharm El Sheikh",
        image: "https://as2.ftcdn.net/v2/jpg/03/31/99/77/1000_F_331997737_i57MDGC3zkWJ6yKmV0ZMTeWzv1IftSpS.jpg",
        teaser: "Elite resort living with curated itinerary flow.",
        eyebrow: "Luxury Escape",
      },
      {
        name: "Luxor",
        image: "https://as2.ftcdn.net/v2/jpg/02/54/71/23/1000_F_254712381_HRrNFsgBe0dimYClNIJqHm0aTZkXbzyj.jpg",
        teaser: "Historic depth with refined journey pacing.",
        eyebrow: "Ancient Wonders",
      },
      {
        name: "Aswan",
        image: "https://as1.ftcdn.net/v2/jpg/03/90/42/84/1000_F_390428494_weFBlxmMjCwgvKQQoQuyRgK7wKuH7pNt.jpg",
        teaser: "Nile-side elegance and private guided discovery.",
        eyebrow: "Nile Heritage",
      },
      {
        name: "North Coast",
        image: "https://www.deeproperties.com/wp-content/uploads/2025/07/1-26-1024x575.jpg",
        teaser: "Seasonal coastal luxury with smart concierge planning.",
        eyebrow: "Mediterranean Bliss",
      },
    ],
  },
  {
    title: "Turkey",
    subtitle: "Where East meets West in luxury",
    basePath: "/destinations/turkey",
    layout: "grid",
    guideLabel: "View Country Guide",
    destinations: [
      {
        name: "Istanbul",
        image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Historical_peninsula_and_modern_skyline_of_Istanbul.jpg",
        teaser: "City heritage blended with modern luxury rhythm.",
      },
      {
        name: "Antalya",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/73/Falezlerden_Antalya_Konyaalt%C4%B1_Plaj%C4%B1na_do%C4%9Fru_bir_g%C3%B6r%C3%BCn%C3%BCm.jpg",
        teaser: "Premium beach circuits and elevated resort stays.",
      },
      {
        name: "Bodrum",
        image: "https://as2.ftcdn.net/v2/jpg/02/13/56/29/1000_F_213562913_Q9OfARRhNoGwLpjIDxdeYSpYfCbz35wJ.jpg",
        teaser: "Yachting spirit and design-led coastal escapes.",
      },
      {
        name: "Trabzon",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Trebisonda%2C_ex-chiesa_della_panagia_Chrysokephalos%2C_oggi_moschea_fatih%2C_esterno_01.jpg",
        teaser: "Mountain scenery and curated nature itineraries.",
      },
    ],
  },
  {
    title: "Regional Programs",
    subtitle: "Curated Middle Eastern experiences",
    basePath: "/destinations/regional",
    layout: "programs",
    guideLabel: "View Program Guide",
    destinations: [
      {
        name: "United Arab Emirates",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Abu_dhabi_skylines_2014.jpg",
        teaser:
          "From the futuristic skyline of Dubai to the cultural heart of Abu Dhabi, experience Arabian hospitality at its peak.",
        eyebrow: "Emirati Luxury",
      },
      {
        name: "Oman",
        image: "https://as1.ftcdn.net/v2/jpg/00/98/96/34/1000_F_98963492_thbbpZ210qtEQdCpHpPz30tmPxWms2Ub.jpg",
        teaser:
          "Discover ancient forts, emerald wadis, and the dramatic Hajar Mountains in the Sultanate's hidden gems.",
        eyebrow: "Desert Majesty",
      },
    ],
  },
];

function toSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function DestinationsPage() {
  return (
    <>
      <Navbar />

      <main className="relative bg-[var(--surface-page)] overflow-hidden">
        <SubpageHero
          badge="Luxury Experiences"
          title={
            <>
              Discover Our
              <br />
              Destinations
            </>
          }
          subtitle="Your journey, privately handled."
          imageSrc="https://as1.ftcdn.net/v2/jpg/02/72/23/66/1000_F_272236661_FpxJjrVwxYys822eNGYtPCrRuImDykZ4.jpg"
          imageAlt="AKAZA destination programs"
          primaryCta={{ label: "Start Exploring", href: "#destinations-grid" }}
          secondaryCta={{ label: "View All Offers", href: "/hotels/search" }}
        />

        <section id="destinations-grid" className="bg-[var(--destinations-surface)] px-6 pt-12 pb-24">
          <div className="max-w-7xl mx-auto space-y-16">
            {destinationGroups.map((group) => (
              <article key={group.title} className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 pb-6 border-b border-[var(--destinations-divider)]">
                  <div>
                    <h3 className="text-4xl md:text-6xl font-serif text-[var(--destinations-title)] leading-tight">{group.title}</h3>
                    <p className="mt-2 text-primary text-lg font-sans">{group.subtitle}</p>
                  </div>

                  <Link
                    href="/hotels/search"
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.24em] font-sans font-bold text-primary hover:text-primary-gradient-end transition-colors"
                  >
                    {group.guideLabel}
                    <ArrowRight size={16} />
                  </Link>
                </div>

                {group.layout === "mosaic" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:auto-rows-[300px]">
                    {group.destinations.map((destination) => {
                      const href = `${group.basePath}/${toSlug(destination.name)}`;
                      const isCairo = destination.name === "Cairo";
                      return (
                        <Link
                          key={destination.name}
                          href={href}
                          className={`group/destination block ${isCairo ? "md:col-span-2 xl:col-span-2 xl:row-span-2" : ""}`}
                        >
                          <article
                            className={`relative overflow-hidden rounded-2xl border border-[var(--destinations-card-border)] bg-black/30 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/75 hover:shadow-[0_28px_70px_rgba(0,0,0,0.56)] ${
                              isCairo ? "h-[540px] md:h-[620px] xl:h-full" : "h-[300px] xl:h-full"
                            }`}
                          >
                            <Image
                              src={destination.image}
                              alt={destination.name}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover/destination:scale-110"
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/35 to-transparent transition-colors duration-500 group-hover/destination:from-black/76" />
                            <div className="absolute inset-y-0 -left-[140%] w-[48%] rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-1000 group-hover/destination:left-[130%] group-hover/destination:opacity-60" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover/destination:ring-primary/70" />

                            <div className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/30 p-2 text-white opacity-0 transition-all duration-300 group-hover/destination:translate-x-1 group-hover/destination:opacity-100">
                              <ArrowRight size={14} />
                            </div>

                            <div className="absolute left-5 bottom-5 z-10 pr-5 transition-transform duration-500 group-hover/destination:-translate-y-1">
                              {destination.eyebrow && (
                                <p className="text-[11px] uppercase tracking-[0.24em] font-sans font-bold text-primary mb-2">
                                  {destination.eyebrow}
                                </p>
                              )}
                              <h4 className={`font-serif text-white leading-[0.95] ${isCairo ? "text-5xl md:text-6xl" : "text-[2.2rem]"}`}>
                                {destination.name}
                              </h4>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {group.layout === "grid" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {group.destinations.map((destination) => {
                      const href = `${group.basePath}/${toSlug(destination.name)}`;
                      return (
                        <Link key={destination.name} href={href} className="group/destination block">
                          <article className="relative h-[300px] sm:h-[360px] overflow-hidden rounded-2xl border border-[var(--destinations-card-border)] bg-black/20 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/75 hover:shadow-[0_24px_65px_rgba(0,0,0,0.54)]">
                            <Image
                              src={destination.image}
                              alt={destination.name}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover/destination:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-transparent transition-colors duration-500 group-hover/destination:from-black/72" />
                            <div className="absolute inset-y-0 -left-[130%] w-[44%] rotate-12 bg-gradient-to-r from-transparent via-white/28 to-transparent opacity-0 transition-all duration-1000 group-hover/destination:left-[130%] group-hover/destination:opacity-55" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover/destination:ring-primary/70" />

                            <div className="absolute left-5 bottom-5 z-10 pr-5 transition-transform duration-500 group-hover/destination:-translate-y-1">
                              <h4 className="text-5xl font-serif text-white leading-[0.95]">{destination.name}</h4>
                            </div>
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {group.layout === "programs" && (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {group.destinations.map((destination) => {
                      const href = `${group.basePath}/${toSlug(destination.name)}`;
                      return (
                        <Link key={destination.name} href={href} className="group/program block">
                          <article className="relative overflow-hidden rounded-2xl border border-[var(--destinations-card-border)] bg-[var(--destinations-program-surface)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/80 hover:shadow-[0_28px_70px_rgba(0,0,0,0.55)]">
                            <div className="grid grid-cols-1 md:grid-cols-[48%_52%]">
                              <div className="relative min-h-[250px] md:min-h-[340px]">
                                <Image
                                  src={destination.image}
                                  alt={destination.name}
                                  fill
                                  className="object-cover transition-transform duration-700 ease-out group-hover/program:scale-110"
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--destinations-program-surface)]" />
                              </div>

                              <div className="relative z-10 flex flex-col justify-between p-6 md:p-7 bg-[var(--destinations-program-overlay)]">
                                <div>
                                  {destination.eyebrow && (
                                    <p className="text-[11px] uppercase tracking-[0.24em] font-sans font-bold text-primary mb-3">
                                      {destination.eyebrow}
                                    </p>
                                  )}
                                  <h4 className="text-4xl md:text-5xl font-serif text-[var(--destinations-title)] leading-[0.95] mb-3">{destination.name}</h4>
                                  <p className="text-[1.1rem] leading-relaxed text-[var(--destinations-body)] font-sans">{destination.teaser}</p>
                                </div>

                                <div className="mt-6 inline-flex flex-col items-start gap-2 text-[13px] uppercase tracking-[0.18em] font-sans font-bold text-[var(--destinations-title)]">
                                  Explore Program
                                  <span className="h-px w-24 bg-primary transition-all duration-500 group-hover/program:w-32" />
                                </div>
                              </div>
                            </div>

                            <div className="absolute inset-y-0 -left-[140%] w-[35%] rotate-12 bg-gradient-to-r from-transparent via-white/26 to-transparent opacity-0 transition-all duration-1000 group-hover/program:left-[140%] group-hover/program:opacity-55" />
                            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover/program:ring-primary/70" />
                          </article>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </article>
            ))}

            <section className="border border-[var(--line-soft)] bg-gradient-to-r from-primary/10 via-transparent to-accent/10 p-6 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] font-sans font-bold text-primary mb-2">Ready To Move</p>
                <h3 className="text-2xl md:text-3xl font-serif text-[var(--text-primary)]">
                  Let AKAZA plan the trip around your standards.
                </h3>
              </div>
              <Link
                href="/hotels/search"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-gradient-end text-white px-6 py-3 text-xs uppercase tracking-widest font-sans font-bold hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                Book Your Journey
                <ArrowRight size={14} />
              </Link>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
