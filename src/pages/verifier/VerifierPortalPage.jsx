import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VerifierPortal from '../../components/VerifierPortal';
import Button from '../../components/ui/Button';

/**
 * VERIFIER PORTAL PAGE (/verifier/*)
 * High-speed optical camera scanner and shift history for KSRTC conductors and Metro gate operators.
 */
export default function VerifierPortalPage() {
  const { isVerifier, isAuthenticated } = useAuth();

  if (!isAuthenticated || !isVerifier) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-white dark:bg-[#0B111D] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl my-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Conductor Terminal Authentication
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
          Please sign in with licensed KSRTC or Kochi Metro verifier credentials to activate the handheld scanner.
        </p>
        <Link to="/login" className="block">
          <Button variant="primary" size="md" className="w-full">
            Sign In to Verifier Terminal &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6">
      <VerifierPortal />
    </div>
  );
}

