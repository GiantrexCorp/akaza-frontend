import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import DestinationCard from "./DestinationCard";

type TabId = "hotels" | "excursions" | "transfers";

interface CardData {
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

interface SectionConfig {
  label: string;
  heading: string;
  subheading: string;
  linkText: string;
  cards: CardData[];
}

interface DestinationsSectionProps {
  activeTab: TabId;
}

export default function DestinationsSection({
  activeTab,
}: DestinationsSectionProps) {
  const t = useTranslations('home');

  const sectionData: Record<TabId, SectionConfig> = {
    excursions: {
      label: t('destSuperTitle'),
      heading: t('destTitle'),
      subheading: t('destSubtitle'),
      linkText: t('destCta'),
      cards: [
        {
          image: "/images/hurghada.jpg",
          alt: t('destHurghada'),
          category: t('destRedSea'),
          title: t('destHurghada'),
          description: t('destHurghadaDesc'),
          price: "$299",
          grayscale: "30",
        },
        {
          image: "/images/marsa-alam.jpg",
          alt: t('destMarsaAlam'),
          category: t('destNature'),
          title: t('destMarsaAlam'),
          description: t('destMarsaAlamDesc'),
          price: "$450",
          grayscale: "30",
        },
        {
          image: "/images/cairo.jpg",
          alt: t('destCairo'),
          category: t('destHistoric'),
          title: t('destCairo'),
          description: t('destCairoDesc'),
          price: "$1,200",
          grayscale: "30",
        },
      ],
    },
    hotels: {
      label: t('hotelSuperTitle'),
      heading: t('hotelTitle'),
      subheading: t('hotelSubtitle'),
      linkText: t('hotelCta'),
      cards: [
        {
          image: "/images/hotel-four-seasons.jpg",
          alt: t('hotelSharmAlt'),
          category: t('hotelSharm'),
          title: t('hotelSharmName'),
          description: t('hotelSharmDesc'),
          price: "$420",
          titleSize: "sm",
          grayscale: "20",
        },
        {
          image: "/images/hotel-marriott.jpg",
          alt: t('hotelCairoAlt'),
          category: t('hotelCairo'),
          title: t('hotelCairoName'),
          description: t('hotelCairoDesc'),
          price: "$380",
          titleSize: "sm",
          grayscale: "20",
        },
        {
          image: "/images/hotel-steigenberger.jpg",
          alt: t('hotelHurghadaAlt'),
          category: t('hotelHurghada'),
          title: t('hotelHurghadaName'),
          description: t('hotelHurghadaDesc'),
          price: "$265",
          titleSize: "sm",
          grayscale: "20",
        },
      ],
    },
    transfers: {
      label: t('transferSuperTitle'),
      heading: t('transferTitle'),
      subheading: t('transferSubtitle'),
      linkText: t('transferCta'),
      cards: [
        {
          image: "/images/vehicle-limousine.jpg",
          alt: t('transferSedanAlt'),
          category: t('transferSedan'),
          title: t('transferSedanName'),
          features: [
            t('transferSedanF1'),
            t('transferSedanF2'),
            t('transferSedanF3'),
          ],
          price: "$120",
          pricePrefix: t('startingFrom'),
          titleSize: "sm",
          grayscale: "20",
        },
        {
          image: "/images/vehicle-suv.jpg",
          alt: t('transferSuvAlt'),
          category: t('transferSuv'),
          title: t('transferSuvName'),
          features: [
            t('transferSuvF1'),
            t('transferSuvF2'),
            t('transferSuvF3'),
          ],
          price: "$180",
          pricePrefix: t('startingFrom'),
          titleSize: "sm",
          grayscale: "20",
        },
        {
          image: "/images/vehicle-van.jpg",
          alt: t('transferVanAlt'),
          category: t('transferVan'),
          title: t('transferVanName'),
          features: [
            t('transferVanF1'),
            t('transferVanF2'),
            t('transferVanF3'),
          ],
          price: "$250",
          pricePrefix: t('startingFrom'),
          titleSize: "sm",
          grayscale: "20",
        },
      ],
    },
  };

  const section = sectionData[activeTab];

  return (
    <section
      id="destinations"
      className="relative py-32 px-6 overflow-hidden bg-[var(--surface-section)]"
    >

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-[var(--destinations-divider)] pb-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary font-semibold uppercase tracking-[0.24em] text-[10px] mb-6">
              {section.label}
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-7xl font-serif text-[var(--destinations-title)] leading-[0.95] tracking-tight">
              {section.heading}
              <br />
              <span className="italic text-[var(--destinations-body)]">{section.subheading}</span>
            </h3>
          </div>
          <a
            href="#"
            className="group self-start md:self-auto text-[var(--destinations-title)] font-semibold flex items-center gap-3 hover:text-primary transition-all uppercase tracking-[0.2em] text-xs font-sans border border-[var(--destinations-card-border)] px-5 py-3 rounded-full hover:border-primary/60 hover:bg-primary/5"
          >
            {section.linkText}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.cards.map((card) => (
            <DestinationCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
