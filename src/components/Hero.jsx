import React from 'react';
import ConcessionPass from './ConcessionPass';

/**
 * Hero section:
 * - High-impact cinematic presentation adapted for both Dark and Light modes
 * - Headline: "YOUR PASS. YOUR JOURNEY."
 * - Primary action: "GET YOUR PASS" (opens multi-step application)
 * - Secondary action: "VERIFY PASS" (navigates to verification scanner)
 * - Popular route chip & fintech micro-ledger metrics
 * - Hosts the interactive 3D Concession Pass alongside the hero content
 */
export default function Hero({ onOpenApply, onGoVerify, studentData }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)] pt-6" id="hero-pass">
      {/* LEFT COLUMN: Content Hierarchy */}
      <div className="lg:col-span-6 space-y-6">
        {/* Sub-tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#0D1118]/90 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-label-caps font-label-caps text-slate-700 dark:text-slate-200 tracking-wider font-semibold">
            YAATHRI — Student Concession Pass • ONE PASS • A BRIGHTER JOURNEY
          </span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-headline-lg-mobile md:text-display-lg font-display-lg text-slate-900 dark:text-white tracking-tight">
          ONE PASS.
          <br />
          <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-amber-500 dark:from-sky-400 dark:via-teal-300 dark:to-amber-400 bg-clip-text text-transparent">
            A BRIGHTER JOURNEY.
          </span>
        </h1>

        {/* Supporting fintech copy */}
        <p className="text-body-lg font-body-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
          <span className="font-semibold text-teal-600 dark:text-teal-400">PEOPLE • PLACES • PROGRESS.</span> One unified digital concession pass for smarter, simpler student travel across KSRTC ordinary &amp; fast passenger fleets, Kochi Metro Line 1, and regional Kerala student transit networks. Zero physical tokens. Instant QR verification.
        </p>

        {/* CTAs & Route Chip */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={onOpenApply}
              className="relative group overflow-hidden bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-8 h-[52px] rounded-full inline-flex items-center justify-center space-x-2.5 font-label-lg text-label-lg shadow-md hover:shadow-xl dark:hover:shadow-sky-500/25 active:scale-95 transition-all duration-200 cursor-pointer font-bold"
            >
              <span className="relative z-10">GET YOUR PASS</span>
              <span className="material-symbols-outlined text-[18px] relative z-10 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            </button>

            <button
              onClick={onGoVerify}
              className="bg-white/90 dark:bg-[#111722]/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-400 px-7 h-[52px] rounded-full inline-flex items-center justify-center space-x-2 font-label-lg text-label-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-95 transition-all duration-200 cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[18px] text-sky-500 dark:text-sky-400">verified_user</span>
              <span>VERIFY PASS</span>
            </button>
          </div>

          {/* Route Badge Chip */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100/90 dark:bg-[#111722]/80 border border-slate-200 dark:border-slate-800 text-body-sm font-body-sm text-slate-700 dark:text-slate-200">
            <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-label-caps font-label-caps font-bold">
              LINE K-04
            </span>
            <span className="font-medium">POPULAR ROUTE: THRISSUR ⇄ ERNAKULAM (Via Aluva &amp; Angamaly)</span>
            <span className="material-symbols-outlined text-[16px] text-emerald-500">check_circle</span>
          </div>
        </div>

        {/* Micro Ledger Metric Indicators */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-numeric-metric font-numeric-metric text-slate-900 dark:text-white">81.5%</div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Govt. Travel Subsidy
            </div>
          </div>
          <div>
            <div className="text-numeric-metric font-numeric-metric text-sky-600 dark:text-sky-400">₹12</div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Subsidy Daily Fare
            </div>
          </div>
          <div>
            <div className="text-numeric-metric font-numeric-metric text-emerald-600 dark:text-emerald-400">0.3s</div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Instant QR Access
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT / CENTER COLUMN — THE PREMIUM 3D CONCESSION PASS */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center">
        <ConcessionPass studentData={studentData} />
      </div>
    </section>
  );
}
