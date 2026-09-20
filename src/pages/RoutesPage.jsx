import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RouteMap, { KERALA_LOCATIONS } from '../components/RouteMap';
import SectionHeader from '../components/ui/SectionHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/**
 * ROUTES PAGE (/routes)
 * Interactive transit corridor discovery with real Leaflet OpenStreetMap,
 * corridor selection, stage stops, and concession fare breakdowns.
 */
export default function RoutesPage() {
  const corridors = [
    {
      id: 'K-04',
      name: 'Corridor K-04',
      title: 'Thrissur Central ⇄ Ernakulam South',
      from: 'Thrissur Central Stand',
      to: 'Ernakulam South Depot',
      stops: ['Pudukad Junction', 'Chalakudy Bus Terminal', 'Angamaly KSRTC', 'Aluva Metro Interchange'],
      distance: '72.4 KM',
      ksrtcSubsidy: '81.5%',
      metroSubsidy: '50.0%',
      standardFare: '₹95',
      concessionFare: '₹18',
      travelTime: '1 hr 45 min',
      fleet: 'KSRTC Fast Passenger & Kochi Metro Line 1',
    },
    {
      id: 'K-01',
      name: 'Corridor K-01',
      title: 'Trivandrum Central ⇄ Kollam Junction',
      from: 'Trivandrum Central',
      to: 'Kollam Bus Stand',
      stops: ['Attingal KSRTC', 'Chathannoor Junction'],
      distance: '68.0 KM',
      ksrtcSubsidy: '80.0%',
      metroSubsidy: '0%',
      standardFare: '₹85',
      concessionFare: '₹17',
      travelTime: '1 hr 30 min',
      fleet: 'KSRTC Super Fast & Ordinary',
    },
    {
      id: 'K-07',
      name: 'Corridor K-07',
      title: 'Kozhikode City ⇄ Kannur Central',
      from: 'Kozhikode Stand',
      to: 'Kannur Old Stand',
      stops: ['Koyilandy', 'Vadakara', 'Thalassery'],
      distance: '89.5 KM',
      ksrtcSubsidy: '78.5%',
      metroSubsidy: '0%',
      standardFare: '₹115',
      concessionFare: '₹24',
      travelTime: '2 hr 15 min',
      fleet: 'KSRTC Express & Limited Stop',
    },
  ];

  const [selectedCorridorId, setSelectedCorridorId] = useState('K-04');
  const selectedCorridor = corridors.find((c) => c.id === selectedCorridorId) || corridors[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="info" size="sm">GEOGRAPHIC TRANSIT INTELLIGENCE</Badge>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          ROUTE NETWORK &amp; CORRIDORS.
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Explore gazetted student concession corridors across Kerala. View real-time GPS coordinates, stage fare subsidies, and interchange points.
        </p>
      </div>

      {/* Corridor Selector Pill Buttons */}
      <div className="flex items-center justify-center gap-3 overflow-x-auto p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
        {corridors.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCorridorId(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedCorridorId === c.id
                ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {c.name}: {c.title.split('⇄')[0]} &harr;
          </button>
        ))}
      </div>

      {/* Map & Corridor Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Real Leaflet Map Container (7 Columns on large screens) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">{selectedCorridor.title}</span>
                <Badge variant="success" size="sm" dot>GAZETTED</Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {selectedCorridor.fleet}
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 px-3 py-1 rounded-lg bg-sky-500/10">
              {selectedCorridor.distance}
            </span>
          </div>

          {/* Leaflet Map Canvas */}
          <div className="h-[440px] sm:h-[500px] w-full">
            <RouteMap
              startingPoint={selectedCorridor.from}
              destination={selectedCorridor.to}
              intermediateStops={selectedCorridor.stops}
            />
          </div>
        </div>

        {/* Corridor Telemetry & Fare Breakdown (4 Columns on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase block">
                {selectedCorridor.name} TELEMETRY
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Corridor Fare &amp; Subsidy
              </h3>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Regular Tariff</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{selectedCorridor.standardFare}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                <span className="font-bold">Student Concession Fare</span>
                <span className="font-black text-base">{selectedCorridor.concessionFare}</span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">KSRTC Subsidy Rate</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{selectedCorridor.ksrtcSubsidy}</span>
              </div>

              {selectedCorridor.metroSubsidy !== '0%' && (
                <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Metro Subsidy Rate</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{selectedCorridor.metroSubsidy}</span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Est. Transit Time</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedCorridor.travelTime}</span>
              </div>
            </div>

            {/* Intermediate Stops */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase block">
                Intermediate Verification Stages:
              </span>
              <div className="space-y-1.5">
                {selectedCorridor.stops.map((stop, sIdx) => (
                  <div key={sIdx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>{stop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Action */}
            <div className="pt-2">
              <Link to="/student/apply" className="block w-full">
                <Button variant="primary" size="md" className="w-full">
                  Apply for this Corridor &rarr;
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Next Step Transition Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Ready to claim your student concession?
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
          Enroll in Kerala's digital student transit network and receive your cryptographically verified pass.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/student/apply">
            <Button variant="primary" size="md">
              Get Your Pass &rarr;
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="md">
              Sign In to Existing Account
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}

