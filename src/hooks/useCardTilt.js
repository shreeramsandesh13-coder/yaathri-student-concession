import { useRef, useState, useEffect, useCallback } from 'react';

/**
 * useCardTilt hook:
 * Provides glitch-free, mathematically stable 3D physics tilt for cards.
 * - Decouples pointer tracking from the transformed element
 * - Employs a non-transformed reference wrapper for getBoundingClientRect()
 * - Strictly clamps rotation angles (rotateX: ±8deg, rotateY: ±10deg)
 * - Uses smooth requestAnimationFrame lerp interpolation with spring-back decay
 */
export function useCardTilt() {
  const wrapperRef = useRef(null);
  const glareRef = useRef(null);
  const auraRef = useRef(null);
  const animFrameId = useRef(null);

  // Targets (where mouse wants card to go)
  const targetRef = useRef({ x: 0, y: 0, z: 0, glareX: 50, glareY: 50, isHovered: false });
  
  // Current interpolated values
  const currentRef = useRef({ x: 0, y: 0, z: 0, glareOpacity: 0.15, auraScale: 1, auraOpacity: 0.5 });
  
  // Render state for React
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
  });

  const updatePhysics = useCallback(() => {
    const target = targetRef.current;
    const current = currentRef.current;

    // Smooth spring lerp factor
    const lerpFactor = 0.12;

    current.x += (target.x - current.x) * lerpFactor;
    current.y += (target.y - current.y) * lerpFactor;
    current.z += (target.z - current.z) * lerpFactor;

    const targetGlareOpacity = target.isHovered ? 0.45 : 0.15;
    current.glareOpacity += (targetGlareOpacity - current.glareOpacity) * lerpFactor;

    const targetAuraScale = target.isHovered ? 1.08 : 1.0;
    const targetAuraOpacity = target.isHovered ? 0.85 : 0.55;
    current.auraScale += (targetAuraScale - current.auraScale) * lerpFactor;
    current.auraOpacity += (targetAuraOpacity - current.auraOpacity) * lerpFactor;

    // Update style state
    setTiltStyle({
      transform: `rotateX(${current.x.toFixed(2)}deg) rotateY(${current.y.toFixed(2)}deg) translateZ(${current.z.toFixed(2)}px)`,
    });

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${target.glareX.toFixed(1)}% ${target.glareY.toFixed(1)}%, rgba(255,255,255,0.45) 0%, rgba(56,189,248,0.3) 35%, transparent 70%)`;
      glareRef.current.style.opacity = current.glareOpacity.toFixed(2);
    }

    if (auraRef.current) {
      const auraX = (current.y / 10) * 18;
      const auraY = (-current.x / 8) * 18;
      auraRef.current.style.transform = `translate(${auraX.toFixed(1)}px, ${auraY.toFixed(1)}px) scale(${current.auraScale.toFixed(2)})`;
      auraRef.current.style.opacity = current.auraOpacity.toFixed(2);
    }

    // Continue loop if moving or hovered
    const isMoving =
      Math.abs(target.x - current.x) > 0.01 ||
      Math.abs(target.y - current.y) > 0.01 ||
      Math.abs(target.z - current.z) > 0.01 ||
      target.isHovered;

    if (isMoving) {
      animFrameId.current = requestAnimationFrame(updatePhysics);
    }
  }, []);

  const startLoop = useCallback(() => {
    if (!animFrameId.current) {
      animFrameId.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  const handlePointerMove = useCallback((e) => {
    if (!wrapperRef.current) return;

    // Measure against the stable, non-transformed wrapper
    const rect = wrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Strict clamping to avoid extreme angles or edge tremors
    // rotateX: -8deg to +8deg
    const rawX = ((y - centerY) / centerY) * -8;
    const clampedX = Math.max(-8, Math.min(8, rawX));

    // rotateY: -10deg to +10deg
    const rawY = ((x - centerX) / centerX) * 10;
    const clampedY = Math.max(-10, Math.min(10, rawY));

    targetRef.current = {
      x: clampedX,
      y: clampedY,
      z: 14, // lifts toward user
      glareX: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      glareY: Math.max(0, Math.min(100, (y / rect.height) * 100)),
      isHovered: true,
    };

    startLoop();
  }, [startLoop]);

  const handlePointerLeave = useCallback(() => {
    targetRef.current = {
      x: 0,
      y: 0,
      z: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    };
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return {
    wrapperRef,
    glareRef,
    auraRef,
    tiltStyle,
    handlePointerMove,
    handlePointerLeave,
  };
}

