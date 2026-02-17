import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeContent from "@/components/HomeContent";
import VIPServices from "@/components/VIPServices";
import OfficeSection from "@/components/OfficeSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HomeContent />
      <VIPServices />
      <OfficeSection />
      <Footer />
    </>
  );
}
