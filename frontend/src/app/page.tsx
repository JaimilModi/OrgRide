import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TwoChoices from "@/components/landing/TwoChoices";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyOrgRide from "@/components/landing/WhyOrgRide";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TwoChoices />
        <HowItWorks />
        <WhyOrgRide />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
