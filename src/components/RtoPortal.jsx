import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  ShieldAlert,
  ShieldCheck,
  Building,
  Bus,
  Train,
  Search,
  Filter,
  RefreshCw,
  Power,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  FileText,
  Activity,
  Award,
  Hash,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function RtoPortal() {
  const { user, logout } = useAuth();

  // Active Tab: 'verifiers' | 'audit' | 'institutions' | 'routes'
  const [activeTab, setActiveTab] = useState('verifiers');

  // KPI Dashboard Stats
  const [dashboard, setDashboard] = useState(null);
  const [dashLoading, setDashLoading] = useState(true);

  // Verifiers State
  const [verifiers, setVerifiers] = useState([]);
  const [verifiersLoading, setVerifiersLoading] = useState(true);
  const [verifierSearch, setVerifierSearch] = useState('');
  const [transportFilter, setTransportFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditResultFilter, setAuditResultFilter] = useState('');

  // Institutions & Operators State
  const [institutions, setInstitutions] = useState([]);
  const [operators, setOperators] = useState([]);
  const [routes, setRoutes] = useState([]);

  // Notifications / Flash Message
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadDashboard();
    loadVerifiers();
    loadAuditLogs();
    loadInstitutionsAndRoutes();
  }, []);

  async function loadDashboard() {
    try {
      setDashLoading(true);
      const data = await api.rto.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.warn('Failed to load RTO dashboard:', err);
    } finally {
      setDashLoading(false);
    }
  }

  async function loadVerifiers() {
    try {
      setVerifiersLoading(true);
      const data = await api.rto.listVerifiers({
        search: verifierSearch,
        transport_type: transportFilter,
        status_filter: statusFilter,
      });
      setVerifiers(data);
    } catch (err) {
      console.warn('Failed to load verifiers:', err);
    } finally {
      setVerifiersLoading(false);
    }
  }

  async function loadAuditLogs() {
    try {
      setAuditLoading(true);
      const data = await api.rto.listVerifications({
        search: auditSearch,
        result: auditResultFilter,
        limit: 100,
      });
      setAuditLogs(data);
    } catch (err) {
      console.warn('Failed to load audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  }

  async function loadInstitutionsAndRoutes() {
    try {
      const [insts, ops, rts] = await Promise.all([
        api.rto.listInstitutions(),
        api.rto.listOperators(),
        api.rto.listRoutes(),
      ]);
      setInstitutions(insts);
      setOperators(ops);
      setRoutes(rts);
    } catch (err) {
      console.warn('Failed to load reference data:', err);
    }
  }

  // Handle Verifier Status Toggle (Suspend / Activate)
  async function handleToggleStatus(verifierObj) {
    const newStatus = verifierObj.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setTogglingId(verifierObj.id);
    try {
      await api.rto.updateVerifierStatus(verifierObj.id, newStatus);
      setFeedback({
        type: 'success',
        message: `Verifier ${verifierObj.verifier_code} (${verifierObj.full_name}) has been ${newStatus}.`,
      });
      // Refresh
      await loadVerifiers();
      await loadDashboard();
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update verifier status.',
      });
    } finally {
      setTogglingId(null);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top RTO Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-sm">
              KL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase tracking-wider">
                  Transport Authority Portal
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">കേരള മോട്ടോർ വാഹന വകുപ്പ്</span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                Kerala Regional Transport Office (RTO) — State Mobility Directorate
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <span className="text-xs font-semibold text-slate-300 block">
                {user?.email || 'Joint Transport Commissioner'}
              </span>
              <span className="text-[10px] text-sky-400 uppercase font-mono tracking-wider">
                State Enforcement Clearance
              </span>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* Flash Message */}
        {feedback && (
          <div
            className={`rounded-xl p-4 text-xs font-semibold flex items-center justify-between border ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Executive KPI Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Authorized Verifiers</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {dashboard?.total_verifiers ?? '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">
                {dashboard?.active_verifiers ?? 0} Active
              </span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">
                {dashboard?.suspended_verifiers ?? 0} Suspended
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>State Inspections</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {dashboard?.total_verifications ?? '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">
                {dashboard?.valid_verifications ?? 0} Valid
              </span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">
                {dashboard?.invalid_verifications ?? 0} Flagged
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Participating Colleges</span>
              <Building className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {dashboard?.total_institutions ?? '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Accredited Higher Education Institutes
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Active Concession Passes</span>
              <Award className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {dashboard?.total_active_passes ?? '—'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active Digital Student Concessions
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('verifiers')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'verifiers'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Authorized Verifiers Directory ({verifiers.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'audit'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            State-Wide Verification Audit ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('institutions')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'institutions'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            Institutions & Fleet Operators
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'routes'
                ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Gazetted Corridors & Subsidies
          </button>
        </div>

        {/* TAB 1: AUTHORIZED VERIFIERS DIRECTORY */}
        {activeTab === 'verifiers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  Conductor & Verifier Authorization Registry
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage KSRTC conductors, Private bus crew, and Metro gate terminals with instant suspension rights
                </p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={verifierSearch}
                    onChange={(e) => setVerifierSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadVerifiers()}
                    placeholder="Search name, ID, bus..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 w-44 sm:w-56"
                  />
                </div>

                <select
                  value={transportFilter}
                  onChange={(e) => {
                    setTransportFilter(e.target.value);
                  }}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                >
                  <option value="">All Fleets</option>
                  <option value="KSRTC">KSRTC</option>
                  <option value="PRIVATE_BUS">Private Bus</option>
                  <option value="METRO">Metro</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active Only</option>
                  <option value="SUSPENDED">Suspended Only</option>
                </select>

                <button
                  onClick={loadVerifiers}
                  disabled={verifiersLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${verifiersLoading ? 'animate-spin' : ''}`} />
                  Filter
                </button>
              </div>
            </div>

            {/* Verifiers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Verifier ID</th>
                    <th className="pb-3 font-semibold">Conductor / Terminal</th>
                    <th className="pb-3 font-semibold">Fleet Type</th>
                    <th className="pb-3 font-semibold">Operator</th>
                    <th className="pb-3 font-semibold">Vehicle / Gate</th>
                    <th className="pb-3 font-semibold">Assigned Route & Depot</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">RTO Enforcement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {verifiers.map((v) => {
                    const isActive = v.status === 'ACTIVE';
                    return (
                      <tr key={v.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 font-mono font-bold text-sky-400">
                          {v.verifier_code}
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-white">{v.full_name}</div>
                          <div className="text-[11px] text-slate-400">{v.phone || '—'}</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[10px]">
                            {v.transport_type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300 font-medium truncate max-w-[140px]">
                          {v.operator_name || 'Kerala State Transport'}
                        </td>
                        <td className="py-3 font-mono text-amber-300">
                          {v.bus_number || v.station_device_id || '—'}
                        </td>
                        <td className="py-3">
                          <div className="text-slate-200 truncate max-w-[160px]">
                            {v.assigned_route || 'All Routes'}
                          </div>
                          <div className="text-[10px] text-slate-500">{v.depot || 'General'}</div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              isActive
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleStatus(v)}
                            disabled={togglingId === v.id}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                              isActive
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {togglingId === v.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : isActive ? (
                              'Suspend Authority'
                            ) : (
                              'Activate Authority'
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STATE-WIDE VERIFICATION AUDIT LEDGER */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  State-Wide Real-Time Verification Ledger
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete audit trail answering who verified, which transport, which vehicle/device, and the result
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadAuditLogs()}
                    placeholder="Search pass, student, bus..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 w-44 sm:w-56"
                  />
                </div>

                <select
                  value={auditResultFilter}
                  onChange={(e) => setAuditResultFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
                >
                  <option value="">All Results</option>
                  <option value="VALID">Valid Passes</option>
                  <option value="INVALID">Invalid / Flagged</option>
                </select>

                <button
                  onClick={loadAuditLogs}
                  disabled={auditLoading}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold">Pass / Token ID</th>
                    <th className="pb-3 font-semibold">Student Name & Roll</th>
                    <th className="pb-3 font-semibold">Verifier / Conductor</th>
                    <th className="pb-3 font-semibold">Transport Fleet</th>
                    <th className="pb-3 font-semibold">Vehicle / Device</th>
                    <th className="pb-3 font-semibold">Result</th>
                    <th className="pb-3 font-semibold">Audit Notes / Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogs.map((log) => {
                    const isValid = log.result === 'VALID' || log.status === 'VERIFIED';
                    return (
                      <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 font-mono text-slate-400">
                          {new Date(log.verified_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="py-3 font-mono font-bold text-slate-200">
                          {log.pass_number_scanned}
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-white">{log.student_name || '—'}</div>
                          <div className="text-[10px] text-slate-400">{log.student_roll || ''}</div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-200 font-medium">
                            {log.verifier_name || log.verifier_identity || 'RTO Scanner'}
                          </div>
                          <div className="font-mono text-[10px] text-sky-400">{log.verifier_code}</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-[10px]">
                            {log.transport_type || 'KSRTC'}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-amber-300">
                          {log.vehicle_number || log.station_device_id || log.terminal_code || '—'}
                        </td>
                        <td className="py-3">
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
                        <td className="py-3 text-slate-400 truncate max-w-[200px]">
                          {log.failure_reason || log.notes || 'Routine boarding clearance.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INSTITUTIONS & FLEET OPERATORS */}
        {activeTab === 'institutions' && (
          <div className="space-y-6">
            {/* Transport Operators */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-400" />
                Accredited Transport Operators
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {operators.map((op) => (
                  <div key={op.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        {op.code}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">ACTIVE FLEET</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mt-2">{op.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{op.headquarters}</p>
                    <div className="text-[11px] text-slate-500 mt-3 flex items-center justify-between">
                      <span>{op.contact_phone}</span>
                      <span>{op.operator_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Educational Institutions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-sky-400" />
                Registered Higher Education Institutions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {institutions.map((inst) => (
                  <div key={inst.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-sky-300 font-bold">{inst.code}</span>
                      <span className="text-xs text-slate-400">{inst.district} District</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{inst.name}</h4>
                    <p className="text-xs text-slate-400">{inst.address}</p>
                    <div className="text-xs text-slate-400 pt-2 border-t border-slate-850 flex items-center justify-between">
                      <span>Principal: {inst.principal_name}</span>
                      <span>{inst.contact_phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GAZETTED ROUTES & SUBSIDIES */}
        {activeTab === 'routes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Gazetted Transit Corridors & Concession Subsidies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {routes.map((rt) => (
                <div key={rt.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {rt.route_code}
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">{rt.distance_km} km Corridor</span>
                  </div>
                  <h4 className="font-bold text-white text-base">
                    {rt.from_location} ⇄ {rt.to_location}
                  </h4>
                  <p className="text-xs text-slate-400">{rt.corridor}</p>
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs">
                    <span className="text-amber-300 font-semibold">
                      KSRTC: {rt.ksrtc_subsidy_pct}% Subsidy
                    </span>
                    {rt.metro_subsidy_pct > 0 && (
                      <span className="text-cyan-300 font-semibold">
                        Metro: {rt.metro_subsidy_pct}% Subsidy
                      </span>
                    )}
                    <span className="text-slate-300">Concession Fare: {rt.fare_daily}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
