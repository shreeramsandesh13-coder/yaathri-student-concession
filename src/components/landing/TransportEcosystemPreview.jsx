import React from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { TRANSPORT_CHAPTERS } from '../../data/transportAssets';

/**
 * TRANSPORT ECOSYSTEM PREVIEW
 * "ONE DIGITAL ID. MULTIPLE JOURNEYS."
 * Preview panels for KSRTC, Metro, College, and RTO linking to /transport.
 */
export default function TransportEcosystemPreview() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            kicker="MULTIMODAL MOBILITY NETWORK"
            title="ONE DIGITAL ID. MULTIPLE JOURNEYS."
            subtitle="Kerala's unified student transit ecosystem connecting bus fleets, rapid metro rail, academic institutions, and transport regulators."
          />

          <Link to="/transport" className="shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              iconPosition="right"
              className="shadow-lg shadow-sky-500/10"
            >
              Explore Transport Ecosystem
            </Button>
          </Link>
        </div>

        {/* 4 Preview Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRANSPORT_CHAPTERS.map((ch) => (
            <Link
              key={ch.id}
              to={`/transport#${ch.id}`}
              className="group p-5 rounded-3xl bg-slate-50 dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              {/* Asset Thumbnail Preview */}
              <div className="w-full aspect-[4/3] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 flex items-center justify-center overflow-hidden">
                <img
                  src={ch.mobileAsset || ch.desktopAsset}
                  alt={ch.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">
                    {ch.chapterNumber}
                  </span>
                  <Badge variant="neutral" size="sm">
                    {ch.name}
                  </Badge>
                </div>
                <h4 className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white pt-1">
                  {ch.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {ch.heading}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 group-hover:text-sky-500 transition-colors">
                <span>View Chapter</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

