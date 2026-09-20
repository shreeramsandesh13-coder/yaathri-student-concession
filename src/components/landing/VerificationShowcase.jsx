import React from 'react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';

/**
 * QR Verification Showcase - Conductor & Turnstile Attendant Experience
 * SCAN QR -> VERIFY -> PASS VALID (0.3s)
 */
export default function VerificationShowcase() {
  return (
    <section id="verification-showcase" className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        <SectionHeader
          kicker="HIGH-SPEED FIELD VERIFICATION"
          title="0.3-SECOND VERIFICATION AT ANY TURNSTILE OR DEPOT."
          subtitle="Designed for transit conductors and metro gate attendants. Fast, secure, cryptographic QR verification working both online and offline."
        />

        {/* 3-Step Verification Experience Visual Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          
          {/* STEP 1: SCAN QR */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="info" size="sm">STEP 01</Badge>
              <span className="text-xs font-mono text-slate-400">SCAN QR</span>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-24 h-24 border-2 border-dashed border-sky-500/80 rounded-2xl flex items-center justify-center relative">
                <span className="material-symbols-outlined text-[36px] text-sky-500">qr_code_scanner</span>
                {/* Simulated laser scan line */}
                <div className="absolute inset-x-0 h-0.5 bg-sky-500 shadow-[0_0_8px_#0ea5e9] animate-bounce top-1/2" />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-3 uppercase tracking-wider">
                Align Dynamic Travel Token
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Conductor Device Scan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Conductors use their authorized mobile terminal camera to capture the student's dynamic 90-second QR or permanent institutional ID.
              </p>
            </div>
          </div>

          {/* STEP 2: VERIFY */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="warning" size="sm">STEP 02</Badge>
              <span className="text-xs font-mono text-slate-400">CRYPTOGRAPHIC CHECK</span>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center justify-center relative font-mono text-xs text-slate-500 space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">vpn_key</span>
              </div>
              <div className="text-[11px] text-center space-y-1">
                <p className="text-slate-800 dark:text-slate-200 font-bold">SHA-256 HMAC Signature Match</p>
                <p className="text-[10px] text-slate-400">Hash: KL-08-CCE-9941-X9 &bull; Matched</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Zero-Latency Cryptography
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The terminal decodes the payload, validates token single-use freshness, and matches the digital signature against the institutional registry.
              </p>
            </div>
          </div>

          {/* STEP 3: PASS VALID */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-emerald-500/30 dark:border-emerald-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <Badge variant="success" size="sm">STEP 03</Badge>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">PASS VALID</span>
            </div>

            <div className="w-full aspect-video rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-mono">
                  AUTHORIZED FOR TRAVEL
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fare Subsidy: 80% KSRTC &bull; 50% Metro
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                Instant Turnstile Clearance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Conductor gets immediate visual confirmation with student photo, corridor allocation, and pass validity. Zero delays. Zero paperwork.
              </p>
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800">
            <span className="material-symbols-outlined text-sky-500 text-[24px] shrink-0">speed</span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">0.3s Scan Latency</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Engineered for rush hour metro gates and heavy passenger bus stops.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800">
            <span className="material-symbols-outlined text-emerald-500 text-[24px] shrink-0">offline_bolt</span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Offline Terminal Cache</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Works in remote transit routes and underground metro stations with spotty connectivity.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-white dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800">
            <span className="material-symbols-outlined text-amber-500 text-[24px] shrink-0">lock</span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Single-Use Security</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dynamic travel tokens expire in 90 seconds, preventing pass sharing or duplicate claims.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

