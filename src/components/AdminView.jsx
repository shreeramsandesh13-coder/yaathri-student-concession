import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export default function AdminView() {
  const [activeSubTab, setActiveSubTab] = useState('applications'); // 'applications' | 'students' | 'routes' | 'verifications'
  const [statusFilter, setStatusFilter] = useState('');
  
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [verifications, setVerifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.admin.listApplications(statusFilter || null);
      setApplications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await api.admin.listStudents();
      setStudents(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoutes = async () => {
    try {
      const data = await api.admin.listRoutes();
      setRoutes(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVerifications = async () => {
    try {
      const data = await api.admin.listVerifications();
      setVerifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'applications') fetchApplications();
    if (activeSubTab === 'students') fetchStudents();
    if (activeSubTab === 'routes') fetchRoutes();
    if (activeSubTab === 'verifications') fetchVerifications();
  }, [activeSubTab, statusFilter]);

  const handleApprove = async (appId) => {
    try {
      await api.admin.approveApplication(appId, 'Approved by Administrative Officer. Pass provisioned.');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      setActionMessage(`Application #${appId} Approved! Digital Concession Pass has been activated.`);
      setTimeout(() => setActionMessage(null), 4000);
      fetchApplications();
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleReject = async (appId) => {
    const reason = prompt('Enter rejection reason for student notification:', 'Residential distance does not meet minimum corridor threshold.');
    if (!reason) return;
    try {
      await api.admin.rejectApplication(appId, reason);
      setActionMessage(`Application #${appId} Rejected.`);
      setTimeout(() => setActionMessage(null), 4000);
      fetchApplications();
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
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
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'applications'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Applications ({applications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'students'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Enrolled Students
          </button>
          <button
            onClick={() => setActiveSubTab('routes')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'routes'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Routes &amp; Fleet
          </button>
          <button
            onClick={() => setActiveSubTab('verifications')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeSubTab === 'verifications'
                ? 'bg-[#081b2e] dark:bg-sky-500 text-white dark:text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Audit Logs
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

      {/* SUB-TAB 1: APPLICATIONS TABLE */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
              >
                <option value="">All Applications</option>
                <option value="PENDING">Pending Verification</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <button
              onClick={fetchApplications}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Refresh</span>
            </button>
          </div>

          <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#111722] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">App ID</th>
                    <th className="px-5 py-3.5">Student</th>
                    <th className="px-5 py-3.5">Institution / Course</th>
                    <th className="px-5 py-3.5">Corridor Route</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        {loading ? 'Loading applications from SQLite database...' : 'No applications found matching filter.'}
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                          {app.application_number}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 dark:text-white">{app.student?.full_name || 'Student'}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{app.student?.roll_number} • {app.student?.phone}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-700 dark:text-slate-300">
                          <div className="truncate max-w-[200px]">{app.student?.college_address}</div>
                          <div className="text-[11px] text-slate-500">{app.student?.course}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {app.route?.from_location} ⇄ {app.route?.to_location}
                          </span>
                          <div className="text-[11px] text-slate-500 truncate max-w-[220px]">{app.route?.corridor}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                              app.status === 'APPROVED'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : app.status === 'REJECTED'
                                ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                                : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                app.status === 'APPROVED' ? 'bg-emerald-500' : app.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {app.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {app.status === 'PENDING' ? (
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => handleApprove(app.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
                                title="Approve and provision digital pass"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(app.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-sm cursor-pointer transition-all active:scale-95"
                                title="Reject with remarks"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono italic">
                              Reviewed {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : ''}
                            </span>
                          )}
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
        <div className="bg-white/80 dark:bg-[#0D1118]/85 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="font-bold text-sm text-slate-900 dark:text-white">Active Student Registry</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((st) => (
              <div key={st.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                    <img src={st.photo_url || '/bus.png'} alt={st.full_name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{st.full_name}</div>
                    <div className="font-mono text-slate-500">{st.roll_number}</div>
                  </div>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 space-y-1 text-slate-600 dark:text-slate-300">
                  <div><strong>Course:</strong> {st.course}</div>
                  <div><strong>Phone:</strong> {st.phone}</div>
                  <div><strong>Blood Group:</strong> <span className="text-red-500 font-bold">{st.blood_group}</span></div>
                  <div className="truncate"><strong>College:</strong> {st.college_address}</div>
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
            <div key={rt.id} className="p-5 rounded-3xl bg-white/80 dark:bg-[#0D1118]/85 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm text-xs">
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
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
            Real-Time Turnstile &amp; Conductor Verification Logs
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
                            : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
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
    </section>
  );
}

