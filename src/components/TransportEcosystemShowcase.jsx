import React, { useEffect, useRef, useState, useCallback } from 'react';
import busDesktop from '../assets/image/busdesktop.jpeg';
import busMobile from '../assets/image/busmobile.jpeg';
import metroDesktop from '../assets/image/metrodesktop.jpeg';
import metroMobile from '../assets/image/metromobile.jpeg';
import graduationDesktop from '../assets/image/graduationdesktop.jpeg';
import graduationMobile from '../assets/image/graduationmobile.jpeg';
import rtoDesktop from '../assets/image/rtodesktop.jpeg';
import rtoMobile from '../assets/image/rtomobile.jpeg';

/**
 * YAATHRI TRANSPORT ECOSYSTEM — FULLSCREEN SCROLL STORY
 * 
 * Redesigned from scratch:
 * - NO cards, NO card grids, NO image-inside-card boxes.
 * - ONE single immersive fullscreen section with a sticky 4-viewport-height stage.
 * - Huge uncropped isolated objects dominating the viewport.
 * - Scroll-driven crossfade (opacity 1 → 0, scale 1 → 0.96 on exit; opacity 0 → 1, scale 0.96 → 1 on entry).
 * - Simultaneous text transition synchronized with scroll progress.
 * - Minimal progress indicator (01 ─── 02 ─── 03 ─── 04).
 * - Responsive desktop/mobile assets using <picture>.
 */

const CHAPTERS = [
  {
    id: 'ksrtc',
    stepNumber: '01',
    counter: '01 / 04',
    title: 'KSRTC',
    tagline: 'Seamless student travel',
    description: 'Seamless concession verification across public bus journeys.',
    desktopAsset: busDesktop,
    mobileAsset: busMobile,
    altText: 'KSRTC Public Bus Fleet',
    features: ['Fleet Concession Verification', 'Conductor Mobile Sync', 'K-04 Transit Corridor'],
  },
  {
    id: 'metro',
    stepNumber: '02',
    counter: '02 / 04',
    title: 'METRO',
    tagline: 'Connected urban mobility',
    description: 'Connected urban student mobility.',
    desktopAsset: metroDesktop,
    mobileAsset: metroMobile,
    altText: 'Kochi Metro Rapid Transit',
    features: ['0.3s Optical Turnstile Sync', '90-Second Single-Use Travel Token', 'Automated Fare Subsidy'],
  },
  {
    id: 'college',
    stepNumber: '03',
    counter: '03 / 04',
    title: 'COLLEGE / SCHOOL',
    tagline: 'Campus identity verification',
    description: 'Verified student identity from campus to transit.',
    desktopAsset: graduationDesktop,
    mobileAsset: graduationMobile,
    altText: 'Campus Student Identity Verification',
    features: ['Principal & Dean Desk', 'Permanent Student ID QR Ledger', 'Verified Academic Enrollment'],
  },
  {
    id: 'rto',
    stepNumber: '04',
    counter: '04 / 04',
    title: 'RTO / MVD',
    tagline: 'Transport regulatory oversight',
    description: 'Authorized verification and transport oversight.',
    desktopAsset: rtoDesktop,
    mobileAsset: rtoMobile,
    altText: 'Kerala Motor Vehicles Department Oversight',
    features: ['Real-Time Verifier Oversight', 'Cryptographic Audit Trail', 'Kerala MVD Governance'],
  },
];

// Continuous scroll interpolation function for 4 chapters across progress [0, 1]
function getChapterState(index, p) {
  // Transition boundaries
  const transitions = [
    { startIn: -1,   endIn: -1,   startOut: 0.18, endOut: 0.28 }, // 01 KSRTC
    { startIn: 0.18, endIn: 0.28, startOut: 0.43, endOut: 0.53 }, // 02 METRO
    { startIn: 0.43, endIn: 0.53, startOut: 0.68, endOut: 0.78 }, // 03 COLLEGE
    { startIn: 0.68, endIn: 0.78, startOut: 2.00, endOut: 2.00 }, // 04 RTO
  ];

  const { startIn, endIn, startOut, endOut } = transitions[index];
  let opacity = 0;

  if (p < startIn) {
    opacity = 0;
  } else if (startIn >= 0 && p >= startIn && p <= endIn) {
    // Fade & scale in: 0 -> 1
    opacity = (p - startIn) / (endIn - startIn);
  } else if (p > endIn && p < startOut) {
    // Pure active hold
    opacity = 1;
  } else if (endOut <= 1 && p >= startOut && p <= endOut) {
    // Fade & scale out: 1 -> 0
    opacity = 1 - (p - startOut) / (endOut - startOut);
  } else if (p > endOut) {
    opacity = 0;
  } else if (startIn < 0 && p < startOut) {
    // Chapter 0 before fade out
    opacity = 1;
  } else if (startOut > 1 && p > startIn) {
    // Chapter 3 after fade in
    opacity = 1;
  }

  // Clamp opacity [0, 1]
  opacity = Math.max(0, Math.min(1, opacity));

  // Scale: 0.96 when opacity is 0, 1.0 when opacity is 1
  const scale = 0.96 + 0.04 * opacity;
  // Subtle vertical glide
  const translateY = (1 - opacity) * 10;

  return { opacity, scale, translateY };
}

