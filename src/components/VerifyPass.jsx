import React, { useState } from 'react';
import { verificationDatabase } from '../data/student';
import { api } from '../services/api';

/**
 * VerifyPass component:
 * - RTO Concession Audit Engine simulation
 * - Tabs: SCAN QR SIMULATOR vs ENTER PASS ID
 * - Laser scan line animation
 * - Connected to SQLite live backend verification and audit logging
 * - Supports ACTIVE, EXPIRED, and INVALID pass outcomes
 * - Fully adapted for Light and Dark themes
 */
export default function VerifyPass() {
  const [activeMode, setActiveMode] = useState('qr'); // 'qr' | 'id'
  const [passInput, setPassInput] = useState('SCP-2026-00124');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState(
    verificationDatabase['SCP-2026-00124']
  );
  const [searchedKey, setSearchedKey] = useState('SCP-2026-00124');

  const handleRunVerify = async (overrideId) => {
    const idToSearch = (overrideId || passInput || '').trim();
    setIsScanning(true);
    setSearchedKey(idToSearch);

    try {
      const res = await api.qr.verify(idToSearch);
      const isVerified = res.status === 'VERIFIED';
      setVerificationResult({
        status: isVerified ? 'ACTIVE' : res.status,
        passId: res.pass_number || idToSearch,
        statusCode: res.status_code,
        student: res.student_name || 'Unknown Student',
        college: res.college || 'Government Recognized Institution',
        route: res.route || 'Kerala Transit Corridor',
        rate: res.subsidy_rate || '80% Subsidized Concession',
        validUntil: res.valid_until || 'May 2027',
        hashIntegrity: res.hash_integrity || 'SHA-256 Valid',
        message: res.message,
      });
    } catch (err) {
      console.warn('Backend QR verify fallback to local database:', err);
      const found = verificationDatabase[idToSearch];
      if (found) {
        setVerificationResult(found);
      } else {
        setVerificationResult({
          status: 'INVALID',
          passId: idToSearch || 'UNKNOWN',
          statusCode: '404 NOT FOUND',
          student: 'Unknown Record',
          message: 'No active student concession registered under this ID in Kerala RTO registry.',
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (mode === 'qr') {
      setPassInput('SCP-2026-00124');
      handleRunVerify('SCP-2026-00124');
    } else {
      setPassInput('KL-08-CCE-9941');
    }
  };

  return (
    <section
      className="bg-white/80 dark:bg-[#0D1118]/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm space-y-8"
      id="verify-section"
    >
      <div className="max-w-2xl">
        <div className="flex items-center space-x-2">
          <span className="text-label-caps font-label-caps text-sky-600 dark:text-sky-400 uppercase tracking-widest font-semibold">
            RTO CONCESSION AUDIT ENGINE
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-mono">
            PROTOTYPE SIMULATION
          </span>
        </div>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-slate-900 dark:text-white mt-1">
          YAATHRI — Student Concession Pass Verification
        </h2>
        <p className="text-body-md font-body-md text-slate-500 dark:text-slate-400 mt-2">
          Simulate an onboard conductor scan or transit turnstile terminal. ONE PASS • A BRIGHTER JOURNEY — Validates cryptographic credentials against the Kerala RTO node.
        </p>
      </div>

      {/* Verification Interactive Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Tab & Input Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-[#111722] rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleModeChange('qr')}
              className={`px-5 py-2 rounded-lg text-label-md font-label-md font-bold transition-all ${
                activeMode === 'qr'
                  ? 'bg-white dark:bg-[#161F2E] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              SCAN QR SIMULATOR
            </button>
            <button
              onClick={() => handleModeChange('id')}
              className={`px-5 py-2 rounded-lg text-label-md font-label-md font-bold transition-all ${
                activeMode === 'id'
                  ? 'bg-white dark:bg-[#161F2E] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ENTER PASS ID
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-label-md font-label-md text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                Concession Pass ID / Token Code
              </label>
              <div className="relative">
                <span className="material-symbols-outlined text-[20px] text-slate-400 absolute left-4 top-1/2 -translate-y-1/2">
                  badge
                </span>
                <input
                  type="text"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunVerify()}
                  placeholder="e.g. SCP-2026-00124"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-body-md font-body-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>
            </div>

            {/* Preset Test Case Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                Quick Test Codes:
              </span>
              <button
                type="button"
                onClick={() => {
                  setPassInput('SCP-2026-00124');
                  handleRunVerify('SCP-2026-00124');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition-colors"
              >
                SCP-2026-00124 (Active)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassInput('SCP-2024-EXP01');
                  handleRunVerify('SCP-2024-EXP01');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-mono font-medium hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors"
              >
                SCP-2024-EXP01 (Expired)
              </button>
              <button
                type="button"
                onClick={() => {
                  setPassInput('INVALID-999');
                  handleRunVerify('INVALID-999');
                }}
                className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-mono font-medium hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
              >
                INVALID-999 (Error)
              </button>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <button
                onClick={() => handleRunVerify()}
                disabled={isScanning}
                className="bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-8 h-[50px] rounded-full inline-flex items-center justify-center space-x-2 font-label-lg text-label-lg hover:shadow-lg dark:hover:shadow-sky-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-75 font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                <span>{isScanning ? 'SCANNING TOKEN...' : 'RUN VERIFICATION'}</span>
              </button>

              {isScanning && (
                <span className="text-body-sm font-body-sm text-sky-600 dark:text-sky-400 flex items-center space-x-1.5 animate-pulse">
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Querying RTO Kerala Node...</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Scanner Viewport & Live Certificate Output */}
        <div className="lg:col-span-6">
          <div className="relative bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 overflow-hidden shadow-2xl min-h-[300px] flex flex-col justify-between">
            {/* Dynamic Laser Scan Line */}
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_#38bdf8] z-20 animate-laser" />
            )}

            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isScanning
                      ? 'bg-yellow-400 animate-ping'
                      : verificationResult?.status === 'ACTIVE'
                      ? 'bg-emerald-400'
                      : verificationResult?.status === 'EXPIRED'
                      ? 'bg-amber-400'
                      : 'bg-red-500'
                  }`}
                />
                <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                  KERALA RTO AUDIT CONSOLE // v4.2
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">SSL 256-BIT ENCRYPTED</span>
            </div>

            {/* Terminal Body */}
            <div className={`py-4 space-y-3 transition-opacity duration-300 ${isScanning ? 'opacity-30' : 'opacity-100'}`}>
              {/* ACTIVE STATUS */}
              {verificationResult?.status === 'ACTIVE' && (
                <>
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="material-symbols-outlined text-[22px]">verified</span>
                    </div>
                    <div>
                      <div className="text-label-caps font-label-caps text-emerald-400 uppercase tracking-wider font-bold">
                        ✓ STATE CERTIFICATE VERIFIED
                      </div>
                      <h4 className="text-headline-sm font-headline-sm font-bold text-white">
                        {verificationResult.student}
                      </h4>
                      <p className="text-[12px] text-slate-400">{verificationResult.college}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono">
                    <div>
                      <span className="text-slate-500 block text-[9px]">APPROVED ROUTE</span>
                      <span className="text-slate-200">{verificationResult.route}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">CONCESSION RATE</span>
                      <span className="text-emerald-300">{verificationResult.rate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">VALIDITY WINDOW</span>
                      <span className="text-slate-200">{verificationResult.validUntil}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">HASH INTEGRITY</span>
                      <span className="text-cyan-400">{verificationResult.hashIntegrity}</span>
                    </div>
                  </div>
                </>
              )}

              {/* EXPIRED STATUS */}
              {verificationResult?.status === 'EXPIRED' && (
                <>
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-amber-950 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="material-symbols-outlined text-[22px]">history</span>
                    </div>
                    <div>
                      <div className="text-label-caps font-label-caps text-amber-400 uppercase tracking-wider font-bold">
                        ⚠ PASS EXPIRED
                      </div>
                      <h4 className="text-headline-sm font-headline-sm font-bold text-white">
                        {verificationResult.student}
                      </h4>
                      <p className="text-[12px] text-slate-400">{verificationResult.college}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-amber-950/30 p-3.5 rounded-xl border border-amber-900/50 font-mono">
                    <div>
                      <span className="text-amber-500/80 block text-[9px]">PASS ID</span>
                      <span className="text-slate-200">{verificationResult.passId}</span>
                    </div>
                    <div>
                      <span className="text-amber-500/80 block text-[9px]">EXPIRED ON</span>
                      <span className="text-amber-300 font-bold">{verificationResult.validUntil}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-amber-500/80 block text-[9px]">NOTICE</span>
                      <span className="text-slate-300">
                        Renewal required for academic year re-endorsement.
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* INVALID STATUS */}
              {verificationResult?.status === 'INVALID' && (
                <>
                  <div className="flex items-start space-x-3.5">
                    <div className="w-11 h-11 rounded-full bg-red-950 border border-red-500/40 text-red-400 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="material-symbols-outlined text-[22px]">cancel</span>
                    </div>
                    <div>
                      <div className="text-label-caps font-label-caps text-red-400 uppercase tracking-wider font-bold">
                        ✗ INVALID PASS CREDENTIAL
                      </div>
                      <h4 className="text-headline-sm font-headline-sm font-bold text-white">
                        Record Not Found
                      </h4>
                      <p className="text-[12px] text-slate-400">
                        Token "{searchedKey}" is not registered in the system.
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-950/30 p-3.5 rounded-xl border border-red-900/50 font-mono text-[11px] text-slate-300">
                    <span className="text-red-400 block text-[9px] font-bold">ERROR TELEMETRY</span>
                    Cryptographic signature mismatch. Ensure student barcode or ID is typed correctly.
                  </div>
                </>
              )}
            </div>

            {/* Terminal Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>DEVICE AUTHENTICATED: TERMINAL-KL-RTO-TCR</span>
              <span
                className={
                  verificationResult?.status === 'ACTIVE'
                    ? 'text-emerald-400'
                    : verificationResult?.status === 'EXPIRED'
                    ? 'text-amber-400'
                    : 'text-red-400'
                }
              >
                STATUS: {verificationResult?.statusCode || '200 OK'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
