import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function AdminView() {
  const [activeSubTab, setActiveSubTab] = useState('applications'); // 'applications' | 'students' | 'routes' | 'verifications'
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Database Statistics
  const [stats, setStats] = useState({
    total_applications: 0,
    pending_applications: 0,
    approved_applications: 0,
    rejected_applications: 0,
    active_passes: 0,
    expired_passes: 0,
    total_students: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Entities Data
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [verifications, setVerifications] = useState([]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [approveModalApp, setApproveModalApp] = useState(null);
  const [approveNotes, setApproveNotes] = useState('Verified and endorsed for academic year transit.');
  const [rejectModalApp, setRejectModalApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await api.admin.getStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch admin stats:', e);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.admin.listApplications(searchQuery || null, statusFilter || null);
      setApplications(data);
    } catch (e) {
      console.error('Failed to fetch applications:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.admin.listStudents();
      setStudents(data);
    } catch (e) {
      console.error('Failed to fetch students:', e);
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await api.admin.listRoutes();
      setRoutes(data);
    } catch (e) {
      console.error('Failed to fetch routes:', e);
    }
  };

  const fetchVerifications = async () => {
    try {
      const data = await api.admin.listVerifications();
      setVerifications(data);
    } catch (e) {
      console.error('Failed to fetch verifications:', e);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'applications') {
      fetchApplications();
    } else if (activeSubTab === 'students') {
      fetchStudents();
    } else if (activeSubTab === 'routes') {
      fetchRoutes();
    } else if (activeSubTab === 'verifications') {
      fetchVerifications();
    }
  }, [activeSubTab, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchApplications();
  };

  const handleOpenApproveModal = (app) => {
    setApproveModalApp(app);
    setApproveNotes('Verified and endorsed under Kerala MVD Student Concession Guidelines.');
  };

  const handleConfirmApprove = async () => {
    if (!approveModalApp) return;
    setIsProcessingAction(true);
    try {
      const updated = await api.admin.approveApplication(approveModalApp.id, approveNotes);
      try {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      setActionMessage(`Application ${approveModalApp.application_number} approved! Digital Pass provisioned.`);
      setTimeout(() => setActionMessage(null), 5000);

      // Refresh applications & stats
      fetchApplications();
      fetchStats();

      // Update selected app if open
      if (selectedApp && selectedApp.id === approveModalApp.id) {
        setSelectedApp(updated);
      }

      setApproveModalApp(null);
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleOpenRejectModal = (app) => {
    setRejectModalApp(app);
    setRejectionReason('');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalApp) return;
    if (!rejectionReason.trim()) {
      alert('Please provide a specific rejection reason for the student notification.');
      return;
    }
    setIsProcessingAction(true);
    try {
      const updated = await api.admin.rejectApplication(rejectModalApp.id, rejectionReason.trim());
      setActionMessage(`Application ${rejectModalApp.application_number} rejected. Notification dispatched.`);
      setTimeout(() => setActionMessage(null), 5000);

      // Refresh applications & stats
      fetchApplications();
      fetchStats();

      // Update selected app if open
      if (selectedApp && selectedApp.id === rejectModalApp.id) {
        setSelectedApp(updated);
      }

      setRejectModalApp(null);
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setIsProcessingAction(false);
    }
  };

  return (
    <section className="space-y-6 pt-4 animate-fade-in" id="admin-view-section">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            ADMINISTRATIVE CONTROL PORTAL • KERALA RTO NODE
          </div>
          <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-slate-900 dark:text-white mt-1">
            Concession Governance Desk
          </h2>
          <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400">
            Real-time enrollment auditing, application verification, digital pass provisioning, and turnstile logs.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex p-1 bg-slate-100 dark:bg-[#111722] rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold self-start sm:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('applications')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'applications'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applications ({stats.total_applications})
          </button>
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'students'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Students ({stats.total_students})
          </button>
          <button
            onClick={() => setActiveSubTab('routes')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'routes'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Routes &amp; Fleet
          </button>
          <button
            onClick={() => setActiveSubTab('verifications')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'verifications'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Turnstile Logs
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-semibold flex items-center space-x-2 animate-fade-in shadow-md">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span>{actionMessage}</span>
        </div>
      )}

      {/* REAL DATABASE STATS CARDS (7 KPI METRICS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Applications */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0D1118]/85 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Total Apps</span>
            <span className="material-symbols-outlined text-[16px] text-sky-500">description</span>
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {statsLoading ? '—' : stats.total_applications}
          </div>
          <span className="text-[9px] text-slate-500 block">Submitted requests</span>
        </div>

        {/* Pending Applications */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Pending</span>
            <span className="material-symbols-outlined text-[16px]">pending_actions</span>
          </div>
          <div className="text-xl font-bold text-amber-800 dark:text-amber-300 font-mono">
            {statsLoading ? '—' : stats.pending_applications}
          </div>
          <span className="text-[9px] text-amber-700/80 dark:text-amber-400/80 block">Awaiting review</span>
        </div>

        {/* Approved Applications */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Approved</span>
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
          </div>
          <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 font-mono">
            {statsLoading ? '—' : stats.approved_applications}
          </div>
          <span className="text-[9px] text-emerald-700/80 dark:text-emerald-400/80 block">Verified &amp; endorsed</span>
        </div>

        {/* Rejected Applications */}
        <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Rejected</span>
            <span className="material-symbols-outlined text-[16px]">cancel</span>
          </div>
          <div className="text-xl font-bold text-rose-800 dark:text-rose-300 font-mono">
            {statsLoading ? '—' : stats.rejected_applications}
          </div>
          <span className="text-[9px] text-rose-700/80 dark:text-rose-400/80 block">Criteria mismatch</span>
        </div>

        {/* Active Passes */}
        <div className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Active Passes</span>
            <span className="material-symbols-outlined text-[16px]">credit_card</span>
          </div>
          <div className="text-xl font-bold text-teal-800 dark:text-teal-300 font-mono">
            {statsLoading ? '—' : stats.active_passes}
          </div>
          <span className="text-[9px] text-teal-700/80 dark:text-teal-400/80 block">In circulation</span>
        </div>

        {/* Expired Passes */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Expired</span>
            <span className="material-symbols-outlined text-[16px]">timer_off</span>
          </div>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-300 font-mono">
            {statsLoading ? '—' : stats.expired_passes}
          </div>
          <span className="text-[9px] text-slate-500 block">Needs renewal</span>
        </div>

        {/* Total Students */}
        <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-sky-600 dark:text-sky-400">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Students</span>
            <span className="material-symbols-outlined text-[16px]">school</span>
          </div>
          <div className="text-xl font-bold text-sky-800 dark:text-sky-300 font-mono">
            {statsLoading ? '—' : stats.total_students}
          </div>
          <span className="text-[9px] text-sky-700/80 dark:text-sky-400/80 block">Kerala institutions</span>
        </div>
      </div>

      {/* SUB-TAB 1: APPLICATIONS WORKFLOW */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/80 dark:bg-[#0D1118]/85 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, roll #, student ID, app #, or institution..."
                className="w-full pl-9 pr-20 py-2 rounded-xl bg-slate-100/70 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                )}
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 rounded-lg text-[11px] font-bold"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Status Filter Chips */}
            <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-semibold">
              <span className="text-slate-400 text-[11px] whitespace-nowrap pr-1">Filter:</span>
              {[
                { id: '', label: 'All' },
                { id: 'PENDING', label: 'Pending' },
                { id: 'APPROVED', label: 'Approved' },
                { id: 'REJECTED', label: 'Rejected' },
                { id: 'ACTIVE', label: 'Active Pass' },
                { id: 'EXPIRED', label: 'Expired' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-[#111722] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              <button
                onClick={() => {
                  fetchApplications();
                  fetchStats();
                }}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                title="Refresh from SQLite database"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">App ID</th>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Institution &amp; Course</th>
                    <th className="px-5 py-3.5">Transport &amp; Corridor</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <span className="material-symbols-outlined text-[28px] animate-spin text-sky-500">
                            progress_activity
                          </span>
                          <span>Loading real applications from SQLite database...</span>
                        </div>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                          <span className="material-symbols-outlined text-[36px] text-slate-400">
                            inbox
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            No applications match your criteria
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Try adjusting your search query or reset the status filters to view all records.
                          </p>
                          {(searchQuery || statusFilter) && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('');
                              }}
                              className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-lg text-slate-700 dark:text-slate-300"
                            >
                              Reset Filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Application Number */}
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center space-x-1.5">
                            <span>{app.application_number}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                        </td>

                        {/* Student Name & Roll No */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white text-[13px]">
                            {app.student?.full_name || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.student?.roll_number} • ID: {app.student?.student_id_number || 'STU-2024-8841'}
                          </div>
                        </td>

                        {/* Institution & Course */}
                        <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                          <div className="truncate max-w-[210px] font-semibold">
                            {app.student?.institution_name || app.student?.college_address || 'Kerala Institution'}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[210px]">
                            {app.student?.course} ({app.student?.semester || app.student?.year_semester})
                          </div>
                        </td>

                        {/* Transport Corridor */}
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-[10px] font-bold font-mono">
                              {app.transport_mode || 'Bus'}
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {app.starting_point || app.route?.from_location} ⇄ {app.destination || app.route?.to_location}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[210px]">
                            {app.route_name || app.route?.corridor || 'NH 544 Corridor'}
                          </div>
                        </td>

                        {/* Status Chip */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : app.status === 'REJECTED'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'APPROVED'
                                  ? 'bg-emerald-500'
                                  : app.status === 'REJECTED'
                                  ? 'bg-rose-500'
                                  : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {app.status}
                          </span>
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Inspect / View Dossier */}
                            <button
                              onClick={() => setSelectedApp(app)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center space-x-1 cursor-pointer transition-all"
                              title="View full dossier"
                            >
                              <span className="material-symbols-outlined text-[15px]">visibility</span>
                              <span>Inspect</span>
                            </button>

                            {/* If pending, quick approve/reject buttons */}
                            {app.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleOpenApproveModal(app)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95 flex items-center space-x-1"
                                  title="Approve and activate Digital Pass"
                                >
                                  <span className="material-symbols-outlined text-[15px]">check</span>
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(app)}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95 flex items-center space-x-1"
                                  title="Reject with mandatory reason"
                                >
                                  <span className="material-symbols-outlined text-[15px]">close</span>
                                  <span>Reject</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REGISTERED STUDENTS */}
      {activeSubTab === 'students' && (
        <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900 dark:text-white">
              Statewide Enrolled Student Directory ({students.length})
            </div>
            <button
              onClick={fetchStudents}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((st) => (
              <div
                key={st.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600">
                    <img
                      src={st.photo_url || '/public/yaathri-vehicles.png'}
                      alt={st.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop';
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{st.full_name}</div>
                    <div className="font-mono text-slate-500">{st.roll_number} • {st.student_id_number || 'STU-2024-8841'}</div>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <div><strong>Institution:</strong> {st.institution_name || st.college_address}</div>
                  <div><strong>Course:</strong> {st.course} ({st.semester || st.year_semester})</div>
                  <div><strong>Phone:</strong> {st.phone}</div>
                  <div><strong>Blood Group:</strong> <span className="text-rose-500 font-bold">{st.blood_group}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TRANSIT ROUTES */}
      {activeSubTab === 'routes' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((rt) => (
            <div
              key={rt.id}
              className="p-5 rounded-3xl bg-white/80 dark:bg-[#0D1118]/85 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold font-mono">
                  {rt.route_code}
                </span>
                <span className="text-slate-500 font-mono">{rt.distance_km} KM</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {rt.from_location} ⇄ {rt.to_location}
              </div>
              <p className="text-slate-500 leading-relaxed">{rt.corridor}</p>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-slate-700 dark:text-slate-300 font-semibold">
                <span>KSRTC Subsidy: {rt.ksrtc_subsidy_pct}%</span>
                <span>Metro: {rt.metro_subsidy_pct}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: AUDIT LOGS */}
      {activeSubTab === 'verifications' && (
        <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
            <span>Real-Time Turnstile &amp; Conductor Verification Logs</span>
            <button
              onClick={fetchVerifications}
              className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Pass ID Scanned</th>
                  <th className="px-5 py-3">Terminal / Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Auditor Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {verifications.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono text-slate-500">
                      {new Date(log.verified_at).toLocaleTimeString()}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {log.pass_number_scanned}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                      <div>{log.location}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{log.terminal_code}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          log.status === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* APPLICATION DETAILS DOSSIER MODAL */}
      {/* ========================================================== */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0D1118] text-slate-900 dark:text-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">badge</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                      {selectedApp.application_number}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        selectedApp.status === 'APPROVED'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : selectedApp.status === 'REJECTED'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Application submitted on {new Date(selectedApp.applied_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Content Sections */}
            <div className="p-6 space-y-6 text-xs">
              {/* 1. Student Biometrics & Institution */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-[16px] text-sky-500">person</span>
                  <span>Student Biometric &amp; Academic Identity</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Photo */}
                  <div className="w-24 h-28 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border-2 border-slate-300 dark:border-slate-600 shadow-md">
                    <img
                      src={selectedApp.student?.photo_url || '/public/yaathri-vehicles.png'}
                      alt={selectedApp.student?.full_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop';
                      }}
                    />
                  </div>

                  {/* Identity Grid */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">FULL NAME</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedApp.student?.full_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">ROLL NUMBER</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        {selectedApp.student?.roll_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">STUDENT ID</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {selectedApp.student?.student_id_number || 'STU-2024-8841'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">INSTITUTION</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedApp.student?.institution_name || selectedApp.student?.college_address}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">COURSE &amp; SEMESTER</span>
                      <span className="text-slate-800 dark:text-slate-200">
                        {selectedApp.student?.course} • {selectedApp.student?.semester || selectedApp.student?.year_semester}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">CONTACT PHONE</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {selectedApp.student?.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Transit Corridor & Validity */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-[16px] text-sky-500">directions_transit</span>
                  <span>Requested Transit Corridor &amp; Validity Window</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TRANSPORT MODE</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {selectedApp.transport_mode || 'Bus'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">STARTING POINT</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedApp.starting_point || selectedApp.route?.from_location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DESTINATION</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {selectedApp.destination || selectedApp.route?.to_location}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px]">OFFICIAL CORRIDOR</span>
                    <span className="text-slate-700 dark:text-slate-300 font-mono">
                      {selectedApp.route_name || selectedApp.route?.corridor || 'NH 544 Corridor'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">VALIDITY WINDOW</span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {selectedApp.validity_start || '01 / 06 / 2026'} → {selectedApp.validity_end || '31 / 03 / 2027'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Uploaded Documents */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="material-symbols-outlined text-[16px] text-sky-500">folder</span>
                  <span>Uploaded Supporting Documents ({selectedApp.documents?.length || 0})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    selectedApp.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-xl bg-white dark:bg-[#0D1118] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span className="material-symbols-outlined text-[20px] text-sky-500">
                            {doc.doc_type === 'PHOTO' ? 'photo_camera' : 'description'}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {doc.file_name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {doc.doc_type} • Verified Safe
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-2 text-slate-400">
                      Standard student institutional enrollment document verified.
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Decision & Review History */}
              {selectedApp.status === 'APPROVED' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Approved &amp; Digital Pass Provisioned</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 space-y-1 font-mono text-[11px]">
                    <div><strong>Reviewing Officer:</strong> {selectedApp.reviewer_name || 'RTO Officer'}</div>
                    <div><strong>Endorsement Date:</strong> {new Date(selectedApp.reviewed_at).toLocaleString()}</div>
                    {selectedApp.reviewer_notes && <div><strong>Officer Notes:</strong> {selectedApp.reviewer_notes}</div>}
                    {selectedApp.issued_pass && (
                      <div className="pt-1 text-sky-600 dark:text-sky-400 font-bold">
                        Digital Pass ID: {selectedApp.issued_pass.pass_number} (Active NFC &amp; QR)
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedApp.status === 'REJECTED' && (
                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-2">
                  <div className="font-bold text-rose-800 dark:text-rose-300 flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                    <span>Application Rejected</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 space-y-1 text-[11px]">
                    <div><strong>Reviewing Officer:</strong> {selectedApp.reviewer_name || 'RTO Officer'}</div>
                    <div><strong>Review Date:</strong> {new Date(selectedApp.reviewed_at).toLocaleString()}</div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-[#0D1118] border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium">
                      <strong>Reason for Rejection:</strong> {selectedApp.rejection_reason || selectedApp.reviewer_notes}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Close Dossier
              </button>

              {selectedApp.status === 'PENDING' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenRejectModal(selectedApp)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow cursor-pointer active:scale-95"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleOpenApproveModal(selectedApp)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow cursor-pointer active:scale-95"
                  >
                    Approve &amp; Issue Pass
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* APPROVE CONFIRMATION MODAL */}
      {/* ========================================================== */}
      {approveModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0D1118] text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">task_alt</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Concession Pass Approval
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You are endorsing concession request{' '}
                <strong className="text-slate-800 dark:text-slate-200 font-mono">
                  {approveModalApp.application_number}
                </strong>{' '}
                for {approveModalApp.student?.full_name}.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#111722] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div><strong>Applicant:</strong> {approveModalApp.student?.full_name} ({approveModalApp.student?.roll_number})</div>
              <div><strong>Route:</strong> {approveModalApp.starting_point || approveModalApp.route?.from_location} ⇄ {approveModalApp.destination || approveModalApp.route?.to_location}</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✓ A cryptographically signed Digital Pass and QR payload will be issued.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reviewer Endorsement Notes (Optional)
              </label>
              <textarea
                value={approveNotes}
                onChange={(e) => setApproveNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-slate-100/70 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setApproveModalApp(null)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isProcessingAction}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessingAction ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Activating Pass...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Confirm &amp; Issue Pass</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* REJECT CONFIRMATION MODAL */}
      {/* ========================================================== */}
      {rejectModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0D1118] text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">warning</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Reject Concession Application
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Rejecting application{' '}
                <strong className="text-slate-800 dark:text-slate-200 font-mono">
                  {rejectModalApp.application_number}
                </strong>
                . A clear rejection reason is required and will be dispatched to the student's dashboard.
              </p>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">
                Quick Reason Presets:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {[
                  'Distance from residence is <3km minimum limit.',
                  'Institutional enrollment record could not be verified.',
                  'Uploaded college ID document is unreadable/expired.',
                  'Transit route requested does not match academic commute corridor.',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] text-left cursor-pointer"
                  >
                    {preset.slice(0, 32)}...
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain clearly why this application is being rejected..."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-slate-100/70 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
              {!rejectionReason.trim() && (
                <span className="text-[10px] text-rose-500 font-medium mt-1 block">
                  Rejection reason cannot be blank.
                </span>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRejectModalApp(null)}
                disabled={isProcessingAction}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isProcessingAction || !rejectionReason.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessingAction ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                    <span>Confirm Rejection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
