import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { TRANSPORT_CHAPTERS } from '../data/transportAssets';

/**
 * TRANSPORT ECOSYSTEM PAGE (/transport)
 * 
 * Re-architected as an interactive single-viewport horizontal chapter experience:
 * - NO long vertical scrolling page.
 * - Displays ONE chapter at a time in the main content area.
 * - Chapters:
 *     01 — KSRTC (busdesktop / busmobile)
 *     02 — KOCHI METRO (metrodesktop / metromobile)
 *     03 — COLLEGE / SCHOOL (graduationdesktop / graduationmobile)
 *     04 — RTO / MVD (rtodesktop / rtomobile)
 * - Navigation:
 *     - Top horizontal chapter tabs / selector
 *     - Previous & Next buttons (with wrap-around from 04 -> 01)
 *     - Keyboard arrows (Left / Right)
 *     - Mobile touch swipe
 * - Clean 400-500ms transition with zero page reload
 * - Large uncropped visual subject with object-fit: contain
 * - Complete step-by-step verification workflow mockups & realistic route corridor examples
 */
export default function TransportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartXRef = useRef(null);

  // Sync with URL hash if loaded with #metro, #ksrtc, #college, #rto
  useEffect(() => {
    if (location.hash) {
      const hashId = location.hash.replace('#', '').toLowerCase();
      const foundIdx = TRANSPORT_CHAPTERS.findIndex((c) => c.id.toLowerCase() === hashId);
      if (foundIdx !== -1) {
        setActiveIdx(foundIdx);
      }
    }
  }, [location.hash]);

  const activeChapter = TRANSPORT_CHAPTERS[activeIdx];

  const handleSelectChapter = useCallback((idx) => {
    if (idx === activeIdx || isTransitioning) return;
    setIsTransitioning(true);
    setActiveIdx(idx);
    const targetChapter = TRANSPORT_CHAPTERS[idx];
    navigate(`#${targetChapter.id}`, { replace: true });
    setTimeout(() => {
      setIsTransitioning(false);
    }, 350);
  }, [activeIdx, isTransitioning, navigate]);

  const handlePrev = useCallback(() => {
    const nextIdx = activeIdx === 0 ? TRANSPORT_CHAPTERS.length - 1 : activeIdx - 1;
    handleSelectChapter(nextIdx);
  }, [activeIdx, handleSelectChapter]);

  const handleNext = useCallback(() => {
    const nextIdx = activeIdx === TRANSPORT_CHAPTERS.length - 1 ? 0 : activeIdx + 1;
    handleSelectChapter(nextIdx);
  }, [activeIdx, handleSelectChapter]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. EDITORIAL TITLE & SUBHEADING */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <Badge variant="info" size="sm">MULTIMODAL MOBILITY INFRASTRUCTURE</Badge>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          TRANSPORT ECOSYSTEM
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal">
          One pass. Multiple journeys.
        </p>
      </div>

      {/* 2. TOP HORIZONTAL CHAPTER SELECTOR TABS */}
      <div className="w-full">
        <div className="flex items-center justify-between p-1.5 rounded-2xl bg-white/80 dark:bg-[#0B111D]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-x-auto gap-2 scrollbar-none">
          <div className="flex items-center space-x-1.5 sm:space-x-2 w-full justify-between sm:justify-start">
            {TRANSPORT_CHAPTERS.map((ch, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChapter(idx)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 shadow-md scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span className={isActive ? 'font-black' : 'text-slate-400 dark:text-slate-500'}>
                    {ch.chapterNumber}
                  </span>
                  <span className="font-sans font-bold tracking-tight">{ch.name}</span>
                </button>
              );
            })}
          </div>

          <Link to="/routes" className="shrink-0 hidden md:block pl-3 border-l border-slate-200 dark:border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              icon={<span className="material-symbols-outlined text-[16px]">alt_route</span>}
            >
              Route Network
            </Button>
          </Link>
        </div>
      </div>

      {/* 3. MAIN CHAPTER VISUAL STAGE (ONE CHAPTER AT A TIME) */}
      <div
        key={activeChapter.id}
        className={`transition-all duration-400 ease-out space-y-8 ${
          isTransitioning ? 'opacity-0 translate-y-2 scale-[0.99]' : 'opacity-100 translate-y-0 scale-100'
        }`}
      >
        {/* Stage Container: Hero Visual + Core Narrative */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-8">
          
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono font-bold text-sky-600 dark:text-sky-400">
                  CHAPTER {activeChapter.chapterNumber} / 04
                </span>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Badge
                  variant={
                    activeIdx === 0 ? 'neutral' : activeIdx === 1 ? 'info' : activeIdx === 2 ? 'warning' : 'danger'
                  }
                  size="sm"
                >
                  {activeIdx === 0
                    ? 'PUBLIC BUS FLEET'
                    : activeIdx === 1
                    ? 'RAPID URBAN TRANSIT'
                    : activeIdx === 2
                    ? 'ACADEMIC ATTESTATION'
                    : 'STATE REGULATORY OVERSIGHT'}
                </Badge>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {activeChapter.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                {activeChapter.subtitle}
              </p>
            </div>

            {/* Contextual Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {activeChapter.actions.map((act, aIdx) => (
                <Link key={aIdx} to={act.to}>
                  <Button variant={act.variant} size="sm">
                    {act.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Centerpiece: Large Clean Isolated Subject (Uncropped, object-fit: contain) */}
          <div className="w-full rounded-3xl bg-slate-50/70 dark:bg-[#111722]/80 border border-slate-100 dark:border-slate-800/80 p-4 sm:p-8 flex items-center justify-center min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] overflow-hidden relative group">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.02] to-transparent pointer-events-none" />

            <picture className="w-full h-full flex items-center justify-center max-h-[360px] sm:max-h-[420px]">
              <source media="(max-width: 768px)" srcSet={activeChapter.mobileAsset} />
              <img
                src={activeChapter.desktopAsset}
                alt={activeChapter.alt}
                className="w-full max-h-[340px] sm:max-h-[400px] object-contain select-none transition-transform duration-500 group-hover:scale-[1.01]"
                loading="eager"
              />
            </picture>

            {/* Discreet Counter Overlay */}
            <div className="absolute top-4 right-4 text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-800/50">
              {activeChapter.chapterNumber} / 04
            </div>
          </div>

          {/* Narrative & Capabilities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeChapter.heading}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {activeChapter.description}
              </p>

              {/* Feature Capability Tags */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Core Architectural Capabilities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeChapter.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Level Spec Stats */}
              <div className="grid grid-cols-3 gap-3 pt-3">
                {activeChapter.stats.map((s, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center"
                  >
                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 block uppercase tracking-wider">
                      {s.label}
                    </span>
                    <span className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-1 block">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Column: Verification Workflow & Route Example */}
            <div className="lg:col-span-5 space-y-6">
              {/* Step-by-Step Verification Workflow Mockup */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400">
                    VERIFICATION PROTOCOL FLOW
                  </span>
                  <Badge variant="success" size="sm">0.3s SCAN</Badge>
                </div>

                <div className="space-y-2.5 text-xs">
                  {activeChapter.verificationWorkflow.map((wf) => (
                    <div
                      key={wf.step}
                      className="flex items-start space-x-3 p-2.5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850"
                    >
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                        {wf.step}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{wf.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-snug">
                          {wf.desc}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Realistic Route Corridor Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent border border-sky-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                    CORRIDOR EXAMPLE
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {activeChapter.routeExample.subsidyRate}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeChapter.routeExample.from} &harr; {activeChapter.routeExample.to}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeChapter.routeExample.corridor}
                </p>
                <div className="pt-2 border-t border-sky-500/20 flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-400">Standard: {activeChapter.routeExample.standardFare}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Student Concession: {activeChapter.routeExample.concessionFare}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4. CHAPTER NAVIGATION CONTROLS (PREVIOUS / NEXT) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-md">
          <button
            onClick={handlePrev}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>
              Previous ({TRANSPORT_CHAPTERS[activeIdx === 0 ? TRANSPORT_CHAPTERS.length - 1 : activeIdx - 1].name})
            </span>
          </button>

          {/* Middle Indicator: 01 ─── 02 ─── 03 ─── 04 */}
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
            {TRANSPORT_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`flex items-center space-x-1.5 cursor-pointer py-1 ${
                  activeIdx === idx ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span>{ch.chapterNumber}</span>
                {idx < TRANSPORT_CHAPTERS.length - 1 && (
                  <span className="text-slate-300 dark:text-slate-700">&mdash;</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <span>
              Next ({TRANSPORT_CHAPTERS[activeIdx === TRANSPORT_CHAPTERS.length - 1 ? 0 : activeIdx + 1].name})
            </span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* 5. NEXT STEP TRANSITION BANNER */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-500/20 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Discover Kerala Transit Corridors
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            View interactive GPS maps, intermediate stages, and student concession subsidies along gazetted state routes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/routes">
              <Button variant="primary" size="md">
                Explore Transit Routes &rarr;
              </Button>
            </Link>
            <Link to="/student/apply">
              <Button variant="outline" size="md">
                Get Your Pass
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
