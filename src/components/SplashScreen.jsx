import React, { useState, useEffect, useRef } from 'react';

/**
 * YAATHRI Official Startup Animation:
 * - Automatically selects correct video based on viewport/device:
 *   - Desktop: /introdesktop.mp4
 *   - Mobile/Phone: /introphone.mp4
 * - Full-screen intro with preserved aspect ratio (no stretch)
 * - Plays exactly once on application initial entry
 * - No browser video controls, non-looping, muted autoplay for guaranteed browser compatibility
 * - Smooth fade-out transition to the YAATHRI landing page upon completion or skip
 * - Visible, clean Skip button
 * - Respects prefers-reduced-motion
 */
export default function SplashScreen({ onComplete }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);
  const fadeDuration = 700; // 700ms smooth fade transition

  // Automatically determine desktop vs mobile video source
  const getInitialVideoSrc = () => {
    if (typeof window === 'undefined') return '/introdesktop.mp4';
    const isMobileViewport = window.innerWidth < 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isPortrait = window.innerHeight > window.innerWidth;
    return (isMobileViewport || (isTouchDevice && isPortrait))
      ? '/introphone.mp4'
      : '/introdesktop.mp4';
  };

  const [videoSrc, setVideoSrc] = useState(getInitialVideoSrc);

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

  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        onComplete();
        return;
      }
    }

    // Auto-detect orientation or window size changes before video plays
    const handleResize = () => {
      const isMobileViewport = window.innerWidth < 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isPortrait = window.innerHeight > window.innerWidth;
      const newSrc = (isMobileViewport || (isTouchDevice && isPortrait))
        ? '/introphone.mp4'
        : '/introdesktop.mp4';
      setVideoSrc(newSrc);
    };

    window.addEventListener('resize', handleResize);

    // Auto-play video with muted playback guarantee
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        setAutoplayBlocked(true);
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleManualPlay = () => {
    setAutoplayBlocked(false);
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        handleTransitionOut();
      });
    }
  };

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
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
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

        {/* Fallback Play Button if browser policy blocked silent autoplay */}
        {autoplayBlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
            <button
              type="button"
              onClick={handleManualPlay}
              className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
              <span>Play YAATHRI Intro</span>
            </button>
          </div>
        )}

        {/* Clean, Modern Skip Button */}
        <button
          type="button"
          onClick={handleTransitionOut}
          className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white/90 hover:text-white border border-white/15 hover:border-white/30 backdrop-blur-md text-xs font-semibold tracking-wider uppercase flex items-center space-x-1.5 shadow-xl transition-all active:scale-95 cursor-pointer"
          title="Skip Intro Animation"
        >
          <span>Skip</span>
          <span className="material-symbols-outlined text-[16px]">fast_forward</span>
        </button>
      </div>
    </div>
  );
}
