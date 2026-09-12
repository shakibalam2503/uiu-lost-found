import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ProblemSection from "../components/ProblemSection";
import SolutionSection from "../components/SolutionSection";
import HowItWorksSection from "../components/HowItWorksSection";
import FaqSection from "../components/FaqSection";
import CtaSection from "../components/CtaSection";
import Footer from "../components/Footer";

export const LandingPage = () => {
  // SEO document title and meta tag updates
  useEffect(() => {
    document.title = "UIU Lost & Found - Official Campus Portal";
  }, []);

  return (
    <div className="landing-container">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
