import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle: Elegant button toggling between Light and Dark modes.
 * Displays sun/moon with smooth rotation and subtle glow.
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-full transition-all duration-300 active:scale-90 flex items-center justify-center border ${
        isDark
          ? 'bg-slate-900/80 text-amber-300 border-slate-700/60 hover:bg-slate-800 hover:border-amber-400/40 hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]'
          : 'bg-surface-container-lowest text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
      } ${className}`}
    >
      <span
        className={`material-symbols-outlined text-[19px] transition-transform duration-500 ${
          isDark ? 'rotate-0' : 'rotate-180'
        }`}
      >
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}

