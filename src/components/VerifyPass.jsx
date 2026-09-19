import React, { useState } from 'react';
import { verificationDatabase } from '../data/student';
import { api } from '../services/api';

/**
 * VerifyPass component:
 * - Comprehensive Conductor & Transit Auditor Inspection Terminal
 * - Modes: LIVE OPTICAL SCANNER SIMULATOR vs MANUAL ID / TOKEN ENTRY
 * - Supports:
 *   1. Permanent Institutional QR ("YAATHRI-ID:...")
 *   2. Single-Use Travel Token ("TT-...") with server-enforced ALREADY_USED check
 *   3. Digital Concession Pass ("SCP-...")
 * - Conductor Anti-Sharing Visual Identity Panel (Student Photo, Roll, Institution)
 * - Clear verdict banners (VERIFIED, ALREADY_USED, EXPIRED, SUSPENDED, INVALID)
 * - Fully adapted for Light and Dark themes
 */
export default function VerifyPass() {
  const [activeMode, setActiveMode] = useState('qr'); // 'qr' | 'id'
  const [passInput, setPassInput] = useState('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012');
  const [isScanning, setIsScanning] = useState(false);
  const [searchedKey, setSearchedKey] = useState('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012');
  
  // Terminal state
  const [verificationResult, setVerificationResult] = useState({
    status: 'ACTIVE',
    isValid: true,
    passId: 'SCP-2026-00124',
    tokenType: 'INSTITUTIONAL_QR',
    statusCode: '200 OK',
    student: 'Shreeram Sandesh',
    rollNumber: 'CCE24CS001',
    studentIdNumber: 'STU-2024-8841',
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxIOtGgfZ1xzAMTLlUAwHX9CcdtIFuDQY4RTI4qWrBjRHW7uru56nH1vurIQKUsbkhbp-43R4ptwoUlode-NXOPgdADsjJybp_UaGdHLFxWPnmoMH-XpFW0AFvy2WBXFqfUqy5lpAsux4nvmvXgvwmzOmC59WAiMH5jxkxMKC_07AlcPSWEnmfW1V637TgWonkvOAuFsu4p9zIfPSF5aJ5iD2ebYMtCGNnsy5CqNYrvksyIuTg39TU',
    college: 'Christ College of Engineering, Irinjalakuda',
    route: 'Thrissur Central ⇄ Ernakulam South',
    rate: '80% KSRTC / 50% METRO',
    validUntil: '31 / 03 / 2027',
    hashIntegrity: 'SHA-256 Valid',
    message: 'Permanent Institutional ID authenticated. Active concession pass verified against Kerala RTO node.',
  });

  const handleRunVerify = async (overrideId) => {
    const idToSearch = (overrideId || passInput || '').trim();
    if (!idToSearch) return;

    setIsScanning(true);
    setSearchedKey(idToSearch);

    try {
      const res = await api.qr.verify(idToSearch, 'CONDUCTOR-HANDHELD-KL-15', 'KSRTC Fast Passenger #12');
      const isVerified = res.status === 'VERIFIED';

      setVerificationResult({
        status: isVerified ? 'ACTIVE' : res.status,
        isValid: res.is_valid,
        passId: res.pass_number || idToSearch,
        tokenType: res.token_type || (idToSearch.startsWith('TT-') ? 'TRAVEL_TOKEN' : idToSearch.startsWith('YAATHRI-ID:') ? 'INSTITUTIONAL_QR' : 'CONCESSION_PASS'),
        statusCode: res.status_code || (isVerified ? '200 OK' : '400 ERROR'),
        student: res.student_name || 'Unknown Student',
        rollNumber: res.roll_number || 'CCE24CS001',
        studentIdNumber: res.student_id_number || 'STU-2024-8841',
        photoUrl: res.student_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
        college: res.college || 'Government Recognized Institution',
        route: res.route || 'Kerala Transit Corridor',
        rate: res.subsidy_rate || '80% Subsidized Concession',
        validUntil: res.valid_until || '31 / 03 / 2027',
        hashIntegrity: 'SHA-256 Verified',
        failureReason: res.failure_reason,
        message: res.message,
      });
    } catch (err) {
      console.warn('Backend verification fallback:', err);
      const fallback = verificationDatabase[idToSearch];
      if (fallback) {
        setVerificationResult({
          ...fallback,
          isValid: fallback.status === 'ACTIVE',
          tokenType: 'CONCESSION_PASS',
        });
      } else {
        setVerificationResult({
          status: 'INVALID',
          isValid: false,
          passId: idToSearch,
          tokenType: idToSearch.startsWith('TT-') ? 'TRAVEL_TOKEN' : idToSearch.startsWith('YAATHRI-ID:') ? 'INSTITUTIONAL_QR' : 'CONCESSION_PASS',
          statusCode: '404 NOT FOUND',
          student: 'Record Not Found',
          failureReason: 'UNREGISTERED CREDENTIAL: No matching record found in Kerala RTO registry.',
          message: 'No active student concession registered under this ID.',
        });
      }
    } finally {
      setTimeout(() => {
        setIsScanning(false);
      }, 500);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (mode === 'qr') {
      setPassInput('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012');
      handleRunVerify('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012');
    } else {
      setPassInput('SCP-2026-00124');
    }
  };

  return (
    <section
      className="bg-white/80 dark:bg-[#0D1118]/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-10 shadow-sm space-y-8"
      id="verify-section"
    >
      <div className="max-w-3xl">
        <div className="flex items-center space-x-2">
          <span className="text-label-caps font-label-caps text-sky-600 dark:text-sky-400 uppercase tracking-widest font-semibold">
            RTO CONCESSION AUDIT ENGINE // INSPECTOR PORTAL
          </span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded font-mono">
            ● ONLINE NODE
          </span>
        </div>
        <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-slate-900 dark:text-white mt-1">
          YAATHRI — Student Concession Pass Verification
        </h2>
        <p className="text-body-md font-body-md text-slate-500 dark:text-slate-400 mt-2">
          Conductor Handheld &amp; Turnstile Audit Console. Validates Permanent Institutional QR, Single-Use Travel Tokens, and Concession Pass Barcodes with anti-sharing visual identity matching.
        </p>
      </div>

      {/* Main Grid: Controls / Scanner vs Result Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Scanner & Input Controls */}
        <div className="lg:col-span-6 space-y-6">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-[#111722] rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => handleModeChange('qr')}
              className={`px-5 py-2 rounded-lg text-label-md font-label-md font-bold transition-all cursor-pointer ${
                activeMode === 'qr'
                  ? 'bg-white dark:bg-[#161F2E] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              SCANNER CAMERA
            </button>
            <button
              onClick={() => handleModeChange('id')}
              className={`px-5 py-2 rounded-lg text-label-md font-label-md font-bold transition-all cursor-pointer ${
                activeMode === 'id'
                  ? 'bg-white dark:bg-[#161F2E] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              MANUAL PASS / TOKEN
            </button>
          </div>

          {/* Mode A: Optical Scanner Viewfinder Simulation */}
          {activeMode === 'qr' && (
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[220px]">
              {/* Animated Laser Scan Line */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_#38bdf8] z-20 animate-laser" />
              )}

              {/* Targeting Reticle */}
              <div className="w-44 h-44 border-2 border-dashed border-sky-500/70 rounded-2xl relative flex items-center justify-center bg-sky-950/20">
                {/* Corner Accents */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-sky-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-sky-400" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-sky-400" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-sky-400" />

                <span className="material-symbols-outlined text-[48px] text-sky-400/80 animate-pulse">
                  qr_code_scanner
                </span>
              </div>

              <span className="text-[11px] font-mono text-slate-400 mt-4">
                Align student QR code within viewfinder
              </span>
            </div>
          )}

          {/* Mode B: Manual Input or Code Entry */}
          <div className="space-y-4">
            <div>
              <label className="block text-label-md font-label-md text-slate-700 dark:text-slate-300 mb-1.5 font-medium">
                QR Payload / Token Code / Pass ID
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
                  placeholder="e.g. YAATHRI-ID:... or TT-... or SCP-2026-00124"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-body-md font-body-md text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-xs"
                />
              </div>
            </div>

            {/* Quick Test Case Buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Quick Verification Test Cases:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const id = 'YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012';
                    setPassInput(id);
                    handleRunVerify(id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 text-xs font-mono font-medium hover:bg-teal-200 cursor-pointer transition-colors"
                >
                  Permanent ID (Shreeram)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = 'SCP-2026-00124';
                    setPassInput(id);
                    handleRunVerify(id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium hover:bg-emerald-200 cursor-pointer transition-colors"
                >
                  SCP-2026-00124 (Active Pass)
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    // Generate a live travel token for test
                    try {
                      const res = await api.tokens.generate(1, 'GATE-04-ALUVA');
                      if (res && res.token_code) {
                        setPassInput(res.token_code);
                        handleRunVerify(res.token_code);
                      }
                    } catch {
                      const demo = 'TT-DEMO-TEST';
                      setPassInput(demo);
                      handleRunVerify(demo);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-mono font-medium hover:bg-sky-200 cursor-pointer transition-colors"
                >
                  + Generate Travel Token
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = 'SCP-2025-00088';
                    setPassInput(id);
                    handleRunVerify(id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-mono font-medium hover:bg-amber-200 cursor-pointer transition-colors"
                >
                  SCP-2025-00088 (Expired)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const id = 'INVALID-QR-999';
                    setPassInput(id);
                    handleRunVerify(id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/70 text-red-800 dark:text-red-300 text-xs font-mono font-medium hover:bg-red-200 cursor-pointer transition-colors"
                >
                  INVALID-QR-999
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => handleRunVerify()}
                disabled={isScanning}
                className="bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-8 h-[48px] rounded-full inline-flex items-center justify-center space-x-2 font-label-lg text-label-lg hover:shadow-lg dark:hover:shadow-sky-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-75 font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                <span>{isScanning ? 'AUTHENTICATING...' : 'RUN VERIFICATION'}</span>
              </button>

              {isScanning && (
                <span className="text-xs text-sky-600 dark:text-sky-400 flex items-center space-x-1.5 animate-pulse font-mono">
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  <span>Connecting to Kerala RTO node...</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Conductor Audit Viewport & Anti-Sharing Visual Inspection */}
        <div className="lg:col-span-6">
          <div className="relative bg-slate-950 rounded-3xl p-6 text-white border border-slate-800 overflow-hidden shadow-2xl space-y-4">
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
                      : 'bg-rose-500'
                  }`}
                />
                <span className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                  KERALA RTO AUDIT CONSOLE // TERMINAL-KL-15
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400">SSL 256-BIT ENCRYPTED</span>
            </div>

            {/* Verdict Banner */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                verificationResult?.status === 'ACTIVE'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : verificationResult?.status === 'ALREADY_USED'
                  ? 'bg-rose-950/50 border-rose-500/50 text-rose-300'
                  : verificationResult?.status === 'EXPIRED'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : 'bg-rose-950/50 border-rose-500/50 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    verificationResult?.status === 'ACTIVE'
                      ? 'bg-emerald-900/60 border-emerald-400 text-emerald-400'
                      : verificationResult?.status === 'ALREADY_USED'
                      ? 'bg-rose-900/60 border-rose-400 text-rose-400'
                      : verificationResult?.status === 'EXPIRED'
                      ? 'bg-amber-900/60 border-amber-400 text-amber-400'
                      : 'bg-rose-900/60 border-rose-400 text-rose-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {verificationResult?.status === 'ACTIVE'
                      ? 'verified'
                      : verificationResult?.status === 'ALREADY_USED'
                      ? 'sync_problem'
                      : verificationResult?.status === 'EXPIRED'
                      ? 'history'
                      : 'cancel'}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest font-black">
                    {verificationResult?.status === 'ACTIVE'
                      ? '✓ PASS VALID & ACTIVE'
                      : verificationResult?.status === 'ALREADY_USED'
                      ? '✗ TRAVEL TOKEN ALREADY USED'
                      : verificationResult?.status === 'EXPIRED'
                      ? '⚠ PASS EXPIRED'
                      : '✗ INVALID PASS CREDENTIAL'}
                  </div>
                  <p className="text-xs text-slate-300 font-sans mt-0.5">
                    {verificationResult?.failureReason || verificationResult?.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Anti-Sharing Visual Inspection Panel (Displays Student Photo) */}
            {verificationResult?.student && verificationResult.student !== 'Record Not Found' && (
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <span className="material-symbols-outlined text-[14px]">face</span>
                    <span>Anti-Sharing Visual Cross-Check</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    MATCH PASSENGER PHOTO
                  </span>
                </div>

                <div className="flex items-start space-x-4">
                  {/* Large Student Photograph */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-800 shrink-0 shadow-md">
                    <img
                      src={verificationResult.photoUrl}
                      alt={verificationResult.student}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop';
                      }}
                    />
                  </div>

                  {/* Student Ledger */}
                  <div className="space-y-1 text-xs font-mono flex-1">
                    <div className="font-bold text-white text-sm font-sans">
                      {verificationResult.student}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {verificationResult.rollNumber} • {verificationResult.studentIdNumber || 'STU-2024-8841'}
                    </div>
                    <div className="text-slate-300 text-[11px] truncate">
                      {verificationResult.college}
                    </div>
                    <div className="text-emerald-400 text-[11px] pt-1">
                      {verificationResult.rate}
                    </div>
                  </div>
                </div>

                {/* Commute Corridor & Validity Ledger */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-950/70 p-3 rounded-xl border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">APPROVED CORRIDOR</span>
                    <span className="text-slate-200 truncate block">{verificationResult.route}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">VALID UNTIL</span>
                    <span className="text-sky-400">{verificationResult.validUntil}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">TOKEN TYPE</span>
                    <span className="text-teal-400">{verificationResult.tokenType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">SECURITY KEY</span>
                    <span className="text-slate-300">{verificationResult.passId}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terminal Footer */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>DEVICE AUTHENTICATED: CONDUCTOR-HANDHELD-KL-15</span>
              <span
                className={
                  verificationResult?.status === 'ACTIVE'
                    ? 'text-emerald-400'
                    : verificationResult?.status === 'EXPIRED'
                    ? 'text-amber-400'
                    : 'text-rose-400'
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
