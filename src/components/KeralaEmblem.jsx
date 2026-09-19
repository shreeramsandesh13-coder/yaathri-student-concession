import React from 'react';

/**
 * KeralaEmblem:
 * Official Government of Kerala Transport Department crest
 * Recreated accurately for the top right of the concession pass.
 */
export default function KeralaEmblem({ className = '' }) {
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      <svg
        className="w-11 h-11 text-[#081b2e]"
        viewBox="0 0 120 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ashoka Sarnath Lions Capital (Top) */}
        <path d="M56 12h8v4h-8zM54 16h12v3h-12z" />
        <circle cx="60" cy="8" r="4" />
        {/* Conch / Shankha in Center */}
        <path
          d="M60 28c-5 0-9 4-9 9c0 6 5 11 9 14c4-3 9-8 9-14c0-5-4-9-9-9zm0 18c-3-3-6-6-6-9c0-3 3-6 6-6s6 3 6 6c0 3-3 6-6 9z"
          fillRule="evenodd"
        />
        <circle cx="60" cy="37" r="2.5" />

        {/* Left Elephant Facing Inward */}
        <path d="M38 32c-3-5-8-7-14-5c-7 2-12 9-11 16c1 5 4 8 8 11l-2 15h6l2-10c2 1 4 2 6 2l-1 8h6l1-12c4-2 7-6 8-11c1-4-1-8-4-14z" />
        {/* Left Elephant Trunk & Tusk */}
        <path d="M22 46c-2 6-1 12 2 17c1 1 3 0 2-2c-2-4-3-8-2-13c1-2-1-3-2-2z" />
        <path d="M30 48c2 3 5 4 8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Elephant Facing Inward */}
        <path d="M82 32c3-5 8-7 14-5c7 2 12 9 11 16c-1 5-4 8-8 11l2 15h-6l-2-10c-2 1-4 2-6 2l1 8h-6l-1-12c-4-2-7-6-8-11c-1-4 1-8 4-14z" />
        {/* Right Elephant Trunk & Tusk */}
        <path d="M98 46c2 6 1 12-2 17c-1 1-3 0-2-2c2-4 3-8 2-13c-1-2 1-3 2-2z" />
        <path d="M90 48c-2 3-5 4-8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* Laurel Wreath / Base Pedestal */}
        <path d="M25 76c20 8 50 8 70 0c2-1 0-3-2-2c-19 7-47 7-66 0c-2-1-3 1-2 2z" />
        <path d="M32 80c16 5 40 5 56 0c2-1 0-3-2-2c-16 4-38 4-52 0c-2-1-3 1-2 2z" />
      </svg>
      <span className="text-[8px] font-black tracking-widest text-[#081b2e] uppercase mt-0.5 leading-tight">
        GOVERNMENT OF KERALA
      </span>
      <span className="text-[6.5px] font-bold tracking-wider text-slate-600 uppercase">
        TRANSPORT DEPARTMENT
      </span>
    </div>
  );
}

