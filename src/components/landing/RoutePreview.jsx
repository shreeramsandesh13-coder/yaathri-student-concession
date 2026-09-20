import React from 'react';
import { Link } from 'react-router-dom';
import RouteMap from '../RouteMap';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/**
 * ROUTE PREVIEW SECTION
 * Real map preview with Thrissur -> Ernakulam Corridor and CTA linking to /routes.
 */
export default function RoutePreview() {
  return (
    <section className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeader
            kicker="GEOGRAPHIC INTELLIGENCE"
            title="KERALA TRANSIT CORRIDORS."
            subtitle="Real-time map and stage validation covering state expressways, suburban routes, and metro links."
          />

          <Link to="/routes" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              iconPosition="right"
            >
              Explore All Routes &amp; Fares
            </Button>
          </Link>
        </div>

        {/* Real Leaflet Map Container with Corridor Bar */}
        <div className="rounded-3xl bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Top Corridor Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">alt_route</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Featured Corridor: Thrissur Central &harr; Ernakulam South
                  </span>
                  <Badge variant="success" size="sm" dot>ACTIVE LINE</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Via Pudukad &bull; Chalakudy &bull; Angamaly &bull; Aluva Metro Interchange
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Distance</span>
                <span className="font-bold text-slate-900 dark:text-white">72.4 KM</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Fleet</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">KSRTC &amp; Metro</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Subsidy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">81.5%</span>
              </div>
            </div>
          </div>

          {/* Real Leaflet Map */}
          <div className="h-[340px] sm:h-[400px] w-full">
            <RouteMap
              startingPoint="Thrissur Central Stand"
              destination="Ernakulam South Depot"
              intermediateStops={['Pudukad Junction', 'Chalakudy Bus Terminal', 'Angamaly KSRTC', 'Aluva Metro Interchange']}
            />
          </div>

        </div>

      </div>
    </section>
  );
}

