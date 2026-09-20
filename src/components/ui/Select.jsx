import React, { forwardRef } from 'react';

/**
 * Design System - Select Component
 */
const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    children,
    className = '',
    id,
    ...props
  },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-2xl">
        <select
          ref={ref}
          id={selectId}
          className={`w-full h-11 appearance-none rounded-2xl bg-white dark:bg-[#111722] border text-slate-900 dark:text-slate-100 text-sm px-4 pr-10 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent cursor-pointer ${
            error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          } ${className}`}
          {...props}
        >
          {children ? (
            children
          ) : (
            options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))
          )}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <span className="material-symbols-outlined text-[20px]">expand_more</span>
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium pl-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Select;

