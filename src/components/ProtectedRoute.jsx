import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * - Redirects unauthenticated visitors to /login with return location
 * - Enforces role-based clearance (Student, Institution, Verifier, RTO)
 * - Redirects wrong-role users to their authorized portal
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-3 border-sky-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-slate-400">Verifying security credentials...</span>
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect directly to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Enforcement
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user?.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
    
    // Check if role matches or user is ADMIN
    const hasClearance = normalizedAllowed.includes(userRole) || userRole === 'ADMIN';

    if (!hasClearance) {
      // Send them to their authorized role portal
      if (userRole === 'VERIFIER') return <Navigate to="/verifier" replace />;
      if (userRole === 'RTO') return <Navigate to="/rto" replace />;
      if (userRole === 'INSTITUTION') return <Navigate to="/institution" replace />;
      return <Navigate to="/student" replace />;
    }
  }

  return children;
}

