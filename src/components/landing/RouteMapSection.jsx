import React from 'react';
import RouteMap from '../RouteMap';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';

/**
 * Route & Interactive Transit Map Section
 * Embeds the real Leaflet/OpenStreetMap corridor with rich transit telemetry
 */
export default function RouteMapSection() {
  return (
    <section id="route-map" className="w-full py-16 sm:py-24 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <SectionHeader
          kicker="KERALA TRANSIT CORRIDOR"
          title="INTERACTIVE ROUTE &amp; STAGE MAPPING."
          subtitle="Real-time geographic corridor visualization across Kerala's most traveled student transit lines."
        />

        {/* Map Telemetry Container */}
        <div className="rounded-3xl bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Top Corridor Status Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">alt_route</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Corridor K-04: Thrissur &harr; Ernakulam
                  </span>
                  <Badge variant="success" size="sm" dot>ACTIVE LINE</Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Via Chalakudy &bull; Angamaly &bull; Aluva Metro Interchange
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Distance</span>
                <span className="font-bold text-slate-900 dark:text-white">72.4 KM</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Transport</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">KSRTC &amp; METRO</span>
              </div>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Subsidy</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">81.5%</span>
              </div>
            </div>
          </div>

          {/* Real Leaflet Map */}
          <div className="w-full h-[400px] sm:h-[480px] lg:h-[520px] relative z-0">
            <RouteMap
              origin="Thrissur Central"
              destination="Ernakulam South"
              viaStops={['Chalakudy', 'Angamaly', 'Aluva']}
              transportType="Bus & Metro"
            />
          </div>

          {/* Bottom Route Stations Ledger */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-[#090E17] border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Origin: Thrissur Central (Depot 08)</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Interchange: Aluva Metro Turnstile Gate #4</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;</span>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Destination: Ernakulam South (KMRL Terminus)</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

