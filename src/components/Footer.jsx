import React from 'react';
import YaathriLogo from './YaathriLogo';

/**
 * Footer component:
 * - Official branding & portal attribution
 * - Regulatory compliance & emergency helpline
 * - Clean fintech footer adapted for Light and Dark themes
 */
export default function Footer({ onOpenApply, onGoVerify, onGoPass }) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#070A10]/90 backdrop-blur-md pt-12 pb-24 md:pb-12 text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <YaathriLogo variant="full" />
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-700 dark:text-slate-300">
                v2.0
              </span>
            </div>
            <p className="text-xs font-bold tracking-widest text-teal-600 dark:text-teal-400 uppercase">
              ONE PASS • A BRIGHTER JOURNEY
            </p>
            <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400 max-w-sm">
              PEOPLE • PLACES • PROGRESS — Unified digital student concession mobility platform. Integrated with Kerala State Road Transport Corporation (KSRTC) and Kochi Metro Rail Limited (KMRL).
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400 pt-1">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>RTO KERALA NODE • 256-BIT ENCRYPTED</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-label-caps font-label-caps uppercase text-slate-900 dark:text-white tracking-wider font-bold">
              Pass Services
            </div>
            <ul className="space-y-1.5 text-body-sm font-body-sm">
              <li>
                <button
                  onClick={onOpenApply}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                >
                  Apply For Pass
                </button>
              </li>
              <li>
                <button
                  onClick={onGoPass}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                >
                  View 3D Digital Card
                </button>
              </li>
              <li>
                <button
                  onClick={onGoVerify}
                  className="hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                >
                  Verify Concession
                </button>
              </li>
              <li>
                <span className="text-slate-400 dark:text-slate-600">Semester Renewal</span>
              </li>
            </ul>
          </div>

          {/* Institutional Support */}
          <div className="space-y-2">
            <div className="text-label-caps font-label-caps uppercase text-slate-900 dark:text-white tracking-wider font-bold">
              Support &amp; Helpline
            </div>
            <div className="space-y-1 text-xs">
              <div className="text-slate-900 dark:text-white font-semibold">Toll-Free Concession Desk:</div>
              <div className="font-mono text-sky-600 dark:text-sky-400 text-sm font-bold">1800-425-5372</div>
              <div className="text-slate-400 dark:text-slate-500 pt-1">Mon – Sat: 08:00 AM – 06:00 PM</div>
              <div className="text-slate-400 dark:text-slate-500">support@transit.kerala.gov.in</div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} Government of Kerala Motor Vehicles Department &amp; Higher Education Council.
          </div>
          <div className="font-mono text-[11px] text-slate-400 dark:text-slate-600">
            SECURE AUDIT HASH: KL-08-CCE-9941-X9
          </div>
        </div>
      </div>
    </footer>
  );
}
