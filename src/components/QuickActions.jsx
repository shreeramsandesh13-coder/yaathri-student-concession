import React from 'react';

/**
 * QuickActions component:
 * - 4 interactive service cards adapted for Light and Dark themes
 *   1. Apply For Pass (opens multi-step form)
 *   2. View Pass / NFC (switches view to 3D Pass / Apple Wallet simulation)
 *   3. Renew Concession (opens semester re-endorsement check)
 *   4. Verify Pass (scrolls to/activates verification console)
 */
export default function QuickActions({ onOpenApply, onGoPass, onGoVerify, onOpenRenew }) {
  const actions = [
    {
      id: 'apply',
      icon: 'app_registration',
      title: 'Apply For Pass',
      description: 'New academic year student onboarding and route allocation request.',
      cta: 'Start Application',
      onClick: onOpenApply,
      color: 'text-sky-600 dark:text-sky-400',
    },
    {
      id: 'wallet',
      icon: 'contactless',
      title: 'View Pass / NFC',
      description: 'Instant Apple / Google Wallet pass provisioning and offline biometric NFC token.',
      cta: 'View 3D Pass',
      onClick: onGoPass,
      color: 'text-sky-600 dark:text-sky-400',
    },
    {
      id: 'renew',
      icon: 'autorenew',
      title: 'Renew Concession',
      description: 'Semester re-endorsement with college attendance & fee verification check.',
      cta: 'Verify Semester',
      onClick: onOpenRenew,
      color: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'verify',
      icon: 'qr_code_scanner',
      title: 'Verify Pass',
      description: 'Conductor and transit inspector instant cryptographic authenticity check.',
      cta: 'Instant Scanner',
      onClick: onGoVerify,
      color: 'text-sky-600 dark:text-sky-400',
    },
  ];

  return (
    <section className="space-y-6" id="services-section">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-label-caps font-label-caps text-sky-600 dark:text-sky-400 tracking-widest uppercase font-semibold">
            STUDENT CONCESSION UTILITIES
          </span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-slate-900 dark:text-white">
            Quick Actions &amp; Pass Services
          </h2>
        </div>
        <div className="hidden sm:block text-body-sm font-body-sm text-slate-500 dark:text-slate-400">
          End-to-end digital lifecycle managed with RTO Kerala
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((act) => (
          <div
            key={act.id}
            onClick={act.onClick}
            className="bg-white/80 dark:bg-[#111722]/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-sky-500/10 hover:border-sky-500/50 dark:hover:border-sky-500/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-64"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#161F2E] text-slate-800 dark:text-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className={`material-symbols-outlined text-[24px] ${act.color}`}>
                  {act.icon}
                </span>
              </div>
              <h3 className="text-headline-sm font-headline-sm text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                {act.title}
              </h3>
              <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400 mt-2">
                {act.description}
              </p>
            </div>

            <div className={`flex items-center space-x-2 text-label-md font-label-md font-bold ${act.color}`}>
              <span>{act.cta}</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
