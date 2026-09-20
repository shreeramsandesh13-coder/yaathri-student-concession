import React from 'react';
import SectionHeader from '../ui/SectionHeader';

/**
 * The Solution Pipeline - Visual End-to-End Flow of YAATHRI
 * STUDENT -> APPLICATION -> INSTITUTION -> APPROVAL -> DIGITAL PASS -> QR VERIFICATION -> TRANSPORT
 */
export default function SolutionPipeline() {
  const steps = [
    {
      num: '01',
      title: 'STUDENT',
      desc: 'Enrolls online via YAATHRI student portal',
      icon: 'person',
      badge: 'Step 1',
    },
    {
      num: '02',
      title: 'APPLICATION',
      desc: 'Selects corridor, route stops & submits docs',
      icon: 'app_registration',
      badge: 'Step 2',
    },
    {
      num: '03',
      title: 'INSTITUTION',
      desc: 'College verifies student enrollment & attendance',
      icon: 'school',
      badge: 'Step 3',
    },
    {
      num: '04',
      title: 'APPROVAL',
      desc: 'Principal & RTO approve concession subsidy',
      icon: 'task_alt',
      badge: 'Step 4',
    },
    {
      num: '05',
      title: 'DIGITAL PASS',
      desc: 'Cryptographic pass issued with offline tokens',
      icon: 'credit_card',
      badge: 'Step 5',
    },
    {
      num: '06',
      title: 'QR VERIFICATION',
      desc: 'Conductor / Turnstile gate scans in 0.3s',
      icon: 'qr_code_scanner',
      badge: 'Step 6',
    },
    {
      num: '07',
      title: 'TRANSPORT',
      desc: 'Seamless student journey across KSRTC & Metro',
      icon: 'commute',
      badge: 'Step 7',
    },
  ];

  return (
    <section id="solution-pipeline" className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-[#070C16]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        <SectionHeader
          kicker="THE YAATHRI SOLUTION"
          title="ONE UNIFIED DIGITAL TRANSIT PIPELINE."
          subtitle="From campus enrollment to turnstile clearance in seven seamless cryptographic steps."
        />

        {/* Pipeline Progression Track */}
        <div className="relative">
          {/* Desktop connecting track line */}
          <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-sky-500 via-teal-500 to-amber-500 -translate-y-6 z-0 opacity-40" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="p-5 rounded-3xl bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-200 hover:-translate-y-1 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
                    {step.num}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center pt-2 text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

