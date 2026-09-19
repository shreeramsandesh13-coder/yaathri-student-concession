import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * DarkVeilBackground:
 * React Bits-style "Dark Veil" animated WebGL background.
 * - Deep obsidian/navy base (#05070B / #070A10) with volumetric fluid veil waves
 * - Swirling currents of electric blue, cyan, deep indigo, and subtle violet
 * - Subtly reactive to pointer position with smooth localized ripple and luminescence
 * - Autonomous organic flow on mobile/touch
 * - Adapts gracefully to light mode (warm ivory mist with faint cyan breeze)
 * - Built-in film grain texture to eliminate banding
 * - Respects prefers-reduced-motion
 */
export default function DarkVeilBackground() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId = null;
    let isMounted = true;

    // Check prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;
    const handleMotionChange = (e) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap DPR at 1.5 for great performance
      const w = window.innerWidth;
      const h = window.innerHeight;
      const targetW = Math.floor(w * dpr);
      const targetH = Math.floor(h * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }

    syncSize();
    window.addEventListener('resize', syncSize);

    const gl = canvas.getContext('webgl', { powerPreference: 'high-performance', alpha: false }) ||
               canvas.getContext('experimental-webgl', { alpha: false });

    if (!gl) {
      console.warn("WebGL not supported, falling back to CSS dark background");
      return () => {
        window.removeEventListener('resize', syncSize);
        reducedMotionQuery.removeEventListener('change', handleMotionChange);
      };
    }

    const vs = `attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_is_dark;
uniform float u_reduced_motion;

varying vec2 v_uv;

// Simplex-style procedural noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

// Multi-octave domain-warped fractional Brownian motion
float fbmVeil(vec2 p, float speed) {
  float val = 0.0;
  float amp = 0.52;
  mat2 r = rot(0.42);
  for (int i = 0; i < 4; i++) {
    val += amp * snoise(p);
    p = r * p * 2.05 + vec2(speed * 0.15, -speed * 0.12);
    amp *= 0.48;
  }
  return val;
}

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

  // Time rate based on motion settings
  float speedFactor = u_reduced_motion > 0.5 ? 0.03 : 0.16;
  float t = u_time * speedFactor;

  // Normalized mouse coordinates
  vec2 mouseUV = (u_mouse - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  vec2 toMouse = uv - mouseUV;
  float distMouse = length(toMouse);
  float mouseForce = smoothstep(0.42, 0.0, distMouse);

  // Gentle localized fluid distortion from cursor
  vec2 mouseDistort = normalize(toMouse + 1e-4) * mouseForce * 0.08;
  uv += mouseDistort;

  // Layer 1: Ethereal flowing veil waves (Primary flow)
  vec2 waveP = uv * 1.6;
  waveP.y += sin(waveP.x * 2.4 + t * 1.5) * 0.18;
  waveP.x += cos(waveP.y * 2.0 - t * 1.2) * 0.14;
  float veil1 = fbmVeil(waveP + vec2(t * 0.35, t * 0.2), t);

  // Layer 2: Swirling secondary currents
  vec2 swirlP = rot(0.65) * (uv * 2.2 + vec2(-t * 0.25, t * 0.15));
  float veil2 = fbmVeil(swirlP, t * 1.3);

  // Combine fluid ribbons
  float combinedVeil = veil1 * 0.65 + veil2 * 0.35;
  combinedVeil = smoothstep(-0.25, 0.75, combinedVeil);

  // Tactile film grain
  float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.022;

  // Dark Mode Palette:
  // Base: #05070B (#070A10)
  vec3 darkBase = vec3(0.019, 0.027, 0.043);
  vec3 darkNavy = vec3(0.035, 0.055, 0.094);
  vec3 darkBlue = vec3(0.020, 0.12, 0.26);
  vec3 electricCyan = vec3(0.00, 0.72, 0.95);
  vec3 subtleViolet = vec3(0.24, 0.08, 0.42);

  // Color gradient mix for Dark Veil
  vec3 darkColor = darkBase;
  darkColor = mix(darkColor, darkNavy, smoothstep(-0.4, 0.4, uv.y));
  darkColor = mix(darkColor, darkBlue, combinedVeil * 0.38);
  darkColor = mix(darkColor, electricCyan, pow(combinedVeil, 2.4) * 0.28);
  darkColor = mix(darkColor, subtleViolet, pow(veil2, 3.0) * 0.16);

  // Mouse luminous aura trail
  darkColor += electricCyan * (mouseForce * 0.12);

  // Light Mode Palette (warm ivory base with whisper-soft cyan breeze):
  vec3 lightBase = vec3(0.973, 0.980, 0.988); // #f8fafc
  vec3 lightMist = vec3(0.945, 0.958, 0.975);
  vec3 lightCyan = vec3(0.65, 0.82, 0.94);
  vec3 lightSky = vec3(0.82, 0.89, 0.96);

  vec3 lightColor = mix(lightBase, lightMist, st.y * 0.4 + st.x * 0.2);
  lightColor = mix(lightColor, lightCyan, combinedVeil * 0.12);
  lightColor = mix(lightColor, lightSky, pow(veil1, 2.0) * 0.08);
  lightColor += lightCyan * (mouseForce * 0.04);

  // Blend between dark & light according to u_is_dark
  vec3 finalColor = mix(lightColor, darkColor, u_is_dark);

  // Subtle vignette to focus center on the Concession Pass
  float vignette = smoothstep(1.3, 0.25, length(st - 0.5));
  finalColor = mix(finalColor * 0.88, finalColor, vignette);

  // Add film grain
  finalColor += grain;

  gl_FragColor = vec4(finalColor, 1.0);
}`;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uIsDark = gl.getUniformLocation(prog, 'u_is_dark');
    const uReducedMotion = gl.getUniformLocation(prog, 'u_reduced_motion');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    let targetMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const nx = (clientX - rect.left) / rect.width;
        const ny = 1.0 - (clientY - rect.top) / rect.height;
        targetMouse.x = nx * (rect.width * dpr);
        targetMouse.y = ny * (rect.height * dpr);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    let darkVal = isDark ? 1.0 : 0.0;

    function render(t) {
      if (!isMounted) return;

      // Smooth mouse lerp
      mouse.x += (targetMouse.x - mouse.x) * 0.06;
      mouse.y += (targetMouse.y - mouse.y) * 0.06;

      // Smooth dark/light transition
      const targetDark = isDark ? 1.0 : 0.0;
      darkVal += (targetDark - darkVal) * 0.08;

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uIsDark) gl.uniform1f(uIsDark, darkVal);
      if (uReducedMotion) gl.uniform1f(uReducedMotion, isReducedMotion ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [isDark]);

  return (
    <>
      {/* 1. Animated WebGL Canvas Layer */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none -z-20 transition-colors duration-500"
        style={{
          backgroundColor: isDark ? '#05070B' : '#f8fafc',
        }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full pointer-events-none"
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>

      {/* 2. Atmospheric Dark Vignette Overlay (keeps 15-30% background intensity so card is HERO) */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 30%, transparent 40%, rgba(5,7,11,0.65) 100%)'
            : 'radial-gradient(ellipse at 50% 30%, transparent 50%, rgba(248,250,252,0.5) 100%)',
        }}
      />
    </>
  );
}

