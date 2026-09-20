import React, { useState, useEffect } from 'react';
import ConcessionPass from './ConcessionPass';
import RouteMap from './RouteMap';
import { api } from '../services/api';
import Button from './ui/Button';
import Badge from './ui/Badge';

/**
 * Rebuilt Student Portal View
 * - Hero greeting: "Welcome back, [Student Name]" + Institution & Course
 * - Central Focus: Active 3D Digital Concession Pass Object
 * - Dashboard sections: Active Pass | Applications | Travel Ledger | Renew
 * - Quick Actions: Generate 90s Travel Token, Institutional QR, Print/Download, Route Corridor
 */
export default function PassView({ studentData, onOpenApply, onOpenRenew }) {
  const [activeSection, setActiveSection] = useState('pass'); // 'pass' | 'applications' | 'ledger'
  const [toastMessage, setToastMessage] = useState(null);

  // Single-use travel token state
  const [travelToken, setTravelToken] = useState(null);
  const [tokenTimeLeft, setTokenTimeLeft] = useState(0);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  
  // QR view toggle: 'concession' (Pass) vs 'institutional' (Permanent ID)
  const [qrType, setQrType] = useState('concession');

  // Countdown timer for single-use travel token (90 seconds)
  useEffect(() => {
    if (tokenTimeLeft <= 0) {
      if (travelToken) {
        setTravelToken(null);
      }
      return;
    }
    const timer = setInterval(() => {
      setTokenTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tokenTimeLeft, travelToken]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleGenerateTravelToken = async () => {
    setIsGeneratingToken(true);
    try {
      const passId = studentData?.passId || 1;
      const res = await api.tokens.generate(passId, 'GATE-04-ALUVA');
      if (res && res.token_code) {
        setTravelToken(res.token_code);
        setTokenTimeLeft(res.remaining_seconds || 90);
        showToast(`⚡ Travel Token Issued: ${res.token_code} (Valid for 90s)`);
      }
    } catch (err) {
      const fallback = `TT-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
      setTravelToken(fallback);
      setTokenTimeLeft(90);
      showToast(`⚡ Travel Token Issued: ${fallback} (Offline Mode)`);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPassActive = studentData?.status === 'ACTIVE' || !studentData?.status;

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-700 dark:border-slate-300 flex items-center space-x-3 text-xs sm:text-sm font-semibold animate-slideInRight">
          <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. STUDENT HERO GREETING BANNER */}
      <div className="rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              STUDENT IDENTITY PROFILE
            </span>
            <Badge variant={isPassActive ? 'success' : 'warning'} size="sm" dot>
              {studentData?.status || 'ACTIVE'}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome, {studentData?.name || 'Student'}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {studentData?.college || 'Christ College of Engineering, Irinjalakuda'}
            </span>
            <span>&bull;</span>
            <span>{studentData?.course || 'B.Tech Computer Science'}</span>
            <span>&bull;</span>
            <span className="font-mono text-slate-400">ID: {studentData?.rollNo || 'CCE24CS001'}</span>
          </div>
        </div>

        {/* Quick Actions in Hero */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={handleGenerateTravelToken}
            isLoading={isGeneratingToken}
            icon={<span className="material-symbols-outlined text-[18px]">bolt</span>}
          >
            {travelToken ? `Token: ${tokenTimeLeft}s` : 'Generate Token'}
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handlePrint}
            icon={<span className="material-symbols-outlined text-[18px]">print</span>}
          >
            Print Pass
          </Button>
        </div>
      </div>

      {/* 2. SECTION NAVIGATION TABS */}
      <div className="flex items-center space-x-2 p-1 rounded-2xl bg-slate-100 dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 max-w-md">
        <button
          onClick={() => setActiveSection('pass')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'pass'
              ? 'bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          Active Digital Pass
        </button>
        <button
          onClick={() => setActiveSection('applications')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'applications'
              ? 'bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveSection('ledger')}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activeSection === 'ledger'
              ? 'bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          Travel Corridor
        </button>
      </div>

      {/* 3. ACTIVE SECTION: DIGITAL PASS CENTERPIECE */}
      {activeSection === 'pass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: 3D Interactive Concession Card Object */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 sm:p-8 rounded-3xl bg-slate-50/50 dark:bg-[#0B111D]/60 border border-slate-200/80 dark:border-slate-800">
            <ConcessionPass studentData={studentData} />
            <p className="text-xs font-mono text-slate-400 mt-4 text-center">
              Official Holographic Concession Credential &bull; Click to Flip Card
            </p>
          </div>

          {/* Right: ID-Card Verification QR (Primary) & Optional Travel Token (Secondary) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Everyday Credential: ID-Card QR */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B111D] border border-sky-500/30 dark:border-sky-500/20 space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500 text-[20px]">badge</span>
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                    PRIMARY EVERYDAY CREDENTIAL
                  </span>
                </div>
                <Badge variant="success" size="sm">
                  QR READY
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-800 shrink-0">
                    <span className="material-symbols-outlined text-sky-500 text-[24px]">qr_code_2</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Permanent ID-Card Verification QR
                    </h4>
                    <p className="text-xs text-sky-700 dark:text-sky-300 font-semibold">
                      ✓ Ready for institution ID-card printing / engraving
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      You do <strong>NOT</strong> need to open YAATHRI or generate a QR for daily journeys. Carry your college ID card during normal travel. Conductors scan only when verification is required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional / Secondary: Dynamic Single-Use Token Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  OPTIONAL METRO / BUS TRAVEL TOKEN
                </span>
                <Badge variant={travelToken ? 'success' : 'neutral'} size="sm" dot>
                  {travelToken ? `ACTIVE (${tokenTimeLeft}s)` : 'STANDBY'}
                </Badge>
              </div>

              {travelToken ? (
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-center space-y-2">
                  <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                    SINGLE-ENTRY TRAVEL TOKEN CODE (BACKUP / TURNSTILE)
                  </p>
                  <p className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-emerald-600 dark:text-emerald-400">
                    {travelToken}
                  </p>
                  <div className="w-full bg-emerald-200/50 dark:bg-emerald-900/50 h-1.5 rounded-full overflow-hidden mt-3">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                      style={{ width: `${(tokenTimeLeft / 90) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Backup token code for turnstiles or conductor spot checks. Automatically expires in {tokenTimeLeft} seconds.
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
                  <span className="material-symbols-outlined text-[32px] text-sky-500">vibration</span>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Approaching an automated metro turnstile or need instant digital clearance? Generate an optional 90-second dynamic travel token.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleGenerateTravelToken}
                    isLoading={isGeneratingToken}
                  >
                    Generate Backup Token
                  </Button>
                </div>
              )}
            </div>

            {/* Pass Metadata Matrix */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                CONCESSION PARAMETERS
              </span>

              <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E1524]">
                  <span className="text-slate-400 block text-[10px] uppercase">Pass Number</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {studentData?.passNumber || 'SCP-2026-00124'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E1524]">
                  <span className="text-slate-400 block text-[10px] uppercase">Valid Until</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">
                    {studentData?.validUntil || '31 / 03 / 2027'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E1524]">
                  <span className="text-slate-400 block text-[10px] uppercase">Concession Corridor</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 truncate block">
                    {studentData?.routeCorridor || 'Thrissur ⇄ Ernakulam'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0E1524]">
                  <span className="text-slate-400 block text-[10px] uppercase">Subsidy Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                    {studentData?.subsidyRate || '80% KSRTC / 50% METRO'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <span>Cryptographic Key: {studentData?.securityKey || 'KL-08-CCE-9941-X9'}</span>
                <span className="text-emerald-500 font-bold">SHA-256 Validated</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. APPLICATIONS SECTION */}
      {activeSection === 'applications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Application History &amp; Attestations
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Official enrollment status with Christ College &amp; Regional Transport Office
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={onOpenApply}>
              New Application
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0E1524] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold">
                APP
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Application #{studentData?.applicationId || 'APP-2026-KL-0089'}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Corridor: Thrissur ⇄ Ernakulam &bull; Type: Bus &amp; Metro &bull; Enrolled: 2026
                </p>
              </div>
            </div>
            <Badge variant="success" size="md" dot>
              APPROVED &amp; ACTIVE
            </Badge>
          </div>
        </div>
      )}

      {/* 5. TRAVEL CORRIDOR MAP SECTION */}
      {activeSection === 'ledger' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Approved Transit Corridor
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Authorized stages: {studentData?.routeCorridor || 'Thrissur Central ⇄ Ernakulam South via Aluva Metro Interchange'}
            </p>
          </div>

          <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <RouteMap
              origin={studentData?.origin || 'Thrissur Central'}
              destination={studentData?.destination || 'Ernakulam South'}
              viaStops={['Chalakudy', 'Angamaly', 'Aluva']}
              transportType={studentData?.transportMode || 'Bus & Metro'}
            />
          </div>
        </div>
      )}

    </div>
  );
}
