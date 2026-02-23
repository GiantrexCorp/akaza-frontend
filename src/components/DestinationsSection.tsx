import { ArrowRight } from "lucide-react";
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

const sectionData: Record<TabId, SectionConfig> = {
  excursions: {
    label: "Core Destination Focus",
    heading: "Egypt Signature Journeys",
    subheading: "curated with operational precision",
    linkText: "Explore All Journeys",
    cards: [
      {
        image: "/images/hurghada.jpg",
        alt: "Hurghada Coastline",
        category: "Red Sea Luxury",
        title: "Hurghada",
        description:
          "Red Sea programs with private handling, sea experiences, and seamless day planning.",
        price: "$299",
        grayscale: "30",
      },
      {
        image: "/images/marsa-alam.jpg",
        alt: "Diving in Marsa Alam",
        category: "Nature & Serenity",
        title: "Marsa Alam",
        description:
          "Nature-first coastal escapes planned for comfort, privacy, and smooth movement.",
        price: "$450",
        grayscale: "30",
      },
      {
        image: "/images/cairo.jpg",
        alt: "Cairo Skyline and Nile",
        category: "Historic Grandeur",
        title: "Cairo & Giza",
        description:
          "Cultural depth with trusted local experts, premium logistics, and clear execution.",
        price: "$1,200",
        grayscale: "30",
      },
    ],
  },
  hotels: {
    label: "Handpicked Premium Stays",
    heading: "Hotels Aligned To Intent",
    subheading: "quality, location, reliability",
    linkText: "View All Stays",
    cards: [
      {
        image: "/images/hotel-four-seasons.jpg",
        alt: "Four Seasons Resort Sharm El Sheikh Luxury Pool",
        category: "Sharm El Sheikh",
        title: "Four Seasons Resort Sharm El Sheikh",
        description:
          "Experience a hillside sanctuary with panoramic Red Sea views, featuring private beaches and world-class diving.",
        price: "$420",
        titleSize: "sm",
        grayscale: "20",
      },
      {
        image: "/images/hotel-marriott.jpg",
        alt: "Marriott Mena House Cairo Pyramid View Terrace",
        category: "Cairo & Giza",
        title: "Marriott Mena House Cairo",
        description:
          "Wake up to breathtaking views of the Great Pyramids from this historic palace nestled in 40 acres of lush gardens.",
        price: "$380",
        titleSize: "sm",
        grayscale: "20",
      },
      {
        image: "/images/hotel-steigenberger.jpg",
        alt: "Steigenberger Al Dau Beach Hotel Luxury Resort Grounds",
        category: "Hurghada",
        title: "Steigenberger Al Dau Beach",
        description:
          "A haven of luxury featuring an expansive lazy river, private beach, and impeccable service along the Red Sea coast.",
        price: "$265",
        titleSize: "sm",
        grayscale: "20",
      },
    ],
  },
  transfers: {
    label: "Trusted Mobility Network",
    heading: "Premium Transfer Services",
    subheading: "private, reliable, human-led",
    linkText: "View All Vehicles",
    cards: [
      {
        image: "/images/vehicle-limousine.jpg",
        alt: "Luxury Private Limousine Sedan",
        category: "First Class Sedan",
        title: "Luxury Private Limousine",
        features: [
          "Professional Chauffeur",
          "Coordinated Arrival Handling",
          "Concierge Support on Request",
        ],
        price: "$120",
        pricePrefix: "starting from",
        titleSize: "sm",
        grayscale: "20",
      },
      {
        image: "/images/vehicle-suv.jpg",
        alt: "Premium SUV Luxury Travel",
        category: "All-Terrain Luxury",
        title: "Premium SUV",
        features: [
          "Priority Pick-up Reliability",
          "Ample Luggage Capacity",
          "Executive Comfort Standards",
        ],
        price: "$180",
        pricePrefix: "starting from",
        titleSize: "sm",
        grayscale: "20",
      },
      {
        image: "/images/vehicle-van.jpg",
        alt: "VIP Executive Van Interior",
        category: "Group Excellence",
        title: "VIP Executive Van",
        features: [
          "Group Transfer Coordination",
          "Flexible Multi-stop Routing",
          "Human Oversight at Every Stage",
        ],
        price: "$250",
        pricePrefix: "starting from",
        titleSize: "sm",
        grayscale: "20",
      },
    ],
  },
};

interface DestinationsSectionProps {
  activeTab: TabId;
}

export default function DestinationsSection({
  activeTab,
}: DestinationsSectionProps) {
  const section = sectionData[activeTab];
  const sectionGradient =
    "linear-gradient(180deg, rgba(27,58,66,0.16) 0%, rgba(185,117,50,0.14) 34%, rgba(0,0,0,0) 72%)";

  return (
    <section
      id="destinations"
      className="relative py-32 px-6 overflow-hidden bg-[#04141b]"
      style={{ backgroundImage: sectionGradient }}
    >

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-white/10 pb-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary font-semibold uppercase tracking-[0.24em] text-[10px] mb-6">
              {section.label}
            </span>
            <h3 className="text-4xl md:text-7xl font-serif text-white leading-[0.95] tracking-tight">
              {section.heading}
              <br />
              <span className="italic text-[#688E99]">{section.subheading}</span>
            </h3>
          </div>
          <a
            href="#"
            className="group self-start md:self-auto text-white/85 font-semibold flex items-center gap-3 hover:text-primary transition-all uppercase tracking-[0.2em] text-xs font-sans border border-white/15 px-5 py-3 rounded-full hover:border-primary/60 hover:bg-primary/5"
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
