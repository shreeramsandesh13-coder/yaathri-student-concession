import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';

/**
 * HOW IT WORKS PREVIEW
 * High-level 5-stage preview of the student journey with a CTA linking to /how-it-works.
 */
export default function HowItWorksPreview() {
  const steps = [
    { num: '01', title: 'APPLY', desc: 'Select transit route, upload college ID', icon: 'edit_note' },
    { num: '02', title: 'VERIFY', desc: 'College verifies attendance & enrollment', icon: 'verified_user' },
    { num: '03', title: 'APPROVE', desc: 'Principal & RTO approve subsidy tariff', icon: 'task_alt' },
    { num: '04', title: 'DIGITAL PASS', desc: '3D pass issued with encrypted tokens', icon: 'credit_card' },
    { num: '05', title: 'SCAN & TRAVEL', desc: '0.3s validation on bus and metro gates', icon: 'directions_transit' },
  ];

  return (
    <section className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            kicker="FRICTIONLESS LIFECYCLE"
            title="HOW YAATHRI WORKS."
            subtitle="From campus enrollment to bus and metro turnstiles in 5 seamless connected steps."
          />

          <Link to="/how-it-works" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              iconPosition="right"
            >
              Explore Full Guide
            </Button>
          </Link>
        </div>

        {/* 5-Step Connected Pipeline Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                  {step.num}
                </span>
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block text-slate-300 dark:text-slate-700 text-xs font-mono">
                  &rarr; Next Stage
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

