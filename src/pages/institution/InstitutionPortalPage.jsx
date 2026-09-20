import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminView from '../../components/AdminView';
import Button from '../../components/ui/Button';

/**
 * INSTITUTION PORTAL PAGE (/institution/*)
 * Manages incoming student concession applications, document reviews, and collegiate approvals.
 */
export default function InstitutionPortalPage() {
  const { isInstitution, isAdmin, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || (!isInstitution && !isAdmin)) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-white dark:bg-[#0B111D] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl my-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">domain_disabled</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Institution Clearance Required
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
          Please sign in with accredited college registrar or dean credentials to access the institution desk.
        </p>
        <Link to="/login" className="block">
          <Button variant="primary" size="md" className="w-full">
            Sign In to Institution Desk &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      <AdminView />
    </div>
  );
}

