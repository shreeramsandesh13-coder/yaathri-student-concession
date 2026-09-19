import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import jsQR from 'jsqr';
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
  Calendar,
  Building,
  Hash,
  Award,
  Power,
  RotateCcw,
  Sparkles,
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
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        await videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err) {
      console.warn('Camera initialization failed:', err);
      setCameraError(
        'Unable to access video camera. Please verify camera permissions in your browser or use Manual Code Key-In.'
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
          // Found QR payload!
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

    // Haptic feedback if supported
    if (navigator.vibrate) {
      navigator.vibrate(80);
    }

    try {
      const res = await api.verifier.verifyPass(rawPayload);
      setVerdict(res);
      loadHistory(); // Refresh shift log
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
    if (type === 'METRO') return <Train className="w-5 h-5 text-emerald-400" />;
    return <Bus className="w-5 h-5 text-amber-400" />;
  };

  const isSuspended = profile?.status === 'SUSPENDED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Hidden processing canvas for jsQR */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Conductor Portal Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              Y
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                  Conductor Portal
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">യാത്രി കണ്ടക്ടർ</span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                {profile?.operator_name || 'Kerala State Transport Network'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Verifier Identity & Vehicle Badge */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {profileLoading ? (
            <div className="flex items-center gap-3 text-slate-400 py-4 animate-pulse">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading authorized verifier profile...</span>
            </div>
          ) : isSuspended ? (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-300 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-200">Verifier Authorization Suspended</h4>
                <p className="text-xs text-rose-300/80 mt-1">
                  Your verifier credential ({profile?.verifier_code}) is suspended by Kerala RTO / Transport
                  Authority. Scan operations are disabled until restored by depot operations.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                  {transportIcon()}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-300 border border-amber-500/30">
                      ID: {profile?.verifier_code || 'VERIFIER-KL'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ACTIVE ON-DUTY
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {profile?.full_name || user?.email || 'Authorized Conductor'}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Bus className="w-3.5 h-3.5 text-slate-500" />
                      {profile?.bus_number || profile?.station_device_id || 'Vehicle Fleet'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {profile?.assigned_route || 'Kerala Transit Corridor'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      {profile?.depot || 'Central Depot'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                <span className="text-xs text-slate-400">Transport Fleet</span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-white border border-slate-700 mt-0.5">
                  {profile?.transport_type || 'KSRTC'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Verification Center */}
        {!isSuspended && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header with Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  Concession Pass Inspection
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan opaque student QR code or travel token for instant server verification
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  onClick={() => {
                    setScanMode('camera');
                    setVerdict(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    scanMode === 'camera'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Camera
                </button>
                <button
                  onClick={() => {
                    setScanMode('manual');
                    setVerdict(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    scanMode === 'manual'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  Manual
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-300 text-xs flex items-center justify-between">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-rose-400 hover:text-rose-200 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* VERDICT PRESENTATION (If result received) */}
            {verdict ? (
              <div
                className={`rounded-2xl border p-6 transition-all animate-in fade-in zoom-in-95 duration-200 ${
                  verdict.is_valid
                    ? 'bg-emerald-950/40 border-emerald-500/40 shadow-emerald-950/50 shadow-2xl'
                    : 'bg-rose-950/40 border-rose-500/40 shadow-rose-950/50 shadow-2xl'
                }`}
              >
                {/* Result Status Banner */}
                <div className="flex items-center justify-between border-b pb-4 mb-5 border-slate-800/80">
                  <div className="flex items-center gap-3">
                    {verdict.is_valid ? (
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                        <XCircle className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <span
                        className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          verdict.is_valid
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {verdict.result === 'VALID' ? 'VALID CONCESSION' : 'INVALID / REJECTED'}
                      </span>
                      <h4 className="text-xl font-extrabold text-white mt-1">
                        {verdict.is_valid ? 'Authorized for Transit' : 'Pass Verification Rejected'}
                      </h4>
                    </div>
                  </div>

                  <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {verdict.status_code}
                  </span>
                </div>

                {/* Valid Pass Card Details */}
                {verdict.is_valid ? (
                  <div className="space-y-5">
                    {/* Student Identity Card */}
                    <div className="bg-slate-900/80 rounded-xl p-5 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-5">
                      {/* Circular Portrait with Fallback */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-emerald-500/50 shadow-lg overflow-hidden bg-slate-800 flex items-center justify-center">
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
                            className={`w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 ${
                              verdict.student_photo ? 'hidden' : 'flex'
                            }`}
                          >
                            <User className="w-10 h-10 text-emerald-400" />
                          </div>
                        </div>
                        {/* Name explicitly below circular photo */}
                        <span className="text-xs font-semibold text-slate-300 mt-2 text-center">
                          {verdict.roll_number || 'Enrolled Student'}
                        </span>
                      </div>

                      {/* Student Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full">
                        <div>
                          <span className="text-slate-400 block">Student Full Name</span>
                          <span className="font-bold text-white text-base block mt-0.5">
                            {verdict.student_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Pass ID Number</span>
                          <span className="font-mono font-bold text-amber-300 text-sm block mt-0.5">
                            {verdict.pass_number}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Institution / College</span>
                          <span className="font-semibold text-slate-200 block mt-0.5">
                            {verdict.institution}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Course / Class</span>
                          <span className="font-semibold text-slate-200 block mt-0.5">
                            {verdict.class_name}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Authorized Route Corridor</span>
                          <span className="font-semibold text-emerald-300 block mt-0.5">
                            {verdict.assigned_route}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Subsidy Benefit</span>
                          <span className="font-semibold text-amber-300 block mt-0.5">
                            {verdict.subsidy_rate}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Pass Validity Period</span>
                          <span className="font-semibold text-slate-300 block mt-0.5">
                            {verdict.valid_from} → {verdict.valid_until}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Transport Fleet Type</span>
                          <span className="font-semibold text-slate-300 block mt-0.5">
                            {verdict.transport_mode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Server Verification Audit Stamp */}
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>
                          Inspected by: <strong className="text-slate-200">{verdict.verifier_name}</strong> (
                          {verdict.verifier_code})
                        </span>
                      </div>
                      <div>
                        Vehicle: <strong className="text-slate-200">{verdict.vehicle_or_station}</strong> •{' '}
                        {new Date(verdict.verified_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Invalid Pass Details */
                  <div className="space-y-4">
                    <div className="bg-rose-950/50 border border-rose-500/30 rounded-xl p-4 text-rose-200 text-sm">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Failure Reason:</strong>
                          <p className="text-rose-300 mt-1">
                            {verdict.failure_reason || verdict.message || 'Pass validation failed.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block">Scanned Code</span>
                        <span className="font-mono text-slate-200 block truncate mt-0.5">
                          {verdict.pass_number || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Attempted At</span>
                        <span className="text-slate-200 block mt-0.5">
                          {new Date(verdict.verified_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reset Button */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={resetForNextScan}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Scan Next Passenger
                  </button>
                </div>
              </div>
            ) : scanMode === 'camera' ? (
              /* CAMERA SCANNER VIEW */
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-lg mx-auto border-2 border-slate-800 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />

                  {/* Viewfinder Target Overlays */}
                  {isCameraActive && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Reticle Box */}
                      <div className="w-64 h-64 border-2 border-dashed border-amber-400/60 rounded-2xl relative shadow-2xl">
                        {/* Corners */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                        {/* Animated Laser Scanning Line */}
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24] animate-bounce top-1/2" />
                      </div>
                    </div>
                  )}

                  {/* Fallback Camera Error / State */}
                  {!isCameraActive && (
                    <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <Camera className="w-12 h-12 text-slate-600" />
                      <p className="text-xs text-slate-400 max-w-xs">
                        {cameraError || 'Camera is currently idle. Click below to start optical scanning.'}
                      </p>
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
                      >
                        Start Camera Scanner
                      </button>
                    </div>
                  )}

                  {/* Verifying Spinner Overlay */}
                  {isVerifying && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-amber-400 space-y-3 z-10">
                      <RefreshCw className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-bold text-white tracking-wider uppercase">
                        Verifying Pass Cryptography...
                      </span>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                  <span>Aim camera at student card YAATHRI QR</span>
                  <button
                    onClick={toggleCameraFlip}
                    className="flex items-center gap-1 text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Flip Camera
                  </button>
                </div>
              </div>
            ) : (
              /* MANUAL ENTRY VIEW */
              <div className="space-y-4 max-w-lg mx-auto">
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Pass Number, Travel Token, or Institutional ID Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="e.g. SCP-2026-00124 or TT-..."
                        className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={isVerifying || !manualCode.trim()}
                        className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        {isVerifying ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4" />
                        )}
                        Verify Pass
                      </button>
                    </div>
                  </div>

                  {/* Sample one-click test values */}
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 flex-wrap">
                    <span>Quick Test Codes:</span>
                    <button
                      type="button"
                      onClick={() => setManualCode('SCP-2026-00124')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-mono"
                    >
                      SCP-2026-00124 (Valid)
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualCode('YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono"
                    >
                      Permanent ID QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualCode('SCP-2025-00088')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 font-mono"
                    >
                      Expired Pass
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Conductor's Personal Shift Scan History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Shift Verification Log
              </h4>
              <p className="text-xs text-slate-400">
                Live ledger of passes verified on this shift by {profile?.verifier_code || 'verifier'}
              </p>
            </div>
            <button
              onClick={loadHistory}
              disabled={historyLoading}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Refresh Shift Log"
            >
              <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No scans logged on this shift yet. Validated passes will appear here in real-time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2.5 font-semibold">Time</th>
                    <th className="pb-2.5 font-semibold">Pass / Token</th>
                    <th className="pb-2.5 font-semibold">Student Name</th>
                    <th className="pb-2.5 font-semibold">Route</th>
                    <th className="pb-2.5 font-semibold">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {history.map((item) => {
                    const isValid = item.result === 'VALID' || item.status === 'VERIFIED';
                    return (
                      <tr key={item.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-2.5 font-mono text-slate-400">
                          {new Date(item.verified_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5 font-mono text-slate-300">
                          {item.pass_number_scanned}
                        </td>
                        <td className="py-2.5 text-white font-medium">
                          {item.student_name || '—'}
                        </td>
                        <td className="py-2.5 text-slate-400 truncate max-w-[160px]">
                          {item.route_name || item.location || '—'}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              isValid
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {isValid ? 'VALID' : 'INVALID'}
                          </span>
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
    </div>
  );
}
