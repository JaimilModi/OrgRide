import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import CommuteMockup from "@/components/landing/CommuteMockup";
import HowItWorks from "@/components/landing/HowItWorks";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";
import "./landing.css";

export default function LandingPage() {
  return (
    <div className="orgride-light-landing min-h-screen overflow-x-hidden relative font-sans">
      
      {/* Main Content Layers */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <CommuteMockup />
          <HowItWorks />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </div>
  );
}
