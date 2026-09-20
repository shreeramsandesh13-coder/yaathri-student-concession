import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building, Bus, ShieldCheck } from 'lucide-react';

export default function PortalSwitcherBanner({ onSelectPortal }) {
  const {
    role,
    loginAsDemoStudent,
    loginAsDemoInstitution,
    loginAsDemoVerifier,
    loginAsDemoRto,
  } = useAuth();
  const [switchingId, setSwitchingId] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleRoleSwitch = async (portalId, loginFn, targetTab) => {
    if (switchingId) return;
    setSwitchingId(portalId);
    setErrorMessage(null);
    try {
      await loginFn();
      if (onSelectPortal) onSelectPortal(targetTab);
    } catch (err) {
      console.error(`Failed to switch to ${portalId}:`, err);
      setErrorMessage(err.message || `Failed to switch to ${portalId}. Please check backend connection.`);
    } finally {
      setSwitchingId(null);
    }
  };

  const portals = [
    {
      id: 'student',
      title: 'Student Portal',
      malayalam: 'വിദ്യാർത്ഥി പോർട്ടൽ',
      desc: 'Apply for pass, upload documents, view digital pass with opaque QR & single-use tokens.',
      icon: GraduationCap,
      color: 'from-sky-500/20 to-blue-600/20 text-sky-400 border-sky-500/30',
      activeBorder: 'border-sky-500',
      actionText: 'Enter Student Portal',
      isCurrent: role === 'STUDENT',
      onSwitch: () => handleRoleSwitch('student', loginAsDemoStudent, 'dashboard'),
    },
    {
      id: 'institution',
      title: 'Institution Portal',
      malayalam: 'കോളേജ് വെരിഫിക്കേഷൻ',
      desc: 'College & school concession desk: inspect route maps, review certificates, approve/reject.',
      icon: Building,
      color: 'from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500',
      actionText: 'Enter Institution Desk',
      isCurrent: role === 'INSTITUTION' || role === 'ADMIN',
      onSwitch: () => handleRoleSwitch('institution', loginAsDemoInstitution, 'admin'),
    },
    {
      id: 'verifier',
      title: 'Conductor Terminal',
      malayalam: 'കണ്ടക്ടർ ടെർമിനൽ',
      desc: 'KSRTC, Private Bus & Metro verifiers: live camera scanner, manual fallback, valid/invalid verdict.',
      icon: Bus,
      color: 'from-emerald-500/20 to-teal-600/20 text-emerald-400 border-emerald-500/30',
      activeBorder: 'border-emerald-500',
      actionText: 'Enter Verifier Terminal',
      isCurrent: role === 'VERIFIER',
      onSwitch: () => handleRoleSwitch('verifier', () => loginAsDemoVerifier('ksrtc'), 'verifier'),
    },
    {
      id: 'rto',
      title: 'RTO Authority Portal',
      malayalam: 'ആർ.ടി.ഒ അതോറിറ്റി',
      desc: 'State transport department: verifier registry, instant suspension, state-wide audit ledger.',
      icon: ShieldCheck,
      color: 'from-indigo-500/20 to-violet-600/20 text-indigo-400 border-indigo-500/30',
      activeBorder: 'border-indigo-500',
      actionText: 'Enter RTO Authority',
      isCurrent: role === 'RTO',
      onSwitch: () => handleRoleSwitch('rto', loginAsDemoRto, 'rto'),
    },
  ];

  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
        <div>
          <span className="text-xs font-bold font-mono text-sky-600 dark:text-sky-400 tracking-wider uppercase">
            YAATHRI ECOSYSTEM • FOUR ACCREDITED PORTALS
          </span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Role-Specific Portals & Verification Hub
          </h2>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Switch role to test full end-to-end verification workflows
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {portals.map((p) => {
          const Icon = p.icon;
          const isSwitchingThis = switchingId === p.id;
          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 ${
                p.isCurrent
                  ? `${p.activeBorder} shadow-lg ring-1 ring-amber-500/20`
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.color} border flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {p.isCurrent ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                      CURRENT ROLE
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">1-CLICK LOGIN</span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {p.title}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {p.malayalam}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </div>

              <button
                onClick={p.onSwitch}
                disabled={switchingId !== null}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 ${
                  p.isCurrent
                    ? 'bg-slate-900 dark:bg-slate-800 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>
                  {isSwitchingThis
                    ? 'Authenticating...'
                    : p.isCurrent
                    ? 'Active View'
                    : p.actionText}
                </span>
                {!isSwitchingThis && <span className="text-xs">→</span>}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

