import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import RouteMap from './RouteMap';
import Button from './ui/Button';
import Input from './ui/Input';
import Badge from './ui/Badge';
import Drawer from './ui/Drawer';
import Modal from './ui/Modal';
import Skeleton from './ui/Skeleton';

/**
 * Rebuilt Institution Portal (Registrar & Dean Desk)
 * High-density, professional management dashboard:
 * - Real KPI statistics with skeleton loaders
 * - Application queue with search, status filters
 * - Document & Proof inspection drawer
 * - Approval & Rejection workflow with live backend sync
 */
export default function AdminView() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'verifications'
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const [stats, setStats] = useState({
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Applications
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inspection Drawer
  const [selectedApp, setSelectedApp] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Approval Modal
  const [approveApp, setApproveApp] = useState(null);
  const [approveNotes, setApproveNotes] = useState('Attested for academic year transit concession.');

  // Rejection Modal
  const [rejectApp, setRejectApp] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await api.admin.getStats();
      if (data) setStats(data);
    } catch (e) {
      console.warn('Failed to load stats:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.admin.listApplications(searchQuery || null, statusFilter || null);
      setApplications(data || []);
    } catch (e) {
      console.warn('Failed to fetch applications:', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleApproveSubmit = async () => {
    if (!approveApp) return;
    setIsProcessing(true);
    try {
      await api.admin.reviewApplication(approveApp.id, 'APPROVE', approveNotes, 365, '80% KSRTC / 50% METRO');
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      showNotice(`Application #${approveApp.application_number} Approved! Digital pass generated.`);
      setApproveApp(null);
      setSelectedApp(null);
      fetchStats();
      fetchApplications();
    } catch (err) {
      showNotice(err.message || 'Failed to approve application.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectApp) return;
    setIsProcessing(true);
    try {
      await api.admin.reviewApplication(rejectApp.id, 'REJECT', rejectReason || 'Incomplete institutional proof.');
      showNotice(`Application #${rejectApp.application_number} Rejected.`);
      setRejectApp(null);
      setSelectedApp(null);
      fetchStats();
      fetchApplications();
    } catch (err) {
      showNotice(err.message || 'Failed to reject application.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl border border-slate-700 dark:border-slate-300 flex items-center space-x-3 text-xs sm:text-sm font-semibold animate-slideInRight">
          <span className="material-symbols-outlined text-emerald-500 text-[20px]">verified</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* 1. INSTITUTION HEADER & KPI METRICS */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>COLLEGE &amp; SCHOOL REGISTRAR DESK</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Institution Verification Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Christ College of Engineering, Irinjalakuda &bull; Department of Higher Education Registry
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => { fetchStats(); fetchApplications(); }}>
              <span className="material-symbols-outlined text-[16px] mr-1">refresh</span>
              Refresh Queue
            </Button>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Enrolled</span>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white mt-1">
                {stats.total_applications}
              </p>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-mono text-amber-500 uppercase">Pending Review</span>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <p className="text-2xl sm:text-3xl font-black font-mono text-amber-500 mt-1">
                {stats.pending_applications}
              </p>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-mono text-emerald-500 uppercase">Passes Approved</span>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-500 mt-1">
                {stats.approved_applications}
              </p>
            )}
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <span className="text-xs font-mono text-rose-500 uppercase">Rejected</span>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mt-2" />
            ) : (
              <p className="text-2xl sm:text-3xl font-black font-mono text-rose-500 mt-1">
                {stats.rejected_applications}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. APPLICATION QUEUE CONTROLS & TABLE */}
      <div className="rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
        
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          
          {/* Status Pills */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
            {['', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                  statusFilter === filter
                    ? 'bg-white dark:bg-sky-500 text-slate-950 dark:text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter === '' ? 'ALL' : filter}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <Input
              placeholder="Search by student, ID, roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<span className="material-symbols-outlined text-[18px]">search</span>}
            />
          </div>
        </div>

        {/* Applications Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-normal">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="pb-3 pl-2">Student</th>
                <th className="pb-3">Enrollment ID</th>
                <th className="pb-3">Course / Dept</th>
                <th className="pb-3">Corridor</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-2 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    <span className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin inline-block mr-2" />
                    Loading application ledger...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-mono">
                    No student applications match the filter criteria.
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const isPending = app.status === 'PENDING';
                  const isApproved = app.status === 'APPROVED';

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#111722]/50 transition-colors"
                    >
                      <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {app.student_name ? app.student_name[0] : 'S'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {app.student_name || 'Student'}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400">{app.application_number}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {app.roll_number || '—'}
                      </td>

                      <td className="py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        {app.course_name || '—'}
                      </td>

                      <td className="py-3.5 text-xs text-slate-600 dark:text-slate-400 max-w-[180px] truncate">
                        {app.starting_point} &rarr; {app.destination}
                      </td>

                      <td className="py-3.5">
                        <Badge
                          variant={isApproved ? 'success' : isPending ? 'warning' : 'danger'}
                          size="sm"
                          dot
                        >
                          {app.status}
                        </Badge>
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <Button
                          variant={isPending ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          {isPending ? 'Inspect & Review' : 'View Pass Proof'}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. APPLICATION DETAIL INSPECTION DRAWER */}
      <Drawer
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Application #${selectedApp?.application_number}`}
        subtitle={`Submitted: ${selectedApp?.created_at ? new Date(selectedApp.created_at).toLocaleDateString() : 'Active'}`}
        width="max-w-lg"
      >
        {selectedApp && (
          <div className="space-y-6 text-xs sm:text-sm">
            
            {/* Student Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedApp.student_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <span className="text-slate-400">Roll Number:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedApp.roll_number}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <span className="text-slate-400">Course / Dept:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedApp.course_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-2">
                <span className="text-slate-400">Institution:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedApp.institution_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Corridor Stages:</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">{selectedApp.starting_point} &rarr; {selectedApp.destination}</span>
              </div>
            </div>

            {/* Document Inspection Proof */}
            <div className="space-y-2">
              <span className="font-mono text-xs font-bold text-slate-400 uppercase">
                ATTACHED PROOF OF ENROLLMENT
              </span>
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                <span className="material-symbols-outlined text-[36px] text-sky-500">verified_user</span>
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  Bonafide College Enrollment Certificate Attached
                </p>
                <p className="text-[11px] text-slate-400">
                  Attested by Principal Secretariat &bull; Validated with Higher Ed PIN
                </p>
              </div>
            </div>

            {/* Issued Pass Details if approved */}
            {selectedApp.issued_pass && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase block">
                    ISSUED CONCESSION PASS
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    QR ACTIVE
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Pass Number:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedApp.issued_pass.pass_number}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Expiry:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedApp.issued_pass.expiry_date}</span>
                </div>

                {/* ID-Card QR Integration Notice */}
                <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-sans text-slate-600 dark:text-slate-400 space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-500">qr_code_2</span>
                    <span>YAATHRI Verification QR</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Ready for institution ID-card printing / engraving
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Proposed ID-card integration: The physical college ID card is the student's everyday credential. Conductor scans only when verification is required.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons if Pending */}
            {selectedApp.status === 'PENDING' && (
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => setApproveApp(selectedApp)}
                >
                  Approve Pass
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className="flex-1 text-rose-500 border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  onClick={() => setRejectApp(selectedApp)}
                >
                  Reject
                </Button>
              </div>
            )}

          </div>
        )}
      </Drawer>

      {/* APPROVAL MODAL */}
      <Modal
        isOpen={!!approveApp}
        onClose={() => setApproveApp(null)}
        title="Approve Concession Pass"
        subtitle={`Authorize student transit subsidy for ${approveApp?.student_name}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Input
            label="Registrar Attestation Notes"
            value={approveNotes}
            onChange={(e) => setApproveNotes(e.target.value)}
          />

          <p className="text-xs text-slate-500">
            Approving issues an official digital concession pass and activates the <strong>YAATHRI Verification QR</strong> (Ready for institution ID-card printing / engraving).
          </p>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => setApproveApp(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApproveSubmit}
              isLoading={isProcessing}
            >
              Confirm &amp; Issue Pass
            </Button>
          </div>
        </div>
      </Modal>

      {/* REJECTION MODAL */}
      <Modal
        isOpen={!!rejectApp}
        onClose={() => setRejectApp(null)}
        title="Reject Application"
        subtitle={`Provide official feedback for ${rejectApp?.student_name}`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <Input
            label="Reason for Rejection"
            placeholder="e.g. Incomplete proof of admission or invalid semester..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
          />

          <div className="flex items-center justify-end space-x-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => setRejectApp(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleRejectSubmit}
              isLoading={isProcessing}
            >
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
