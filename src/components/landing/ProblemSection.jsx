import React from 'react';
import SectionHeader from '../ui/SectionHeader';

/**
 * The Problem Section - Visual Storytelling of Traditional Concession Inefficiencies
 */
export default function ProblemSection() {
  const problems = [
    {
      icon: 'description',
      num: '01',
      title: 'Physical Paper Forms',
      description:
        'Students forced to purchase physical paper concession forms, obtain multiple physical seal stamps, and stand in manual queue counters.',
    },
    {
      icon: 'schedule',
      num: '02',
      title: '3–4 Week Approval Delay',
      description:
        'Manual inter-office transit between colleges, transport depots, and regional offices creates weeks of bureaucratic waiting periods.',
    },
    {
      icon: 'credit_card_off',
      num: '03',
      title: 'Fragile Paper Lamination',
      description:
        'Physical paper passes tear, get lost, degrade under monsoon rain, or get forged without verifiable cryptographic authenticity.',
    },
    {
      icon: 'warning',
      num: '04',
      title: 'Friction at Turnstiles & Buses',
      description:
        'Conductors and gate attendants cannot verify pass authenticity in real time, leading to disputes, fare loss, and transit bottlenecks.',
    },
  ];

  return (
    <section id="problem-section" className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        <SectionHeader
          kicker="THE TRADITIONAL FRICTION"
          title="PAPER-BASED CONCESSIONS ARE BROKEN."
          subtitle="Before YAATHRI, obtaining a student transit pass required manual bureaucracy, paper applications, physical photo stamps, and weeks of approval delays."
        />

        {/* Visual Problem Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((prob) => (
            <div
              key={prob.num}
              className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">{prob.icon}</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                  {prob.num}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {prob.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {prob.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition callout */}
        <div className="max-w-2xl mx-auto text-center pt-4">
          <p className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            YAATHRI replaces this entire friction with instant digital verification &darr;
          </p>
        </div>

      </div>
    </section>
  );
}

