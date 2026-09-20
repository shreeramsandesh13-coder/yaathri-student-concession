import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * FINAL CTA SECTION
 * "READY FOR A BETTER JOURNEY?"
 * Direct call to action linking to /student/apply or /signup.
 */
export default function FinalCtaSection() {
  return (
    <section className="w-full py-20 sm:py-28 border-t border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-700 dark:text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>JOIN KERALA'S DIGITAL TRANSIT NETWORK</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[1.08]">
          READY FOR A
          <br />
          <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-300 bg-clip-text text-transparent">
            BETTER JOURNEY?
          </span>
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Zero paper queues. Instant conductor scanning. Subsidized student travel across KSRTC and Kochi Metro. Apply in 3 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/student/apply" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={<span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              iconPosition="right"
              className="w-full sm:w-auto shadow-xl dark:shadow-sky-500/25"
            >
              Get Your Pass
            </Button>
          </Link>

          <Link to="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Sign In to Existing Pass
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}

