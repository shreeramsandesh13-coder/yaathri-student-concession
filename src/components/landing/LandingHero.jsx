import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ConcessionPass from '../ConcessionPass';
import { specimenStudentData } from '../../data/student';

/**
 * LANDING HERO — "ONE PASS. EVERY JOURNEY."
 * Minimal, impactful, editorial hero presentation.
 */
export default function LandingHero({ studentData }) {
  const displayData = studentData || specimenStudentData;

  return (
    <section className="relative w-full pt-6 sm:pt-12 pb-12 sm:pb-20 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Platform Statement & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-700 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KERALA STATE DIGITAL CONCESSION NETWORK</span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.06] uppercase">
              ONE PASS.
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600 dark:from-sky-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
                EVERY JOURNEY.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              A secure digital student concession platform connecting students, institutions and transport verification across KSRTC and Kochi Metro.
            </p>

            {/* Micro-metrics Telemetry */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto lg:mx-0 pt-1 pb-2">
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Verification</span>
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">0.3s</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">State Fleets</span>
                <span className="text-base sm:text-lg font-black text-sky-600 dark:text-sky-400">KSRTC + Metro</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-sm">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Subsidy Rate</span>
                <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">Up to 80%</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/student/apply" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
                  iconPosition="right"
                  className="w-full sm:w-auto shadow-lg dark:shadow-sky-500/20"
                >
                  Get Your Pass
                </Button>
              </Link>

              <Link to="/how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore YAATHRI
                </Button>
              </Link>
            </div>

          </div>

          {/* Right Column: 3D Concession Pass Interactive Centerpiece */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[360px] sm:max-w-[400px]">
              <ConcessionPass studentData={displayData} />
            </div>

            <span className="text-[11px] font-mono text-slate-400 mt-4 flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[14px]">touch_app</span>
              <span>Tap card to flip between credentials &amp; QR</span>
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}

