import React, { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';

/**
 * WHY YAATHRI SECTION
 * Visual transformation comparing traditional friction vs modern digital flow.
 */
export default function WhyYaathriSection() {
  const [activeMode, setActiveMode] = useState('yaathri'); // 'old' | 'yaathri'

  const comparisonPoints = [
    {
      label: 'Application Process',
      old: 'Purchase physical paper concession forms, manual handwriting, stamp fees',
      yaathri: '3-minute online digital application from any smartphone or browser',
      icon: 'description',
    },
    {
      label: 'Identity & Photos',
      old: 'Multiple passport photos, attested photocopies, physical ink seals',
      yaathri: 'Verified digital enrollment sync with college institutional registry',
      icon: 'badge',
    },
    {
      label: 'Approval Timeline',
      old: '3 to 4 weeks of inter-office paper routing between college & depot',
      yaathri: 'Instant institutional desk review with under 24-hour turnaround',
      icon: 'schedule',
    },
    {
      label: 'Pass Durability',
      old: 'Fragile paper card laminated with plastic; tears or degrades in monsoon',
      yaathri: 'Tamper-proof digital 3D pass stored securely on phone wallet',
      icon: 'credit_card',
    },
    {
      label: 'Transit Verification',
      old: 'Manual visual inspection causing conductor disputes and boarding queues',
      yaathri: '0.3-second cryptographic QR verification on buses and metro turnstiles',
      icon: 'qr_code_scanner',
    },
  ];

  return (
    <section className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            kicker="THE MOBILITY PARADIGM SHIFT"
            title="WHY YAATHRI WAS BUILT."
            subtitle="Paper-based student concessions have caused administrative friction for decades. Here is how YAATHRI transforms the journey."
          />

          {/* Interactive Mode Toggle */}
          <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveMode('old')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'old'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Old Paper Process
            </button>
            <button
              onClick={() => setActiveMode('yaathri')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'yaathri'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              YAATHRI Digital Pass
            </button>
          </div>
        </div>

        {/* Visual Transformation Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left: Traditional Paper Card (Faded when YAATHRI is active) */}
          <div
            onClick={() => setActiveMode('old')}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer space-y-6 ${
              activeMode === 'old'
                ? 'bg-rose-50/80 dark:bg-rose-950/20 border-rose-500/50 shadow-xl'
                : 'bg-slate-50 dark:bg-[#0B111D] border-slate-200/80 dark:border-slate-800/80 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">history_edu</span>
                </div>
                <div>
                  <Badge variant="danger" size="sm">LEGACY SYSTEM</Badge>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    Traditional Paper Concession
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-rose-500 font-bold">3–4 WEEKS</span>
            </div>

            <div className="space-y-4">
              {comparisonPoints.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0 mt-0.5">
                    close
                  </span>
                  <div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 block">{item.label}</span>
                    <span className="text-slate-500 dark:text-slate-400 mt-0.5 block">{item.old}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: YAATHRI Digital Platform (Elevated) */}
          <div
            onClick={() => setActiveMode('yaathri')}
            className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 cursor-pointer space-y-6 ${
              activeMode === 'yaathri'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-500/50 shadow-xl shadow-emerald-500/5'
                : 'bg-slate-50 dark:bg-[#0B111D] border-slate-200/80 dark:border-slate-800/80 opacity-60 hover:opacity-100'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">bolt</span>
                </div>
                <div>
                  <Badge variant="success" size="sm" dot>YAATHRI NETWORK</Badge>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                    Unified Digital Mobility Pass
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-500 font-bold">0.3s SCAN</span>
            </div>

            <div className="space-y-4">
              {comparisonPoints.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 text-xs">
                  <span className="material-symbols-outlined text-[18px] text-emerald-500 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.label}</span>
                    <span className="text-emerald-700 dark:text-emerald-300/90 mt-0.5 block font-medium">{item.yaathri}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

