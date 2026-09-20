import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * ABOUT PAGE (/about)
 * Editorial narrative on the origins, vision, and technology connecting Kerala's student transit.
 */
export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16 sm:space-y-24">
      
      {/* Title */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <Badge variant="info" size="sm">EDITORIAL MANIFESTO</Badge>
          <span className="text-xs font-mono text-slate-400">KERALA MOBILITY INITIATIVE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[1.08]">
          THE STORY OF
          <br />
          <span className="bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-600 dark:from-sky-400 dark:via-blue-300 dark:to-indigo-300 bg-clip-text text-transparent">
            YAATHRI.
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          How Kerala replaced millions of fragile paper concession slips with a secure, multimodal digital transit network.
        </p>
      </div>

      {/* Chapter 01: Why YAATHRI Exists */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-slate-200/80 dark:border-slate-800/80 pt-12">
        <div className="md:col-span-4 space-y-2">
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">01 / GENESIS</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            The Paper Concession Crisis
          </h3>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            For decades, hundreds of thousands of students across Kerala relied on laminated paper passes. To obtain one, students stood in physical queues at bus depots, paid for manual stamp sheets, and waited up to four weeks for paper forms to circulate between college clerks and depot supervisors.
          </p>
          <p>
            During the heavy Kerala monsoon, these laminated passes tore, blurred, or degraded. In crowded peak-hour buses, conductors were forced to squint at faded handwriting, leading to disputes, boarding delays, and fare leakage.
          </p>
        </div>
      </div>

      {/* Chapter 02: The Vision */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-slate-200/80 dark:border-slate-800/80 pt-12">
        <div className="md:col-span-4 space-y-2">
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">02 / VISION</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            A Dignified Digital Transit Experience
          </h3>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            YAATHRI was conceived with a single guiding principle: <em>student travel must be dignified, fast, and digitally verified.</em>
          </p>
          <p>
            By unifying student enrollment registries with transport telematics, YAATHRI eliminated paper completely. A student can apply from their smartphone, receive digital college endorsement within hours, and carry an interactive 3D digital pass that works seamlessly on both KSRTC buses and Kochi Metro optical gates.
          </p>
        </div>
      </div>

      {/* Chapter 03: The Ecosystem */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-slate-200/80 dark:border-slate-800/80 pt-12">
        <div className="md:col-span-4 space-y-2">
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">03 / ECOSYSTEM</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Connecting All Four Stakeholders
          </h3>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            True digital mobility requires synchronizing multiple independent authorities into a single, cohesive fabric:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Students</span>
              <p className="text-xs text-slate-500">Apply online, generate 90-second offline travel tokens, track renewal.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Colleges &amp; Schools</span>
              <p className="text-xs text-slate-500">Verify genuine enrollment proofs in-browser with zero paperwork.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Conductors &amp; Gates</span>
              <p className="text-xs text-slate-500">0.3-second camera optical scans with instant valid/invalid color alerts.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block text-sm">Transport Authority (RTO)</span>
              <p className="text-xs text-slate-500">Centralized verifier credentialing, instant suspension rights, and live audit telemetry.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter 04: Technology Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-slate-200/80 dark:border-slate-800/80 pt-12">
        <div className="md:col-span-4 space-y-2">
          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">04 / TECHNOLOGY</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Security Without Compromise
          </h3>
        </div>
        <div className="md:col-span-8 space-y-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          <p>
            YAATHRI is built on privacy-first cryptography. QR tokens are opaque and ephemeral: they contain no plain-text personal identifiers, preventing snooping or screenshot abuse.
          </p>
          <p>
            The backend is powered by a high-throughput FastAPI engine, SQLite/PostgreSQL ledger models, and Leaflet geographic corridor routing.
          </p>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-6">
        <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
          Join Kerala's Digital Mobility Network
        </h3>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Experience frictionless transit concessions across public buses and metro turnstiles today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/student/apply">
            <Button variant="primary" size="md">
              Apply for Digital Pass &rarr;
            </Button>
          </Link>
          <Link to="/how-it-works">
            <Button variant="outline" size="md" className="border-slate-700 text-white hover:bg-slate-800">
              View How It Works
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

