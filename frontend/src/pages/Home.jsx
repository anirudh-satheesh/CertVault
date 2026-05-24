import React from 'react';
import { LandingNavbar } from '../components/home/LandingNavbar';
import { HeroSection } from '../components/home/HeroSection';
import { FeatureGrid } from '../components/home/FeatureGrid';
import { WorkflowSection } from '../components/home/WorkflowSection';
import { Footer } from '../components/home/Footer';

export const Home = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <LandingNavbar />

      <main className="pt-14 space-y-20 sm:space-y-32">
        <HeroSection />

        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FeatureGrid />
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <WorkflowSection />
        </section>
      </main>

      <Footer />
    </div>
  );
};
