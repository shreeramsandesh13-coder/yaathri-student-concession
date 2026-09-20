import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import ConcessionPass from '../ConcessionPass';
import { specimenStudentData } from '../../data/student';

/**
 * DIGITAL PASS PREVIEW SECTION
 * Showcases the tamper-proof digital card and links to /verification.
 */
export default function DigitalPassPreview({ studentData }) {
  const displayData = studentData || specimenStudentData;

  return (
    <section className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Explanatory Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeader
              kicker="SMART TRAVEL CREDENTIAL"
              title="THE TAMPER-PROOF DIGITAL PASS."
              subtitle="Designed to replace fragile paper lamination. Powered by cryptographic security and single-use 90-second travel tokens."
            />

            {/* Spec Sheet Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Identity Ledger</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">College Verified</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Token Lifecycle</span>
                <span className="font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">90s Single Use</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Fleet Compatibility</span>
                <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">KSRTC &amp; Metro</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80">
                <span className="text-slate-400 block text-[10px] uppercase">Offline Mode</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">Cryptographic QR</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/verification">
                <Button
                  variant="primary"
                  size="md"
                  icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                  iconPosition="right"
                >
                  View How Verification Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Concession Pass */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-[360px] sm:max-w-[400px]">
              <ConcessionPass studentData={displayData} />
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-4 text-center">
              Interactive 3D Card &bull; Tap or click flip toggle to inspect QR tokens
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

