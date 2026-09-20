import React from 'react';
import LandingHero from '../components/landing/LandingHero';
import PortalSwitcherBanner from '../components/PortalSwitcherBanner';
import WhyYaathriSection from '../components/landing/WhyYaathriSection';
import HowItWorksPreview from '../components/landing/HowItWorksPreview';
import DigitalPassPreview from '../components/landing/DigitalPassPreview';
import TransportEcosystemPreview from '../components/landing/TransportEcosystemPreview';
import RoutePreview from '../components/landing/RoutePreview';
import FinalCtaSection from '../components/landing/FinalCtaSection';
import { specimenStudentData } from '../data/student';

/**
 * HOME PAGE (/)
 * Editorial landing page presenting the core YAATHRI narrative and leading into dedicated product pages.
 */
export default function HomePage({ studentData, onSelectPortal }) {
  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20">
      {/* 1. Hero Statement */}
      <LandingHero studentData={studentData || specimenStudentData} />

      {/* 2. Portal Switcher Hub (Quick Role Exploration) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortalSwitcherBanner onSelectPortal={onSelectPortal} />
      </div>

      {/* 3. Why YAATHRI (Old Paper Process -> Digital Transformation) */}
      <WhyYaathriSection />

      {/* 4. How It Works Preview (Links to /how-it-works) */}
      <HowItWorksPreview />

      {/* 5. Digital Pass Presentation (Links to /verification) */}
      <DigitalPassPreview studentData={studentData || specimenStudentData} />

      {/* 6. Transport Ecosystem Preview (Links to /transport) */}
      <TransportEcosystemPreview />

      {/* 7. Real Route Intelligence Preview (Links to /routes) */}
      <RoutePreview />

      {/* 8. Final CTA */}
      <FinalCtaSection />
    </div>
  );
}

