import React, { useState, useEffect, useRef } from 'react';

/**
 * YAATHRI Official Startup Animation:
 * - Uses the official MP4 intro video (/yaathri-intro.mp4)
 * - Plays exactly once on application initial entry
 * - No browser video controls, non-looping
 * - Responsive on desktop, tablet, and mobile with preserved aspect ratio (no stretch)
 * - Smooth fade out transition to the YAATHRI landing page upon completion or skip
 * - Clean Skip button with identical smooth fade
 * - Respects prefers-reduced-motion
 */
export default function SplashScreen({ onComplete }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);
  const fadeDuration = 700; // 700ms smooth fade transition

  const handleTransitionOut = () => {
    if (isFading) return;
    setIsFading(true);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {}
    }
    setTimeout(() => {
      onComplete();
    }, fadeDuration);
  };

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        onComplete();
        return;
      }
    }

    // Auto-play video with muted playback guarantee
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {
            // If browser blocks playback completely, exit cleanly so user isn't stuck
            handleTransitionOut();
          });
        }
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#05080E] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transitionDuration: `${fadeDuration}ms`,
      }}
      aria-label="YAATHRI Startup Intro"
    >
      {/* Video Container preserving aspect ratio across all devices */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src="/yaathri-intro.mp4"
          autoPlay
          muted
          playsInline
          controls={false}
          loop={false}
          onEnded={handleTransitionOut}
          onError={handleTransitionOut}
          className="w-full h-full object-contain max-w-full max-h-full"
          aria-label="YAATHRI Opening Animation"
        />

        {/* Clean, Modern Skip Button */}
        <button
          type="button"
          onClick={handleTransitionOut}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white/90 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md text-xs font-semibold tracking-wider uppercase flex items-center space-x-1.5 shadow-xl transition-all active:scale-95 cursor-pointer"
          title="Skip Intro Animation"
        >
          <span>Skip</span>
          <span className="material-symbols-outlined text-[16px]">fast_forward</span>
        </button>
      </div>
    </div>
  );
}
