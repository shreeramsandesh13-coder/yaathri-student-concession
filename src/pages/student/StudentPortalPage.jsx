import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PassView from '../../components/PassView';
import ApplicationTimeline from '../../components/ApplicationTimeline';
import ApplyPassModal from '../../components/ApplyPassModal';
import RenewModal from '../../components/RenewModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { CreditCard, History, PlusCircle, RefreshCw, User, ShieldCheck } from 'lucide-react';

/**
 * STUDENT PORTAL PAGE (/student/*)
 * Real multi-subroute student dashboard with tabbed sub-navigation.
 */
export default function StudentPortalPage({ studentData, timeline, onApplicationSubmitted, onRenewSuccess }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  // Derive subroute from path
  const currentPath = location.pathname;
  const isApplyRoute = currentPath === '/student/apply';
  const isPassRoute = currentPath === '/student/pass';
  const isAppsRoute = currentPath === '/student/applications';
  const isProfileRoute = currentPath === '/student/profile';

  // If user is not authenticated, prompt to sign in
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 bg-white dark:bg-[#0B111D] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl my-12 space-y-6">
        <div className="w-16 h-16 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Student Authentication Required
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
          Please sign in to view your personalized digital concession pass, travel tokens, and application status.
        </p>
        <Link to="/login" className="block">
          <Button variant="primary" size="md" className="w-full">
            Sign In / Register &rarr;
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Sub-route Tab Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Link
            to="/student"
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              currentPath === '/student'
                ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Dashboard
          </Link>

          <Link
            to="/student/pass"
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              isPassRoute
                ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Digital Pass &amp; Tokens
          </Link>

          <Link
            to="/student/applications"
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              isAppsRoute
                ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            Applications &amp; Timeline
          </Link>

          <Link
            to="/student/profile"
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              isProfileRoute
                ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Student Profile
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRenewModalOpen(true)}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Renew Pass
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsApplyModalOpen(true)}
            icon={<PlusCircle className="w-3.5 h-3.5" />}
          >
            Apply Concession
          </Button>
        </div>
      </div>

      {/* Sub-route Content */}
      {isAppsRoute ? (
        <div className="space-y-6">
          <ApplicationTimeline timeline={timeline} studentData={studentData} />
        </div>
      ) : isProfileRoute ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xl">
              {studentData?.name ? studentData.name[0] : 'S'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{studentData?.name || user?.email}</h3>
              <p className="text-xs text-slate-500 font-mono">{studentData?.rollNo} &bull; {studentData?.college}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-slate-400 block text-[10px]">Academic Course</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{studentData?.course || 'B.Tech'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900">
              <span className="text-slate-400 block text-[10px]">Institutional QR</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">{studentData?.institutionalQrCode}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Default Dashboard / Pass view */
        <div className="space-y-8">
          <PassView studentData={studentData} />
          <ApplicationTimeline timeline={timeline} studentData={studentData} />
        </div>
      )}

      {/* Apply Modal */}
      <ApplyPassModal
        isOpen={isApplyModalOpen || isApplyRoute}
        onClose={() => {
          setIsApplyModalOpen(false);
          if (isApplyRoute) navigate('/student');
        }}
        onSubmittedApplication={(data) => {
          if (onApplicationSubmitted) onApplicationSubmitted(data);
          setIsApplyModalOpen(false);
          navigate('/student/applications');
        }}
      />

      {/* Renew Modal */}
      <RenewModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        studentData={studentData}
        onRenewSuccess={() => {
          if (onRenewSuccess) onRenewSuccess();
          setIsRenewModalOpen(false);
        }}
      />

    </div>
  );
}

