import React from 'react';

/**
 * Design System - Button Component
 * Variants: primary, secondary, ghost, outline, danger
 * Sizes: sm, md, lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 shadow-sm hover:shadow-md dark:hover:shadow-sky-500/20',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80',
    outline:
      'bg-transparent border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-600',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 shadow-sm hover:shadow-rose-600/20',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-5 py-2.5 h-10 gap-2',
    lg: 'text-base px-7 py-3.5 h-12 gap-2.5 font-bold',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : icon && iconPosition === 'left' ? (
        <span className="shrink-0 flex items-center">{icon}</span>
      ) : null}

      <span>{children}</span>

      {!isLoading && icon && iconPosition === 'right' ? (
        <span className="shrink-0 flex items-center">{icon}</span>
      ) : null}
    </button>
  );
}

