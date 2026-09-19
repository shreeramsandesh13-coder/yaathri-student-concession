import React from 'react';

/**
 * HistoryView: Student Transit Trip Ledger
 * Displays recent tap-and-go trips across KSRTC and Kochi Metro with real-time subsidies.
 * Fully adapted for Light and Dark themes.
 */
export default function HistoryView({ studentData }) {
  const tripRecords = [
    {
      id: 'TRIP-9812',
      date: 'Today, 08:32 AM',
      mode: 'Kochi Metro Line 1',
      icon: 'subway',
      route: 'Aluva → MG Road',
      originalFare: '₹40.00',
      discount: '50%',
      paidFare: '₹20.00',
      saved: '₹20.00',
      status: 'TAP EXIT COMPLETED',
    },
    {
      id: 'TRIP-9804',
      date: 'Yesterday, 05:15 PM',
      mode: 'KSRTC Fast Passenger',
      icon: 'directions_bus',
      route: 'Ernakulam KSRTC Stand → Thrissur Central',
      originalFare: '₹95.00',
      discount: '80%',
      paidFare: '₹19.00',
      saved: '₹76.00',
      status: 'VALIDATED BY CONDUCTOR',
    },
    {
      id: 'TRIP-9781',
      date: '16 Sep 2026, 08:10 AM',
      mode: 'KSRTC Ordinary',
      icon: 'directions_bus',
      route: 'Thrissur → Chalakudy',
      originalFare: '₹35.00',
      discount: '80%',
      paidFare: '₹7.00',
      saved: '₹28.00',
      status: 'QR VERIFIED',
    },
    {
      id: 'TRIP-9722',
      date: '15 Sep 2026, 04:45 PM',
      mode: 'Kochi Metro Line 1',
      icon: 'subway',
      route: 'Edappally → Aluva',
      originalFare: '₹30.00',
      discount: '50%',
      paidFare: '₹15.00',
      saved: '₹15.00',
      status: 'TAP EXIT COMPLETED',
    },
  ];

  return (
    <section className="space-y-6 pt-6 animate-fade-in" id="history-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-label-caps font-label-caps text-sky-600 dark:text-sky-400 uppercase tracking-widest font-semibold">
            YAATHRI — STUDENT CONCESSION PASS
          </span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-slate-900 dark:text-white">
            Trip &amp; Subsidy History
          </h2>
          <p className="text-body-md font-body-md text-slate-500 dark:text-slate-400 mt-1">
            ONE PASS • A BRIGHTER JOURNEY • Real-time scan records registered on automated QR gates and conductor handheld terminals.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-[#111722] px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3 shrink-0 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">savings</span>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cumulative Savings</div>
            <div className="text-headline-sm font-headline-sm font-bold text-slate-900 dark:text-white">₹4,860.00</div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-[#111722]/80 text-slate-500 dark:text-slate-400 text-label-caps font-label-caps uppercase border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">Trip &amp; Mode</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Date &amp; Time</th>
                <th className="px-6 py-4">Standard Fare</th>
                <th className="px-6 py-4">Student Paid</th>
                <th className="px-6 py-4">Savings</th>
                <th className="px-6 py-4 text-right">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800/80 font-body-sm">
              {tripRecords.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/60 dark:hover:bg-[#161F2E]/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-[#161F2E] text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">{trip.icon}</span>
                    </div>
                    <div>
                      <div className="font-semibold">{trip.mode}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{trip.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-200 font-medium">{trip.route}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{trip.date}</td>
                  <td className="px-6 py-4 text-slate-400 dark:text-slate-500 line-through">{trip.originalFare}</td>
                  <td className="px-6 py-4 font-bold text-sky-600 dark:text-sky-400 font-mono">{trip.paidFare}</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono">+{trip.saved}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {trip.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
