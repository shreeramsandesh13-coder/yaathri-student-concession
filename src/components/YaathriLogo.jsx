import React from 'react';

/**
 * YaathriLogo:
 * Official YAATHRI (യാത്രി) brand identity.
 * Features:
 * - Custom Malayalam typography (യാത്രി) with an integrated transit bus inside the lettering
 * - Coconut palm, rising sun, green/teal hill
 * - Dark navy lettering, English wordmark 'YAATHRI'
 * - 'PEOPLE • PLACES • PROGRESS'
 * - Renders the official authentic logo reference asset with zero font compromises
 */
export default function YaathriLogo({
  variant = 'full', // 'full' | 'compact' | 'icon' | 'card'
  className = '',
  showSubtitle = true,
}) {
  const isCard = variant === 'card';

  if (isCard) {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <img
          src="/yaathri-logo-transparent.png"
          alt="YAATHRI (യാത്രി) — Student Concession Pass"
          className="h-10 sm:h-12 w-auto object-contain pointer-events-none"
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center p-1 bg-white/95 rounded-xl shadow-sm border border-slate-200/60 select-none ${className}`}>
        <img
          src="/yaathri-logo-transparent.png"
          alt="YAATHRI"
          className="h-7 w-auto object-contain pointer-events-none"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center select-none ${className}`}>
        <div className="bg-white/95 dark:bg-white rounded-xl p-1 shadow-sm border border-slate-200/80 shrink-0 flex items-center justify-center">
          <img
            src="/yaathri-logo-transparent.png"
            alt="YAATHRI (യാത്രി)"
            className="h-8 sm:h-9 w-auto object-contain pointer-events-none"
          />
        </div>
      </div>
    );
  }

  // Full / Default variant for Navbar, Footer, Hero, Modals
  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      {/* Authentic Custom Logo Mark */}
      <div className="bg-white/95 dark:bg-white rounded-xl p-1.5 shadow-sm border border-slate-200/80 dark:border-white/20 shrink-0 flex items-center justify-center">
        <img
          src="/yaathri-logo-transparent.png"
          alt="YAATHRI (യാത്രി)"
          className="h-8 sm:h-9 md:h-10 w-auto object-contain pointer-events-none"
        />
      </div>

      {showSubtitle && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              YAATHRI
            </span>
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
              യാത്രി
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide -mt-0.5">
            Student Concession Pass
          </span>
        </div>
      )}
    </div>
  );
}
