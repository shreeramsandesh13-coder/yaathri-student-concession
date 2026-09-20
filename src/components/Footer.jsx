import React from 'react';
import { Link } from 'react-router-dom';
import YaathriLogo from './YaathriLogo';

/**
 * FOOTER COMPONENT
 * Editorial links connecting public information, guides, corridors, and role-specific portals.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#060B14] border-t border-slate-200/80 dark:border-slate-800/80 py-12 sm:py-16 text-slate-600 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-100 dark:border-slate-800/60">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <YaathriLogo variant="full" />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Unified Digital Student Concession Mobility Platform. One pass for connected transit across KSRTC bus fleets, Kochi Metro Line 1, and accredited Kerala educational institutions.
            </p>
            <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>KERALA MOTOR VEHICLES DEPARTMENT (MVD) &bull; KSRTC &bull; KMRL</span>
            </div>
          </div>

          {/* Product & Discovery Links */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-900 dark:text-white">
              Platform
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/transport" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Transport Ecosystem
                </Link>
              </li>
              <li>
                <Link to="/verification" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  0.3s Verification
                </Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Corridor Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  About YAATHRI
                </Link>
              </li>
            </ul>
          </div>

          {/* Dedicated Portals */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-900 dark:text-white">
              Portals
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/student" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Student Portal
                </Link>
              </li>
              <li>
                <Link to="/institution" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Institution Desk
                </Link>
              </li>
              <li>
                <Link to="/verifier" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Conductor Terminal
                </Link>
              </li>
              <li>
                <Link to="/rto" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  RTO Authority
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Security */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-mono font-bold tracking-widest uppercase text-slate-900 dark:text-white">
              Security &amp; Integrity
            </p>
            <p className="text-xs leading-relaxed text-slate-500">
              Passes are cryptographically signed with offline verification capability. QR codes contain opaque tokens with zero personal data leakage.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1.5">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>SHA-256 Token Encryption</span>
              </span>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} Government of Kerala. Transport Department Mobility Directorate. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300">Terms of Concession</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300">MVD Directorate</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
