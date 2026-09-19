import React, { useState } from 'react';
import { useCardTilt } from '../hooks/useCardTilt';
import ConcessionCardFront from './ConcessionCardFront';
import ConcessionCardBack from './ConcessionCardBack';

/**
 * ConcessionPass:
 * Real 3D interactive digital identity card.
 * Decoupled 3-tier architecture:
 * 1. CardInteractionWrapper: Geometrically static container with invisible buffer.
 * 2. CardTransformContainer: Smooth spring-lerped 3D physics tilt without coordinate feedback loops.
 * 3. CardSurfaces: Front and Back physical card representations matching the official card design.
 */
export default function ConcessionPass({ studentData }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const {
    wrapperRef,
    glareRef,
    auraRef,
    tiltStyle,
    handlePointerMove,
    handlePointerLeave,
  } = useCardTilt();

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  // Combine flip rotation with spring tilt
  const transformMatch = tiltStyle.transform.match(
    /rotateX\(([-\d.]+)deg\)\s+rotateY\(([-\d.]+)deg\)\s+translateZ\(([-\d.]+)px\)/
  );
  const tiltX = transformMatch ? parseFloat(transformMatch[1]) : 0;
  const tiltY = transformMatch ? parseFloat(transformMatch[2]) : 0;
  const tiltZ = transformMatch ? parseFloat(transformMatch[3]) : 0;

  const baseRotateY = isFlipped ? 180 : 0;
  const combinedTransform = `rotateX(${tiltX}deg) rotateY(${baseRotateY + tiltY}deg) translateZ(${tiltZ}px)`;

  return (
    <div className="flex flex-col items-center justify-center perspective-1000 py-2 relative w-full">
      {/* 1. Geometrically Stable Non-Transformed Interaction Wrapper */}
      <div
        ref={wrapperRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleCardClick}
        className="relative w-full max-w-[390px] sm:max-w-[430px] p-3 sm:p-4 cursor-pointer select-none group touch-manipulation"
      >
        {/* Interactive Magnetic Aura Glow */}
        <div
          ref={auraRef}
          id="card-aura"
          className="absolute -inset-6 bg-radial from-teal-500/20 via-sky-500/15 to-transparent blur-3xl opacity-60 pointer-events-none transition-opacity duration-300 rounded-full"
        />

        {/* 2. CardTransformContainer: Rotates and Tilts with Spring Physics */}
        <div
          id="card-scene"
          className="relative w-full aspect-[1/1.46] transition-transform duration-100 ease-out"
          style={{
            transform: combinedTransform,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Soft Ground Contact Shadow */}
          <div
            className="absolute -bottom-7 inset-x-8 h-8 bg-black/45 blur-xl rounded-full transition-transform duration-300 pointer-events-none"
            style={{
              transform: `scale(${1 + Math.abs(tiltX) * 0.02})`,
            }}
          />

          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <ConcessionCardFront studentData={studentData} />
            {/* Specular Holographic Glare Overlay */}
            <div
              ref={glareRef}
              className="absolute inset-0 pointer-events-none hologram-shimmer opacity-20 rounded-3xl z-30 transition-opacity duration-150"
            />
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <ConcessionCardBack studentData={studentData} />
          </div>
        </div>
      </div>

      {/* User Helper Pill */}
      <div className="mt-2 flex items-center space-x-2 text-label-caps font-label-caps text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <span className="material-symbols-outlined text-[14px] text-sky-500">3d_rotation</span>
        <span>Smooth 3D hover • Click card to flip front / back</span>
      </div>
    </div>
  );
}
