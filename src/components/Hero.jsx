import React from 'react';
import ConcessionPass from './ConcessionPass';
import Button from './ui/Button';

/**
 * Fullscreen Cinematic Hero Component
 * - Large typography: "THE DIGITAL PASS FOR EVERY JOURNEY."
 * - Clear platform narrative connecting students, institutions, operators, and authorities.
 * - Primary CTA: "Get Your Pass", Secondary CTA: "Explore YAATHRI"
 * - Hosts the interactive 3D Concession Pass object with specimen fallback
 */
export default function Hero({ onOpenApply, onGoExplore, studentData }) {
  const handleExplore = () => {
    if (onGoExplore) {
      onGoExplore();
    } else {
      const el = document.getElementById('transport-ecosystem');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-5rem)] flex items-center py-8 sm:py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
        
        {/* Left Editorial Narrative Column */}
        <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
          
          {/* Official Sub-tag Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#0D121F]/90 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-200 uppercase">
              YAATHRI &bull; Student Mobility Platform
            </span>
          </div>

          {/* Large Hero Headline */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08] uppercase">
              THE DIGITAL PASS
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-amber-500 dark:from-sky-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
                FOR EVERY JOURNEY.
              </span>
            </h1>
          </div>

          {/* Clear Supporting Platform Description */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl">
            YAATHRI is Kerala's unified digital student concession platform connecting students, institutions, public bus fleets (KSRTC), Kochi Metro Line 1, and the Motor Vehicles Department under one cryptographically verified identity.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenApply}
              icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              iconPosition="right"
              className="shadow-lg hover:shadow-xl dark:shadow-sky-500/20 w-full sm:w-auto"
            >
              Get Your Pass
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleExplore}
              icon={<span className="material-symbols-outlined text-[20px] text-sky-500">explore</span>}
              className="w-full sm:w-auto"
            >
              Explore YAATHRI
            </Button>
          </div>

          {/* Route Micro-Badge Chip */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-slate-100/90 dark:bg-[#111722]/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-bold shrink-0">
                LINE K-04
              </span>
              <span className="font-medium text-[11px] sm:text-xs truncate">
                THRISSUR &harr; ERNAKULAM (Via Aluva &amp; Angamaly)
              </span>
              <span className="material-symbols-outlined text-[16px] text-emerald-500 shrink-0">verified</span>
            </div>
          </div>

          {/* Micro Metrics Strip */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">81.5%</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Govt. Subsidy
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 font-mono">₹12</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Daily Fare
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">0.3s</div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                Turnstile Gate
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Digital Concession Pass Column */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative select-none">
          <div className="w-full flex justify-center">
            <ConcessionPass studentData={studentData} />
          </div>
          <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-3 text-center">
            Interactive 3D Identity Object &bull; Hover or Tap to Flip
          </p>
        </div>

      </div>
    </section>
  );
}
