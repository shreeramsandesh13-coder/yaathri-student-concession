import React, { useState } from 'react';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';

/**
 * Role Ecosystem Section - Highlighting the 4 Interconnected Stakeholders
 * Student, Institution, Conductor / Verifier, RTO / MVD
 */
export default function RoleEcosystem({ onSelectRole }) {
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);

  const roles = [
    {
      id: 'student',
      tabLabel: '01 STUDENT',
      title: 'Student Concession Portal',
      kicker: 'PASSENGER MOBILITY',
      description:
        'Students apply online in under 3 minutes, track institutional approval, generate 90-second single-use travel tokens, and carry a cryptographically signed digital pass anywhere on their phone.',
      features: [
        'Instant digital concession card with 3D tilt & flip',
        'Dynamic 90-second single-use travel tokens for turnstiles',
        'Direct institutional identity sync via enrollment registry',
        'Zero physical queues at depot or college counters',
      ],
      portalAction: 'student',
      color: 'text-emerald-500',
      bgGlow: 'from-emerald-500/10 via-transparent to-transparent',
    },
    {
      id: 'institution',
      tabLabel: '02 INSTITUTION',
      title: 'College & School Desk',
      kicker: 'ENROLLMENT VERIFICATION',
      description:
        'Principals, deans, and registrar clerks review incoming applications in real time, inspect uploaded identity proofs, verify semester attendance, and issue one-click pass attestations.',
      features: [
        'Unified application queue with pending/approved status filters',
        'Instant document and admission proof inspection drawer',
        'Route corridor and subsidy rate configuration',
        'Live student concession pass registry and expiry tracking',
      ],
      portalAction: 'admin',
      color: 'text-indigo-500',
      bgGlow: 'from-indigo-500/10 via-transparent to-transparent',
    },
    {
      id: 'verifier',
      tabLabel: '03 CONDUCTOR',
      title: 'Conductor & Gate Attendant Terminal',
      kicker: 'FIELD VERIFICATION',
      description:
        'KSRTC bus conductors and Kochi Metro gate attendants scan QR passes in 0.3 seconds using their handheld mobile cameras with instant offline verification.',
      features: [
        'Camera viewfinder with high-speed jsqr scanning engine',
        'Instant color-coded validation card with student photo',
        'Manual alphanumeric pass ID fallback input',
        'Live shift ledger recording all scans and vehicle codes',
      ],
      portalAction: 'verifier',
      color: 'text-amber-500',
      bgGlow: 'from-amber-500/10 via-transparent to-transparent',
    },
    {
      id: 'rto',
      tabLabel: '04 RTO / MVD',
      title: 'Motor Vehicles Department Authority',
      kicker: 'GOVERNANCE & AUDIT',
      description:
        'Kerala RTO officers oversee transit compliance across all transport operators, monitor active verifier devices, manage fleet corridors, and inspect live fraud-detection audit trails.',
      features: [
        'Statewide transit analytics and subsidy distribution metrics',
        'Verifier device directory with instant suspension authorization',
        'Transport operator fleet management (KSRTC & Metro)',
        'Immutable cryptographic audit ledger of every scanned pass',
      ],
      portalAction: 'rto',
      color: 'text-sky-500',
      bgGlow: 'from-sky-500/10 via-transparent to-transparent',
    },
  ];

  const activeRole = roles[activeRoleIndex];

  return (
    <section id="role-ecosystem" className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-[#080D17]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <SectionHeader
          kicker="STAKEHOLDER ARCHITECTURE"
          title="FOUR PORTALS. ONE CONNECTED ECOSYSTEM."
          subtitle="Engineered with role-based access control tailored for every member of Kerala's transit network."
        />

        {/* Role Tabs Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto p-1.5 rounded-full bg-slate-100 dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800">
          {roles.map((role, idx) => {
            const isCurrent = activeRoleIndex === idx;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRoleIndex(idx)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-mono font-bold transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {role.tabLabel}
              </button>
            );
          })}
        </div>

        {/* Active Role Showcase Card */}
        <div className="rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-10 lg:p-14 relative overflow-hidden transition-all duration-300">
          {/* Subtle Background Radial Glow */}
          <div className={`absolute top-0 right-0 w-96 h-96 bg-radial ${activeRole.bgGlow} pointer-events-none blur-3xl`} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Description Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />
                <span>{activeRole.kicker}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {activeRole.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeRole.description}
              </p>

              {/* Capabilities Checklist */}
              <div className="space-y-3 pt-2">
                {activeRole.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px] text-emerald-500 shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onSelectRole && onSelectRole(activeRole.portalAction)}
                  icon={<span className="material-symbols-outlined text-[18px]">launch</span>}
                  iconPosition="right"
                >
                  Access {activeRole.title.split(' ')[0]} Portal
                </Button>
              </div>
            </div>

            {/* Right Interactive Telemetry Preview Column */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="rounded-2xl bg-slate-50 dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <span className="text-xs font-mono text-slate-400 uppercase">PORTAL ENVIRONMENT</span>
                  <span className="text-xs font-mono font-bold text-emerald-500">LIVE READY</span>
                </div>

                <div className="space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                    <span>Target Users:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{activeRole.title}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                    <span>Authentication:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">JWT Bearer RBAC</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/40 dark:border-slate-800/40">
                    <span>Verification Time:</span>
                    <span className="text-sky-600 dark:text-sky-400 font-bold">&lt; 0.3 Seconds</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Audit Record:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Encrypted Ledger</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

