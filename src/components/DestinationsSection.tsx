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
    label: "Curated Experiences",
    heading: "Iconic Destinations",
    subheading: "Told Through Luxury",
    linkText: "Explore All",
    cards: [
      {
        image: "/images/hurghada.jpg",
        alt: "Hurghada Coastline",
        category: "Red Sea Luxury",
        title: "Hurghada",
        description:
          "Crystal clear waters and private yacht charters among vibrant coral reefs.",
        price: "$299",
        grayscale: "30",
      },
      {
        image: "/images/marsa-alam.jpg",
        alt: "Diving in Marsa Alam",
        category: "Nature & Serenity",
        title: "Marsa Alam",
        description:
          "Untouched marine life and exclusive eco-luxury resorts for the ultimate escape.",
        price: "$450",
        grayscale: "30",
      },
      {
        image: "/images/cairo.jpg",
        alt: "Cairo Skyline and Nile",
        category: "Historic Grandeur",
        title: "Cairo & Giza",
        description:
          "Private access to ancient wonders and world-class fine dining in the heart of history.",
        price: "$1,200",
        grayscale: "30",
      },
    ],
  },
  hotels: {
    label: "Curated Stays",
    heading: "Top Luxury Hotels",
    subheading: "Unmatched Elegance",
    linkText: "View All Hotels",
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
    label: "Executive Fleet",
    heading: "Premium Transfer Services",
    subheading: "Seamless Travel",
    linkText: "View All Vehicles",
    cards: [
      {
        image: "/images/vehicle-limousine.jpg",
        alt: "Luxury Private Limousine Sedan",
        category: "First Class Sedan",
        title: "Luxury Private Limousine",
        features: [
          "Professional Chauffeur",
          "Complimentary High-Speed Wi-Fi",
          "Premium Refreshments",
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
          "4x4 Desert Capability",
          "Ample Luggage Capacity",
          "Advanced Climate Control",
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
          "Reclining Leather Seats",
          "Private On-board Meeting Space",
          "Concierge Boarding Service",
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

  return (
    <section id="destinations" className="py-32 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-b border-slate-800 pb-8">
        <div className="max-w-2xl">
          <h2 className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 font-sans">
            {section.label}
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif text-white leading-none">
            {section.heading}{" "}
            <br />
            <span className="italic text-slate-500">{section.subheading}</span>
          </h3>
        </div>
        <a
          href="#"
          className="group text-white font-medium flex items-center gap-3 hover:text-primary transition-all uppercase tracking-widest text-xs font-sans"
        >
          {section.linkText}{" "}
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
    </section>
  );
}
