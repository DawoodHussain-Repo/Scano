"use client";

import LandingHero from "./components/LandingHero";
import FeaturesSection from "./components/FeaturesSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingHero />
      <FeaturesSection />
    </main>
  );
}
