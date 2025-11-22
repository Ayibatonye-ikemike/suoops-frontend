"use client";

import { useState } from "react";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import {
  PreLaunchBanner,
  Navigation,
  WaitlistCounter,
  CTASection,
  Footer,
  VideoModal,
} from "@/components/landing/layout";

/**
 * Landing Page - Main entry point
 * 
 * Follows SRP: Each section extracted to focused component
 * Follows DRY: Shared pricing constants in src/constants/pricing.ts
 * Follows <400 LOC limit: Orchestrator pattern with component composition
 */
export default function HomePage() {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="min-h-screen bg-brand-evergreen">
      <PreLaunchBanner />
      <Navigation />
      <Hero onWatchDemo={() => setShowVideoModal(true)} />
      <WaitlistCounter />
      <Features />
      <Pricing />
      <CTASection />
      <Footer />
      <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />
    </div>
  );
}
