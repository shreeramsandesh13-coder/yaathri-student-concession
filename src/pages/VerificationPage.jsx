import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, User, Camera, QrCode } from 'lucide-react';

/**
 * VERIFICATION PAGE (/verification)
 * Explains the 0.3s field verification workflow, opaque QR token cryptography,
 * and showcases an interactive realistic scanner simulator.
 */
export default function VerificationPage() {
  const [simulatedVerdict, setSimulatedVerdict] = useState('valid'); // 'valid' | 'invalid'

  const sampleStudent = {
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    name: 'Ananya Ramesh',
    institution: 'Christ College of Engineering, Irinjalakuda',
    studentId: 'CCE24CS042',
    passId: 'SCP-2026-00124',
    route: 'Thrissur Central ⇄ Ernakulam South',
    validity: '01 JUN 2026 → 31 MAR 2027',
    subsidy: '81.5% KSRTC Concession',
    status: 'ACTIVE PASS',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="success" size="sm">0.3-SECOND FIELD VERIFICATION</Badge>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          HOW VERIFICATION WORKS.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          The physical institution ID card is the student's everyday credential. Unique YAATHRI Verification QR is printed or engraved on the card. Conductor scans only when verification is required for spot checks or concession validation.
        </p>
      </div>

      {/* 6-Step Verification Progression Flow */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-8">
        <SectionHeader
          kicker="VERIFICATION WORKFLOW"
          title="FROM ID-CARD TO INSTANT CLEARANCE."
          subtitle="A realistic spot-check inspection pipeline that never requires opening an app for every journey."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Carries ID Card', desc: 'Permanent QR on college ID card' },
            { step: '02', title: 'Normal Travel', desc: 'No daily app opening or QR generation' },
            { step: '03', title: 'Spot Check Only', desc: 'Conductor scans only when required' },
            { step: '04', title: 'Opaque Query', desc: 'Secure backend lookup by ID' },
            { step: '05', title: 'Route Checked', desc: 'Corridor & concession validity verified' },
            { step: '06', title: 'Instant Verdict', desc: 'VALID clearance or INVALID rejection' },
          ].map((s) => (
            <div key={s.step} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">{s.step}</span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Simulator: Scanner Viewfinder & Result Card */}
      <div className="p-6 sm:p-12 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div>
            <Badge variant="neutral" size="sm">INTERACTIVE SIMULATION</Badge>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Field Terminal Scanner Simulation
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Toggle between valid clearance and invalid pass rejections
            </p>
          </div>

          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center shrink-0">
            <button
              onClick={() => setSimulatedVerdict('valid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simulatedVerdict === 'valid'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Simulate Valid Pass
            </button>
            <button
              onClick={() => setSimulatedVerdict('invalid')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simulatedVerdict === 'invalid'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Simulate Invalid Pass
            </button>
          </div>
        </div>

        {/* Verdict Card Presentation */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
            simulatedVerdict === 'valid'
              ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-xl'
              : 'bg-rose-500/5 dark:bg-rose-950/20 border-rose-500/40 shadow-xl'
          }`}
        >
          {simulatedVerdict === 'valid' ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <Badge variant="success" size="sm">VALID CONCESSION</Badge>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      Authorized for Boarding
                    </h4>
                  </div>
                </div>
                <span className="font-mono text-xs text-slate-500">HTTP 200 &bull; 280ms</span>
              </div>

              {/* Verified Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-emerald-500/20">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-emerald-500/40 shadow-md shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <img src={sampleStudent.photo} alt={sampleStudent.name} className="w-full h-full object-cover" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full">
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Passenger Name</span>
                    <span className="font-black text-slate-900 dark:text-white text-base block mt-0.5">{sampleStudent.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Pass Serial ID</span>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400 block mt-0.5">{sampleStudent.passId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Institution</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{sampleStudent.institution}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Student Roll</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 block mt-0.5">{sampleStudent.studentId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Authorized Route</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{sampleStudent.route}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Pass Validity</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 block mt-0.5">{sampleStudent.validity}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <Badge variant="danger" size="sm">VERIFICATION REJECTED</Badge>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      Pass Invalid / Expired
                    </h4>
                  </div>
                </div>
                <span className="font-mono text-xs text-rose-500 font-bold">REJECT_403</span>
              </div>

              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Failure Reason: Concession pass expired on 31 MAR 2025</span>
                </div>
                <p className="text-[11px] text-rose-600/90 dark:text-rose-300/80">
                  The scanned QR token corresponds to an inactive academic period. Passenger must apply for annual renewal via the student portal.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cryptography & Privacy Architecture */}
      <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 space-y-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy-Preserving QR Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 block text-sm">01 &bull; Opaque Identifier</span>
            <p>
              The QR code does NOT contain unencrypted student names, phone numbers, or addresses. It contains an ephemeral opaque token cryptographically verified against the server.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 block text-sm">02 &bull; Single-Use 90s Tokens</span>
            <p>
              Travel tokens automatically expire after 90 seconds. Screenshots cannot be shared, cloned, or forwarded to non-eligible passengers.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400 block text-sm">03 &bull; Tamper-Proof Audit</span>
            <p>
              Every inspection is logged with the inspecting conductor's badge ID, bus registration number, and timestamp for state transport accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Next Step Transition Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Explore the Multimodal Transit Network
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Discover how KSRTC bus fleets, Kochi Metro rail, academic institutions, and transport regulators operate together.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/transport">
            <Button variant="primary" size="md">
              Explore Transport Ecosystem &rarr;
            </Button>
          </Link>
          <Link to="/verifier">
            <Button variant="outline" size="md" icon={<Camera className="w-4 h-4" />}>
              Open Conductor Scanner
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