export default function TransportEcosystemShowcase() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Active chapter based on scroll progress
  const activeIndex =
    scrollProgress < 0.23
      ? 0
      : scrollProgress < 0.48
      ? 1
      : scrollProgress < 0.73
      ? 2
      : 3;

  // Track window scroll through the 400vh section
  useEffect(() => {
    let animId = null;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;

      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(Math.max(scrolled / totalScrollable, 0), 1);
      setScrollProgress(progress);
    };

    const onScrollThrottled = () => {
      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScrollThrottled);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Jump to specific chapter upon clicking progress bar
  const goToChapter = useCallback((idx) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const containerTop = currentScrollY + rect.top;
    const totalScrollable = rect.height - window.innerHeight;

    // Center points of the hold zones
    const targetProgress = [0.08, 0.35, 0.60, 0.88][idx];
    const targetScrollY = containerTop + targetProgress * totalScrollable;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  }, []);

  return (
    <div id="transport-ecosystem" className="w-full">
      {/* 4-Viewport-Height Sticky Storytelling Track */}
      <section
        ref={containerRef}
        className="relative w-full h-[400vh]"
        aria-label="Transport Ecosystem Fullscreen Scroll Story"
      >
        {/* Sticky Visual Stage — strictly viewport-sized on both desktop & mobile */}
        <div className="sticky top-0 h-screen min-h-[100dvh] w-full overflow-hidden bg-white text-slate-950 flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-12 lg:px-20 z-20 select-none">
          
          {/* Subtle Top Overall Scroll Progress Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-30 pointer-events-none">
            <div
              className="h-full bg-slate-900 transition-all duration-75 ease-out"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>

          {/* 1. TOP HEADER: Chapter Counter & Ecosystem Tag */}
          <header className="relative z-20 flex items-center justify-between w-full pt-10 sm:pt-4 border-b border-slate-100 pb-3 sm:pb-4">
            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-slate-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <span>TRANSPORT ECOSYSTEM</span>
            </div>
            <div className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-slate-900 uppercase">
              {CHAPTERS[activeIndex].counter}
            </div>
          </header>

          {/* 2. CENTER: HUGE ISOLATED VISUAL SUBJECT (No cards, no boxes, pure uncropped subject) */}
          <div className="relative flex-1 w-full flex items-center justify-center my-2 sm:my-4 min-h-0">
            {CHAPTERS.map((ch, idx) => {
              const { opacity, scale, translateY } = getChapterState(idx, scrollProgress);
              const isVisible = opacity > 0.005;

              return (
                <div
                  key={ch.id}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none will-change-[opacity,transform]"
                  style={{
                    opacity,
                    transform: `scale(${scale}) translateY(${translateY}px)`,
                    visibility: isVisible ? 'visible' : 'hidden',
                  }}
                  aria-hidden={!isVisible}
                >
                  <picture className="w-full h-full flex items-center justify-center">
                    <source media="(max-width: 768px)" srcSet={ch.mobileAsset} />
                    <img
                      src={ch.desktopAsset}
                      alt={ch.altText}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : 'low'}
                      className="w-full h-full max-h-[46dvh] sm:max-h-[54dvh] lg:max-h-[60dvh] object-contain drop-shadow-sm select-none"
                    />
                  </picture>
                </div>
              );
            })}
          </div>

          {/* 3. BOTTOM: EDITORIAL TEXT & MINIMAL PROGRESS INDICATOR */}
          <footer className="relative z-20 w-full pb-2 sm:pb-4">
            {/* Synchronized Crossfading Text Narrative */}
            <div className="relative min-h-[96px] sm:min-h-[115px] flex flex-col items-center text-center justify-center mb-4 sm:mb-6">
              {CHAPTERS.map((ch, idx) => {
                const { opacity, translateY } = getChapterState(idx, scrollProgress);
                const isVisible = opacity > 0.005;

                return (
                  <div
                    key={ch.id}
                    className="absolute inset-x-0 flex flex-col items-center justify-center will-change-[opacity,transform] px-2"
                    style={{
                      opacity,
                      transform: `translateY(${translateY}px)`,
                      visibility: isVisible ? 'visible' : 'hidden',
                    }}
                    aria-hidden={!isVisible}
                  >
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-slate-950 leading-tight">
                      {ch.title}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-lg lg:text-xl font-normal max-w-2xl mt-1 leading-snug">
                      {ch.description}
                    </p>

                    {/* Subtle Supporting YAATHRI Features */}
                    <div className="hidden sm:flex items-center justify-center space-x-4 mt-2.5 text-xs text-slate-500 font-medium">
                      {ch.features.map((feature, fIdx) => (
                        <span key={fIdx} className="inline-flex items-center space-x-1.5">
                          <span className="w-1 h-1 rounded-full bg-slate-400" />
                          <span>{feature}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Minimal Progress Indicator: 01 ─── 02 ─── 03 ─── 04 */}
            <nav
              aria-label="Chapter progress"
              className="flex items-center justify-center space-x-2 sm:space-x-6 max-w-md mx-auto pt-3 border-t border-slate-100"
            >
              {CHAPTERS.map((ch, idx) => {
                const isCurrent = activeIndex === idx;
                const isPast = activeIndex > idx;

                return (
                  <React.Fragment key={ch.id}>
                    <button
                      onClick={() => goToChapter(idx)}
                      className="group flex items-center space-x-1.5 cursor-pointer py-1 focus:outline-none"
                      title={`Jump to ${ch.title}`}
                      aria-current={isCurrent ? 'step' : undefined}
                    >
                      <span
                        className={`text-xs sm:text-sm font-mono font-bold tracking-wider transition-colors duration-200 ${
                          isCurrent
                            ? 'text-slate-950 font-black'
                            : isPast
                            ? 'text-slate-500'
                            : 'text-slate-300 group-hover:text-slate-600'
                        }`}
                      >
                        {ch.stepNumber}
                      </span>
                    </button>
                    {idx < CHAPTERS.length - 1 && (
                      <div
                        className={`h-0.5 w-6 sm:w-12 lg:w-16 rounded-full transition-colors duration-300 ${
                          isPast ? 'bg-slate-900' : isCurrent ? 'bg-slate-400' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </footer>
        </div>
      </section>
    </div>
  );
}
