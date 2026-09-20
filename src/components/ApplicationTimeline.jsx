import React from 'react';
import Badge from './ui/Badge';
import SectionHeader from './ui/SectionHeader';

/**
 * Rebuilt Application Timeline Component
 * Stages:
 * 01 Submitted
 * 02 Institution Review
 * 03 Verification
 * 04 Approved / Rejected
 * 05 Digital Pass Issued
 */
export default function ApplicationTimeline({ studentData }) {
  const status = studentData?.status || 'ACTIVE';
  const isRejected = status === 'REJECTED';
  const isPending = status === 'PENDING';
  const isActive = status === 'ACTIVE';

  const stages = [
    {
      step: 1,
      title: 'Submitted',
      desc: 'Online student application submitted with identity proofs',
      completed: true,
      active: isPending,
      date: studentData?.issueDate || 'Completed',
    },
    {
      step: 2,
      title: 'Institution Review',
      desc: 'College administration verifies academic enrollment',
      completed: !isPending,
      active: isPending,
      date: isPending ? 'In Progress' : 'Verified',
    },
    {
      step: 3,
      title: 'Verification',
      desc: 'Corridor check and subsidy allocation review',
      completed: isActive,
      active: false,
      date: isActive ? 'Attested' : isRejected ? 'Rejected' : 'Queued',
    },
    {
      step: 4,
      title: isRejected ? 'Rejected' : 'Approved',
      desc: isRejected ? (studentData?.rejectionReason || 'Declined by reviewer') : 'Subsidy sanctioned by transport authority',
      completed: isActive,
      active: isRejected,
      isError: isRejected,
      date: isActive ? 'Approved' : isRejected ? 'Terminated' : 'Pending',
    },
    {
      step: 5,
      title: 'Digital Pass Issued',
      desc: 'Cryptographic QR pass activated for transit journeys',
      completed: isActive,
      active: false,
      date: isActive ? 'Active' : 'Locked',
    },
  ];

  return (
    <section id="application-timeline" className="w-full py-12 sm:py-16">
      <div className="rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE APPLICATION TIMELINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Concession Attestation Lifecycle
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400 uppercase">APPLICATION STATUS:</span>
            <Badge variant={isActive ? 'success' : isRejected ? 'danger' : 'warning'} size="md" dot>
              {status}
            </Badge>
          </div>
        </div>

        {/* Rejection Alert if applicable */}
        {isRejected && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-3 text-xs text-rose-700 dark:text-rose-300">
            <span className="material-symbols-outlined text-[22px] shrink-0">error</span>
            <div>
              <p className="font-bold text-sm">Application Rejected by Reviewer</p>
              <p className="mt-0.5">{studentData?.rejectionReason || 'Please resubmit your application with valid enrollment documents.'}</p>
            </div>
          </div>
        )}

        {/* 5-Step Progression Track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stages.map((st) => (
            <div
              key={st.step}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
                st.isError
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : st.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/60 text-slate-900 dark:text-white'
                  : st.active
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white'
                  : 'bg-slate-50/60 dark:bg-[#0E1524] border-slate-200/60 dark:border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                    st.isError
                      ? 'bg-rose-500 text-white'
                      : st.completed
                      ? 'bg-emerald-500 text-white'
                      : st.active
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {st.isError ? '✕' : st.completed ? '✓' : st.step}
                </span>

                <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-70">
                  {st.date}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-tight uppercase mb-1">
                  {st.title}
                </h3>
                <p className="text-[11px] leading-relaxed opacity-80">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
