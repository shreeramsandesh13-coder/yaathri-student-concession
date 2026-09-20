import React from 'react';

/**
 * Design System - Skeleton Component for progressive loading states
 */
export default function Skeleton({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular'
  width,
  height,
}) {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full shrink-0',
    rectangular: 'rounded-2xl',
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`bg-slate-200/80 dark:bg-slate-800/60 animate-pulse ${
        variantStyles[variant] || variantStyles.rectangular
      } ${className}`}
    />
  );
}

