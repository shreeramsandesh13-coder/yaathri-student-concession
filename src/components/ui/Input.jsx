import React, { forwardRef } from 'react';

/**
 * Design System - Input Component
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon = null,
    className = '',
    id,
    type = 'text',
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-2xl transition-all">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full h-11 rounded-2xl bg-white dark:bg-[#111722] border text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
            icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-rose-500 focus:ring-rose-500'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium pl-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;

