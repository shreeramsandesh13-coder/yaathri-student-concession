import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Skeleton from './ui/Skeleton';
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
  }, []);

  // Defer heavy audit and reference data requests until corresponding tab is opened
  useEffect(() => {
    if (activeTab === 'audit' && auditLogs.length === 0) {
      loadAuditLogs();
    } else if ((activeTab === 'institutions' || activeTab === 'routes') && institutions.length === 0) {
      loadInstitutionsAndRoutes();
    }
  }, [activeTab]);

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
    <div className="space-y-6">
      {/* Top RTO Header Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-[#0B111D]/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shrink-0 shadow-md shadow-sky-500/20">
            KL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">STATE TRANSPORT COMMISSIONERATE</Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono hidden sm:inline">കേരള മോട്ടോർ വാഹന വകുപ്പ്</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Kerala Regional Transport Office (RTO) — Mobility Directorate
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right hidden md:block">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {user?.email || 'Joint Transport Commissioner'}
            </span>
            <span className="text-[10px] text-sky-500 dark:text-sky-400 uppercase font-mono tracking-wider">
              Enforcement &amp; Oversight Node
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

      {/* Flash Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Executive KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Authorized Verifiers</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {dashLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              dashboard?.total_verifiers ?? '—'
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {dashboard?.active_verifiers ?? 0} Active
            </span>
            <span>&bull;</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              {dashboard?.suspended_verifiers ?? 0} Suspended
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>State Inspections</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {dashLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              dashboard?.total_verifications ?? '—'
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {dashboard?.valid_verifications ?? 0} Validated
            </span>
            <span>&bull;</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">
              {dashboard?.invalid_verifications ?? 0} Flagged
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Participating Colleges</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {dashLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              dashboard?.total_institutions ?? '—'
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Accredited Higher Education Nodes
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Active Concession Passes</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {dashLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              dashboard?.total_active_passes ?? '—'
            )}
          </div>
          <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
            Active Digital Student Concessions
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifiers')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'verifiers'
              ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Authorized Verifiers ({verifiers.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          State Verification Ledger ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('institutions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'institutions'
              ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building className="w-4 h-4" />
          Colleges &amp; Fleet Operators
        </button>

        <button
          onClick={() => setActiveTab('routes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'routes'
              ? 'bg-white dark:bg-sky-500 text-slate-900 dark:text-slate-950 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Gazetted Corridors &amp; Subsidies
        </button>
      </div>

      {/* TAB 1: AUTHORIZED VERIFIERS DIRECTORY */}
      {activeTab === 'verifiers' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <ShieldCheck className="w-5 h-5 text-sky-500" />
                CONDUCTOR &amp; VERIFIER REGISTRY
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage KSRTC conductors, private bus crews, and metro turnstile terminals with real-time authority toggle
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={verifierSearch}
                  onChange={(e) => setVerifierSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadVerifiers()}
                  placeholder="Search code, name, bus..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 w-44 sm:w-56"
                />
              </div>

              <select
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">All Fleets</option>
                <option value="KSRTC">KSRTC</option>
                <option value="PRIVATE_BUS">Private Bus</option>
                <option value="METRO">Metro</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadVerifiers}
                disabled={verifiersLoading}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${verifiersLoading ? 'animate-spin' : ''}`} />}
              >
                Filter
              </Button>
            </div>
          </div>

          {/* Verifiers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="pb-3 font-semibold">Verifier ID</th>
                  <th className="pb-3 font-semibold">Staff Identity</th>
                  <th className="pb-3 font-semibold">Fleet</th>
                  <th className="pb-3 font-semibold">Operator</th>
                  <th className="pb-3 font-semibold">Vehicle / Gate</th>
                  <th className="pb-3 font-semibold">Assigned Route &amp; Depot</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">RTO Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {verifiers.map((v) => {
                  const isActive = v.status === 'ACTIVE';
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 font-mono font-bold text-sky-600 dark:text-sky-400">
                        {v.verifier_code}
                      </td>
                      <td className="py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white">{v.full_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{v.phone || '—'}</div>
                      </td>
                      <td className="py-3.5">
                        <Badge variant="neutral" size="sm">
                          {v.transport_type}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-slate-700 dark:text-slate-300 font-medium truncate max-w-[140px]">
                        {v.operator_name || 'Kerala State Transport'}
                      </td>
                      <td className="py-3.5 font-mono text-amber-600 dark:text-amber-400 font-bold">
                        {v.bus_number || v.station_device_id || '—'}
                      </td>
                      <td className="py-3.5">
                        <div className="text-slate-800 dark:text-slate-200 truncate max-w-[160px] font-medium">
                          {v.assigned_route || 'All Routes'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{v.depot || 'General'}</div>
                      </td>
                      <td className="py-3.5">
                        <Badge variant={isActive ? 'success' : 'danger'} size="sm" dot>
                          {v.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleToggleStatus(v)}
                          disabled={togglingId === v.id}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isActive
                              ? 'bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {togglingId === v.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isActive ? (
                            'Suspend'
                          ) : (
                            'Activate'
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

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                <FileText className="w-5 h-5 text-sky-500" />
                STATE-WIDE REAL-TIME VERIFICATION LEDGER
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Centralized audit trail recording timestamps, student credentials, verifier identity, and scan outcomes
              </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadAuditLogs()}
                  placeholder="Search pass, student, bus..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 w-44 sm:w-56"
                />
              </div>

              <select
                value={auditResultFilter}
                onChange={(e) => setAuditResultFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="">All Results</option>
                <option value="VALID">Valid Passes</option>
                <option value="INVALID">Invalid / Flagged</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={loadAuditLogs}
                disabled={auditLoading}
                icon={<RefreshCw className={`w-3.5 h-3.5 ${auditLoading ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="pb-3 font-semibold">Timestamp</th>
                  <th className="pb-3 font-semibold">Pass / Token ID</th>
                  <th className="pb-3 font-semibold">Student &amp; Roll</th>
                  <th className="pb-3 font-semibold">Verifier Staff</th>
                  <th className="pb-3 font-semibold">Fleet</th>
                  <th className="pb-3 font-semibold">Vehicle / Device</th>
                  <th className="pb-3 font-semibold">Verdict</th>
                  <th className="pb-3 font-semibold">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {auditLogs.map((log) => {
                  const isValid = log.result === 'VALID' || log.status === 'VERIFIED';
                  return (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(log.verified_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        {log.pass_number_scanned}
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{log.student_name || '—'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.student_roll || ''}</div>
                      </td>
                      <td className="py-3">
                        <div className="text-slate-800 dark:text-slate-200 font-medium">
                          {log.verifier_name || log.verifier_identity || 'RTO Scanner'}
                        </div>
                        <div className="font-mono text-[10px] text-sky-500">{log.verifier_code}</div>
                      </td>
                      <td className="py-3">
                        <Badge variant="neutral" size="sm">
                          {log.transport_type || 'KSRTC'}
                        </Badge>
                      </td>
                      <td className="py-3 font-mono text-amber-600 dark:text-amber-400 font-semibold">
                        {log.vehicle_number || log.station_device_id || log.terminal_code || '—'}
                      </td>
                      <td className="py-3">
                        <Badge variant={isValid ? 'success' : 'danger'} size="sm">
                          {isValid ? 'VALID' : 'INVALID'}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
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
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Bus className="w-5 h-5 text-amber-500" />
              ACCREDITED TRANSPORT OPERATORS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {operators.map((op) => (
                <div key={op.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {op.code}
                    </span>
                    <Badge variant="success" size="sm">ACTIVE FLEET</Badge>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-1">{op.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{op.headquarters}</p>
                  <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>{op.contact_phone}</span>
                    <span>{op.operator_type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Building className="w-5 h-5 text-sky-500" />
              REGISTERED HIGHER EDUCATION INSTITUTIONS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {institutions.map((inst) => (
                <div key={inst.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">{inst.code}</span>
                    <span className="text-xs text-slate-400 font-mono">{inst.district} District</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{inst.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inst.address}</p>
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between font-mono">
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
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <MapPin className="w-5 h-5 text-emerald-500" />
            GAZETTED TRANSIT CORRIDORS &amp; CONCESSION SUBSIDIES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((rt) => (
              <div key={rt.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {rt.route_code}
                  </span>
                  <Badge variant="success" size="sm">{rt.distance_km} KM CORRIDOR</Badge>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {rt.from_location} &harr; {rt.to_location}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{rt.corridor}</p>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">
                    KSRTC: {rt.ksrtc_subsidy_pct}%
                  </span>
                  {rt.metro_subsidy_pct > 0 && (
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                      Metro: {rt.metro_subsidy_pct}%
                    </span>
                  )}
                  <span className="text-slate-600 dark:text-slate-300 font-bold">Fare: {rt.fare_daily}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
