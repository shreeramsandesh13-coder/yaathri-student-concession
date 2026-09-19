import React from 'react';

/**
 * ApplicationTimeline component:
 * - Displays the 4-step concession pass lifecycle
 * - Displays active route telemetry modules: Next bus, Metro concession, semester savings
 * - Fully adapted for both Light and Dark themes
 */
export default function ApplicationTimeline({ timeline, studentData }) {
  return (
    <section
      className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8"
      id="timeline-section"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="text-label-caps font-label-caps text-sky-600 dark:text-sky-400 uppercase tracking-widest font-semibold">
            LIVE PASS STATUS &amp; APPLICATION AUDIT
          </div>
          <h2 className="text-headline-md font-headline-md text-slate-900 dark:text-white">
            Application Timeline &amp; Concession Lifecycle
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-[#111722] text-body-sm font-body-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
            Academic Year: {studentData.academicYear}
          </span>
        </div>
      </div>

      {/* Rejection Alert Banner if applicable */}
      {studentData.rejectionReason && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-3 text-xs animate-fade-in">
          <span className="material-symbols-outlined text-rose-600 dark:text-rose-400 text-[22px] shrink-0">
            warning
          </span>
          <div>
            <span className="font-bold text-rose-800 dark:text-rose-300 text-sm block">
              Concession Request Rejected by Administrative Officer
            </span>
            <p className="text-rose-700 dark:text-rose-400 mt-1 font-medium">
              <strong>Official Feedback:</strong> {studentData.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Horizontal Status Progression Tracker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {timeline.map((step) => {
          if (step.isError) {
            return (
              <div
                key={step.step}
                className="bg-rose-950/80 text-white rounded-2xl p-4 border border-rose-500/60 relative shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold">
                    ✕
                  </span>
                  <span className="text-label-caps font-label-caps text-rose-300 uppercase font-bold">
                    {step.date}
                  </span>
                </div>
                <h3 className="text-label-lg font-label-lg text-white font-semibold">
                  {step.title}
                </h3>
                <p className="text-body-sm font-body-sm text-rose-200 mt-1">
                  {step.description}
                </p>
              </div>
            );
          }

          if (step.active) {
            return (
              <div
                key={step.step}
                className="bg-slate-900 dark:bg-[#161F2E] text-white rounded-2xl p-4 border border-sky-500/50 relative shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-xs font-bold animate-pulse">
                    ●
                  </span>
                  <span className="text-label-caps font-label-caps text-sky-300 uppercase font-bold">
                    {step.date}
                  </span>
                </div>
                <h3 className="text-label-lg font-label-lg text-white font-semibold">
                  {step.title}
                </h3>
                <p className="text-body-sm font-body-sm text-slate-300 dark:text-slate-400 mt-1">
                  {step.description}
                </p>
              </div>
            );
          }

          return (
            <div
              key={step.step}
              className="bg-slate-50/80 dark:bg-[#111722]/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800/80 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <span className="text-label-caps font-label-caps text-emerald-600 dark:text-emerald-400 uppercase font-semibold">
                  {step.date}
                </span>
              </div>
              <h3 className="text-label-lg font-label-lg text-slate-900 dark:text-white font-semibold">
                {step.title}
              </h3>
              <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400 mt-1">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Route Telemetry Mini-Module */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-slate-50 dark:bg-[#111722] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center space-x-4 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0D1118] text-sky-600 dark:text-sky-400 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">directions_bus</span>
          </div>
          <div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase">
              Next Subsidized Bus
            </div>
            <div className="text-headline-sm font-headline-sm text-slate-900 dark:text-white font-semibold">
              KSRTC Fast Passenger
            </div>
            <div className="text-body-sm font-body-sm text-emerald-600 dark:text-emerald-400 font-semibold">
              Departs 08:15 AM (Bay 3, Thrissur Stand)
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#111722] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center space-x-4 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0D1118] text-sky-600 dark:text-sky-400 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">subway</span>
          </div>
          <div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase">
              Kochi Metro Concession
            </div>
            <div className="text-headline-sm font-headline-sm text-slate-900 dark:text-white font-semibold">
              Line 1: Aluva ⇄ Thykoodam
            </div>
            <div className="text-body-sm font-body-sm text-sky-600 dark:text-sky-400 font-semibold">
              50% Student Discount Applied
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#111722] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex items-center space-x-4 hover:shadow-sm transition-all">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#0D1118] text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[26px]">energy_savings_leaf</span>
          </div>
          <div>
            <div className="text-label-caps font-label-caps text-slate-500 dark:text-slate-400 uppercase">
              Semester Savings
            </div>
            <div className="text-headline-sm font-headline-sm text-slate-900 dark:text-white font-semibold">
              ₹4,860 Saved
            </div>
            <div className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400">
              Avg. 44 trips subsidized this month
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
