import React from 'react';

/**
 * Design System - SectionHeader Component
 */
export default function SectionHeader({
  kicker,
  title,
  subtitle,
  align = 'center', // 'left' | 'center'
  className = '',
}) {
  const alignStyles = align === 'left' ? 'text-left' : 'text-center mx-auto';

  return (
    <div className={`max-w-2xl ${alignStyles} space-y-2 sm:space-y-3 ${className}`}>
      {kicker && (
        <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-[10px] sm:text-xs font-mono font-bold tracking-[0.2em] uppercase text-slate-700 dark:text-slate-300 select-none ${align === 'center' ? 'mx-auto' : ''}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          <span>{kicker}</span>
        </div>
      )}

      {title && (
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

