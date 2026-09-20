import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * HOW IT WORKS PAGE (/how-it-works)
 * Complete 8-stage interactive lifecycle with visual UI previews and detailed explanations.
 */
export default function HowItWorksPage() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages = [
    {
      num: '01',
      title: 'Student Registration',
      kicker: 'ACCOUNT CREATION',
      summary: 'Register with academic email and college enrollment credentials.',
      description:
        'Students create a YAATHRI account using their institution-issued email address or mobile phone. The system automatically cross-references the student ID format against accredited university formats in Kerala.',
      features: [
        'Instant mobile OTP or academic email verification',
        'Automatic institution and department lookup',
        'Secure password hashing & encrypted credentials',
      ],
      uiPreview: {
        badge: 'PORTAL VIEW',
        title: 'Student Registration Modal',
        mockup: (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-400">
              <span>POST /api/auth/register</span>
              <Badge variant="success" size="sm">200 OK</Badge>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300">
              name: "Ananya Ramesh"<br />
              email: "ananya.r@cce.edu.in"<br />
              roll_number: "CCE24CS042"<br />
              institution: "Christ College of Engineering"
            </div>
          </div>
        ),
      },
    },
    {
      num: '02',
      title: 'Apply for Concession',
      kicker: 'CORRIDOR SELECTION',
      summary: 'Select origin, destination stops, and transport fleet (KSRTC & Metro).',
      description:
        'Students define their daily commute route corridor. The interactive geographic engine calculates total travel distance in kilometers and determines eligible student concession percentages.',
      features: [
        'Gazetted bus and metro corridor dropdowns',
        'Interactive stage fare calculation',
        'Dual-fleet pass allocation (KSRTC bus + Kochi Metro rail)',
      ],
      uiPreview: {
        badge: 'ROUTING ENGINE',
        title: 'Corridor Allocation',
        mockup: (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Corridor K-04</span>
              <Badge variant="info" size="sm">72.4 KM</Badge>
            </div>
            <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
              <span>Thrissur Central</span>
              <span>&harr;</span>
              <span>Ernakulam South</span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold">
              <span className="text-slate-400 font-normal">State Subsidy:</span>
              <span className="text-emerald-500">81.5% Concession</span>
            </div>
          </div>
        ),
      },
    },
    {
      num: '03',
      title: 'Upload Documents',
      kicker: 'DIGITAL ATTESTATION',
      summary: 'Upload digital photo, college ID proof, and fee receipt.',
      description:
        'Zero physical paper photocopies required. Students upload clear smartphone photos or PDF scans of their college identity card, current semester fee slip, and Aadhaar residence proof.',
      features: [
        'Browser-side image compression and preview',
        'Secure encrypted storage with tamper-detection',
        'Instant verification format check',
      ],
      uiPreview: {
        badge: 'DOCUMENT VAULT',
        title: 'Document Submissions',
        mockup: (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-medium text-slate-700 dark:text-slate-300">college_id_card.jpg</span>
              <span className="text-emerald-500 text-[11px] font-bold">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <span className="font-medium text-slate-700 dark:text-slate-300">semester_fee_receipt.pdf</span>
              <span className="text-emerald-500 text-[11px] font-bold">VERIFIED</span>
            </div>
          </div>
        ),
      },
    },
    {
      num: '04',
      title: 'Institution Verification',
      kicker: 'CAMPUS AUDIT',
      summary: 'College desk officer reviews student enrollment and course standing.',
      description:
        'Principals, deans, or administrative registrars log in to the YAATHRI Institution Portal. They review the application queue in real-time, inspect uploaded identity documents in a slide-over drawer, and verify that the student meets attendance requirements.',
      features: [
        'One-click document drawer review',
        'Attendance percentage cross-check',
        'Batch approvals for semester intake',
      ],
      uiPreview: {
        badge: 'REGISTRAR DESK',
        title: 'Review Drawer',
        mockup: (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white">Reviewing APP-2026-0881</span>
              <Badge variant="warning" size="sm">PENDING</Badge>
            </div>
            <p className="text-slate-500 text-[11px]">B.Tech Computer Science &bull; 5th Semester</p>
            <div className="flex gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">Attested</span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500 font-bold text-[10px]">75%+ Attendance</span>
            </div>
          </div>
        ),
      },
    },
    {
      num: '05',
      title: 'Approval & Endorsement',
      kicker: 'AUTHORIZATION',
      summary: 'Institutional approval generates government subsidy entitlement.',
      description:
        'Upon institutional approval, the application status transitions to APPROVED. The state transport authority is notified, allocating the government concession quota and scheduling pass activation.',
      features: [
        'Instant digital cryptographic signature',
        'Automated notification to student mobile',
        'Rejection safeguard with explicit reviewer notes',
      ],
      uiPreview: {
        badge: 'STATE CLEARANCE',
        title: 'Approval Confirmation',
        mockup: (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Application Endorsed</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px]">
              Endorsement signed by Principal, Christ College of Engineering. Subsidy active.
            </p>
          </div>
        ),
      },
    },
    {
      num: '06',
      title: 'Digital Pass Generation',
      kicker: 'PASS ISSUANCE',
      summary: '3D interactive concession card issued directly to the student portal.',
      description:
        'The student receives a secure digital concession card featuring their portrait, course, corridor details, and serial number. The pass supports interactive 3D perspective tilt and flipping between card face and dynamic QR tokens.',
      features: [
        'Interactive 3D tilt & flip animation',
        'Dynamic 90-second travel token generator',
        'Holographic anti-screenshot shimmer effect',
      ],
      uiPreview: {
        badge: 'STUDENT WALLET',
        title: 'Active Digital Pass',
        mockup: (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-2 font-mono text-[11px] shadow-lg">
            <div className="flex justify-between items-center text-amber-400 font-bold">
              <span>YAATHRI DIGITAL PASS</span>
              <span className="text-[10px] text-emerald-400">ACTIVE</span>
            </div>
            <div className="text-white font-sans font-bold text-sm">SCP-2026-00124</div>
            <div className="text-slate-400 text-[10px]">Valid Until: 31 MAR 2027</div>
          </div>
        ),
      },
    },
    {
      num: '07',
      title: 'QR Verification',
      kicker: 'FIELD SCAN',
      summary: 'Conductor or automated turnstile scans pass in under 0.3 seconds.',
      description:
        'On KSRTC buses, conductors use handheld mobile cameras to scan the QR token. At Kochi Metro stations, students align the token against optical turnstile glass. Cryptographic validation completes in 300ms without network latency.',
      features: [
        'High-speed optical camera scan engine',
        'Instant color-coded VALID / INVALID verdict',
        'Offline cryptographic signature validation',
      ],
      uiPreview: {
        badge: 'CONDUCTOR TERMINAL',
        title: 'Scan Verdict (0.3s)',
        mockup: (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span>PASS VERIFIED: VALID</span>
              <Badge variant="success" size="sm">0.3s</Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              Passenger: Ananya Ramesh &bull; Route K-04 &bull; KSRTC Bus #KL-15-A-8821
            </p>
          </div>
        ),
      },
    },
    {
      num: '08',
      title: 'Frictionless Travel',
      kicker: 'JOURNEY COMPLETED',
      summary: 'Boarding trip logged to depot and state RTO audit trail.',
      description:
        'The student travels with dignity and peace of mind. No paper arguments, no faded laminations, and no lost passes. Transport operators receive accurate state subsidy settlement based on real verification data.',
      features: [
        'Zero queue delays at boarding points',
        'Automated trip audit ledger for operator subsidy claims',
        'Transparent state mobility reporting',
      ],
      uiPreview: {
        badge: 'TRIP LOG',
        title: 'Boarding Recorded',
        mockup: (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
              <span>Journey Completed</span>
              <span className="text-emerald-500">CLEARED</span>
            </div>
            <div className="text-slate-500 font-mono text-[10px]">
              Corridor: Thrissur &rarr; Ernakulam &bull; Subsidy Claim Settled
            </div>
          </div>
        ),
      },
    },
  ];

  const activeStage = stages[activeStageIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="info" size="sm">COMPLETE SYSTEM GUIDE</Badge>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          HOW YAATHRI WORKS.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          An end-to-end breakdown of Kerala’s unified digital student concession ecosystem. Explore each stage of the lifecycle below.
        </p>
      </div>

      {/* Horizontal Interactive Stage Selector */}
      <div className="p-2 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-2">
        {stages.map((st, idx) => (
          <button
            key={st.num}
            onClick={() => setActiveStageIndex(idx)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
              activeStageIndex === idx
                ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{st.num}</span>
            <span className="hidden sm:inline font-sans">{st.title}</span>
          </button>
        ))}
      </div>

      {/* Active Stage Deep-Dive Presentation */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Detailed Explanation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-sky-600 dark:text-sky-400">
                {activeStage.num}
              </span>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <Badge variant="neutral" size="sm">{activeStage.kicker}</Badge>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeStage.title}
            </h2>

            <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 leading-snug">
              {activeStage.summary}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {activeStage.description}
            </p>

            {/* Key Capabilities */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Platform Specifications:
              </span>
              {activeStage.features.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={activeStageIndex === 0}
                onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
              >
                &larr; Previous Stage
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={activeStageIndex === stages.length - 1}
                onClick={() => setActiveStageIndex((prev) => Math.min(stages.length - 1, prev + 1))}
              >
                Next Stage &rarr;
              </Button>
            </div>
          </div>

          {/* Right: UI Interactive Mockup Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{activeStage.uiPreview.badge}</span>
              <span>STAGE {activeStage.num} OF 08</span>
            </div>
            
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {activeStage.uiPreview.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {activeStage.uiPreview.mockup}
            </div>
          </div>

        </div>

      </div>

      {/* Next Step Transition Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Curious how 0.3s verification happens?
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Explore how opaque QR cryptography and 90-second tokens enable instant contactless boarding.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/verification">
            <Button variant="primary" size="md">
              See Digital Verification &rarr;
            </Button>
          </Link>
          <Link to="/transport">
            <Button variant="outline" size="md">
              Explore Transport Ecosystem
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

