import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import DestinationsSection from "@/components/DestinationsSection";
import VIPServices from "@/components/VIPServices";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchWidget />
      <DestinationsSection />
      <VIPServices />
      <Footer />
    </>
  );
}
