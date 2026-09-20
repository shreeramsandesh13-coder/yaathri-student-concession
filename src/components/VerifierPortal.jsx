import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import jsQR from 'jsqr';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Input from './ui/Input';
import {
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Bus,
  Train,
  ShieldCheck,
  User,
  MapPin,
  Clock,
  Building,
  Hash,
  Power,
  RotateCcw,
} from 'lucide-react';

export default function VerifierPortal() {
  const { user, verifier, logout } = useAuth();

  // Verifier Profile
  const [profile, setProfile] = useState(verifier || null);
  const [profileLoading, setProfileLoading] = useState(!verifier);

  // Scan Mode: 'camera' | 'manual'
  const [scanMode, setScanMode] = useState('camera');
  const [manualCode, setManualCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Verification Verdict
  const [verdict, setVerdict] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [autoReturnSeconds, setAutoReturnSeconds] = useState(null);

  // Auto-return timer to READY TO SCAN after verification
  useEffect(() => {
    if (verdict) {
      setAutoReturnSeconds(5);
      const timer = setInterval(() => {
        setAutoReturnSeconds((s) => {
          if (s <= 1) {
            clearInterval(timer);
            resetForNextScan();
            return null;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setAutoReturnSeconds(null);
    }
  }, [verdict]);

  // Shift History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Camera Refs & State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'

  // Load Verifier Profile & History on Mount
  useEffect(() => {
    loadProfile();
    loadHistory();
    return () => {
      stopCamera();
    };
  }, []);

  async function loadProfile() {
    try {
      setProfileLoading(true);
      const res = await api.verifier.getProfile();
      setProfile(res);
    } catch (err) {
      console.warn('Could not load verifier profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }

  async function loadHistory() {
    try {
      setHistoryLoading(true);
      const logs = await api.verifier.getHistory();
      setHistory(logs);
    } catch (err) {
      console.warn('Could not load verifier history:', err);
    } finally {
      setHistoryLoading(false);
    }
  }

  // Camera Management
  useEffect(() => {
    if (scanMode === 'camera' && !verdict) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [scanMode, verdict, facingMode]);

  async function startCamera() {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.warn('Camera initialization failed:', err);
      setCameraError(
        'Camera access denied or unavailable. Please grant camera permissions or use Manual Pass Entry below.'
      );
      setIsCameraActive(false);
    }
  }

  function stopCamera() {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }

  function toggleCameraFlip() {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  }

  // Continuous Frame QR Decoder
  function tickScan() {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data && code.data.trim()) {
          stopCamera();
          triggerVerification(code.data.trim());
          return;
        }
      }
    }
    animFrameIdRef.current = requestAnimationFrame(tickScan);
  }

  async function triggerVerification(rawPayload) {
    if (!rawPayload || isVerifying) return;
    setIsVerifying(true);
    setErrorMsg(null);
    setVerdict(null);

    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    try {
      const res = await api.verifier.verifyPass(rawPayload);
      setVerdict(res);
      loadHistory();
    } catch (err) {
      setErrorMsg(err.message || 'Pass verification service rejected request.');
    } finally {
      setIsVerifying(false);
    }
  }

  function handleManualSubmit(e) {
    e.preventDefault();
    if (!manualCode.trim()) return;
    triggerVerification(manualCode.trim());
  }

  function resetForNextScan() {
    setVerdict(null);
    setErrorMsg(null);
    setManualCode('');
    if (scanMode === 'camera') {
      startCamera();
    }
  }

  const transportIcon = () => {
    const type = profile?.transport_type || 'KSRTC';
    if (type === 'METRO') return <Train className="w-5 h-5 text-emerald-500" />;
    return <Bus className="w-5 h-5 text-amber-500" />;
  };

  const isSuspended = profile?.status === 'SUSPENDED';

  return (
    <div className="space-y-6">
      {/* Hidden processing canvas for jsQR */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Conductor Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-[#0B111D]/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black text-xl shrink-0 shadow-md shadow-amber-500/20">
            Y
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="sm">FIELD CONDUCTOR TERMINAL</Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">യാത്രി കണ്ടക്ടർ</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              {profile?.operator_name || 'Kerala State Transport Network'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {profile?.full_name || user?.email || 'Authorized Conductor'}
            </span>
            <span className="text-[10px] text-amber-500 dark:text-amber-400 uppercase font-mono tracking-wider">
              {profile?.verifier_code || 'VERIFIER-KL'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            icon={<Power className="w-3.5 h-3.5" />}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Profile & Vehicle Header Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />

        {profileLoading ? (
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 py-4 animate-pulse">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
            <span>Loading authorized conductor profile...</span>
          </div>
        ) : isSuspended ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-rose-700 dark:text-rose-200">Verifier Authorization Suspended</h4>
              <p className="text-xs text-rose-600/90 dark:text-rose-300/80 mt-1">
                Your verifier credential ({profile?.verifier_code}) is suspended by Kerala RTO / Transport Authority. Scan operations are disabled until restored by depot operations.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                {transportIcon()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-slate-200 dark:border-slate-700">
                    ID: {profile?.verifier_code || 'VERIFIER-KL'}
                  </span>
                  <Badge variant="success" size="sm" dot>ON-DUTY</Badge>
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {profile?.full_name || user?.email || 'Authorized Conductor'}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-0.5 font-mono">
                  <span className="flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5 text-slate-400" />
                    {profile?.bus_number || profile?.station_device_id || 'Vehicle Fleet'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile?.assigned_route || 'Kerala Transit Corridor'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {profile?.depot || 'Central Depot'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">Transport Fleet</span>
              <span className="text-xs font-black px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 mt-1">
                {profile?.transport_type || 'KSRTC'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Verification Terminal */}
      {!isSuspended && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          
          {/* Header & Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="warning" size="sm">CONDUCTOR MODE</Badge>
                <span className="text-[11px] font-mono text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  READY TO SCAN
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight mt-1">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                [ SCAN ID CARD ]
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                Quick verification for spot checks and concession validation. Conductor scans only when verification is required.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {['Spot checks', 'Expired pass checks', 'Route mismatch', 'Unclear concession', 'Inspection', 'Concession validation'].map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
              <button
                onClick={() => {
                  setScanMode('camera');
                  setVerdict(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  scanMode === 'camera'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Live Camera
              </button>
              <button
                onClick={() => {
                  setScanMode('manual');
                  setVerdict(null);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  scanMode === 'manual'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                Manual Key-In
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-200 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* VERDICT PRESENTATION */}
          {verdict ? (
            <div
              className={`rounded-3xl border p-6 sm:p-8 transition-all animate-in fade-in zoom-in-95 duration-200 ${
                verdict.is_valid
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/30 border-emerald-500/40 shadow-xl dark:shadow-emerald-950/40'
                  : 'bg-rose-500/5 dark:bg-rose-950/30 border-rose-500/40 shadow-xl dark:shadow-rose-950/40'
              }`}
            >
              {/* Result Status Banner */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-5 mb-6">
                <div className="flex items-center gap-4">
                  {verdict.is_valid ? (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 dark:text-rose-400 shrink-0">
                      <XCircle className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <Badge variant={verdict.is_valid ? 'success' : 'danger'} size="sm">
                      {verdict.is_valid ? 'SPOT CHECK CLEARED' : 'VALIDATION REJECTED'}
                    </Badge>
                    <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                      {verdict.is_valid ? '✓ VALID STUDENT PASS' : '✕ PASS NOT VALID'}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">Status</span>
                  <span className="font-mono text-xs px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold block mt-0.5">
                    {verdict.is_valid ? (verdict.status || 'ACTIVE PASS') : (verdict.status_code || 'INVALID')}
                  </span>
                </div>
              </div>

              {/* Valid Pass Card Details */}
              {verdict.is_valid ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-white/60 dark:bg-[#0B111D]/80 border border-emerald-500/20 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    {/* Student Portrait */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-24 h-24 rounded-2xl border-4 border-emerald-500/40 shadow-lg overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        {verdict.student_photo ? (
                          <img
                            src={verdict.student_photo}
                            alt={verdict.student_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 ${
                            verdict.student_photo ? 'hidden' : 'flex'
                          }`}
                        >
                          <User className="w-10 h-10 text-emerald-500" />
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-2 text-center">
                        ID: {verdict.roll_number || verdict.student_id || 'ENROLLED STUDENT'}
                      </span>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs w-full">
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Student Name</span>
                        <span className="font-black text-slate-900 dark:text-white text-base block mt-0.5">
                          {verdict.student_name}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Student ID (Roll Number)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-sm block mt-0.5">
                          {verdict.roll_number || verdict.student_id || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Institution</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                          {verdict.institution}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Route Corridor</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          {verdict.assigned_route}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Validity</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 block mt-0.5">
                          {verdict.valid_from} &rarr; {verdict.valid_until}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 uppercase font-mono text-[10px] block">Pass Status</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                          {verdict.status || 'ACTIVE'} &bull; {verdict.subsidy_rate || 'Authorized Concession'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audit Stamp */}
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span>
                        Verified by: <strong className="text-slate-900 dark:text-white">{verdict.verifier_name}</strong> ({verdict.verifier_code})
                      </span>
                    </div>
                    <div>
                      Vehicle / Gate: <strong className="text-slate-900 dark:text-white">{verdict.vehicle_or_station}</strong> &bull; {new Date(verdict.verified_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ) : (
                /* Invalid Pass */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Failure Reason:</strong>
                        <p className="text-rose-600 dark:text-rose-300 mt-1 font-semibold">
                          {verdict.failure_reason || verdict.message || 'Expired, Invalid credential, Route mismatch, or Suspended pass.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                    <span className="block font-mono text-[10px] text-slate-400">VERIFICATION NOTE</span>
                    <span>No personal information is exposed for unverified or invalid scans.</span>
                  </div>
                </div>
              )}

              {/* Auto-Return Countdown & Manual Reset */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  Returning to READY TO SCAN in {autoReturnSeconds || 5}s...
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={resetForNextScan}
                  icon={<RotateCcw className="w-4 h-4" />}
                >
                  Scan Next ID Card &rarr;
                </Button>
              </div>
            </div>
          ) : scanMode === 'camera' ? (
            /* CAMERA SCANNER VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs px-2">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 uppercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  [ SCAN ID CARD ] — Camera Ready
                </span>
                <span className="text-slate-400 text-[11px]">Align ID-card QR within frame</span>
              </div>

              <div className="relative rounded-3xl overflow-hidden bg-black aspect-video max-w-lg mx-auto border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />

                {/* Viewfinder Target Overlays */}
                {isCameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-amber-400/60 rounded-3xl relative shadow-2xl">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-bounce top-1/2" />
                    </div>
                  </div>
                )}

                {/* Fallback Camera State */}
                {!isCameraActive && (
                  <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Camera className="w-12 h-12 text-slate-600" />
                    <p className="text-xs text-slate-400 max-w-xs">
                      {cameraError || 'Camera is currently paused or inactive. Click below to start optical scanning.'}
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={startCamera}
                    >
                      Start Camera Scanner
                    </Button>
                  </div>
                )}

                {/* Verifying Spinner Overlay */}
                {isVerifying && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 space-y-3 z-10">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                    <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                      Verifying Token Cryptography...
                    </span>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
                <span>Align QR within the optical guide frame</span>
                <button
                  onClick={toggleCameraFlip}
                  className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer font-bold text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Flip Camera
                </button>
              </div>
            </div>
          ) : (
            /* MANUAL ENTRY VIEW */
            <div className="space-y-4 max-w-lg mx-auto">
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Concession Pass Number or Travel Token
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="e.g. SCP-2026-00124 or TT-..."
                      className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isVerifying || !manualCode.trim()}
                      icon={isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {/* Quick Test Values */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block uppercase">
                    Quick Test Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setManualCode('SCP-2026-00124')}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                    >
                      SCP-2026-00124 (Active Pass)
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualCode('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012')}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                    >
                      Permanent ID QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualCode('SCP-2025-00088')}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-300 font-mono text-xs transition-colors cursor-pointer"
                    >
                      SCP-2025-00088 (Expired)
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Conductor's Personal Shift Scan History */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Clock className="w-4 h-4 text-slate-500" />
              SHIFT VERIFICATION LEDGER
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live inspection history recorded for device {profile?.verifier_code || 'VERIFIER'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadHistory}
            disabled={historyLoading}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${historyLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-mono">
            No scans recorded during this shift yet. Validated passes will stream here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Pass / Token</th>
                  <th className="pb-3 font-semibold">Passenger Name</th>
                  <th className="pb-3 font-semibold">Route Corridor</th>
                  <th className="pb-3 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {history.map((item) => {
                  const isValid = item.result === 'VALID' || item.status === 'VERIFIED';
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(item.verified_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.pass_number_scanned}
                      </td>
                      <td className="py-3 text-slate-900 dark:text-white font-bold">
                        {item.student_name || '—'}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {item.route_name || item.location || '—'}
                      </td>
                      <td className="py-3">
                        <Badge variant={isValid ? 'success' : 'danger'} size="sm">
                          {isValid ? 'VALID' : 'INVALID'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
