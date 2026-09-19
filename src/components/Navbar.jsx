import React from 'react';
import ThemeToggle from './ThemeToggle';
import YaathriLogo from './YaathriLogo';
import { useAuth } from '../context/AuthContext';

/**
 * Navbar component:
 * - Desktop top navigation bar with official YAATHRI branding, active QR verified status badge, quick nav tabs, ThemeToggle, and avatar
 * - Mobile bottom floating pill navigation bar with active indicators and quick ThemeToggle
 * - Dynamic Admin Desk tab and RBAC identity switcher
 */
export default function Navbar({ activeTab, setActiveTab, onOpenApply, onOpenAuth, studentData }) {
  const { user, role, isInstitution, isVerifier, isRto, isStudent, isAuthenticated, logout } = useAuth();

  let navItems = [];
  if (isVerifier) {
    navItems = [
      { id: 'verifier', label: 'Conductor Terminal', icon: 'qr_code_scanner' },
      { id: 'portals', label: 'Switch Portal', icon: 'swap_horiz' },
    ];
  } else if (isRto) {
    navItems = [
      { id: 'rto', label: 'RTO Authority', icon: 'shield' },
      { id: 'portals', label: 'Switch Portal', icon: 'swap_horiz' },
    ];
  } else if (isInstitution) {
    navItems = [
      { id: 'admin', label: 'Institution Desk', icon: 'admin_panel_settings' },
      { id: 'portals', label: 'Switch Portal', icon: 'swap_horiz' },
    ];
  } else {
    // Student or Public Guest
    navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'pass', label: 'My Pass', icon: 'credit_card' },
      { id: 'apply', label: 'Apply', icon: 'app_registration', action: onOpenApply },
      { id: 'history', label: 'History', icon: 'history' },
      { id: 'portals', label: 'Portals', icon: 'hub' },
    ];
  }

  const handleLogout = async () => {
    await logout();
    setActiveTab('dashboard');
  };

  const getRoleBadge = () => {
    if (isVerifier) return { icon: '🚌', label: 'Conductor Terminal', role: 'VERIFIER', color: 'text-amber-500' };
    if (isRto) return { icon: '🏛️', label: 'Kerala RTO Authority', role: 'RTO', color: 'text-sky-400' };
    if (isInstitution) return { icon: '🏫', label: 'Institution Desk', role: 'INSTITUTION', color: 'text-indigo-400' };
    return { icon: '🎓', label: studentData?.name || user?.email?.split('@')[0] || 'Student', role: 'STUDENT', color: 'text-emerald-400' };
  };

  const badge = getRoleBadge();

  return (
    <>
      {/* Top Desktop & Tablet Header */}
      <header className="bg-white/85 dark:bg-[#090C12]/85 backdrop-blur-md text-on-surface dark:text-slate-100 border-b border-slate-200/80 dark:border-slate-800/80 fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 md:px-8 py-2.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Official YAATHRI Logo & Identity */}
          <button
            onClick={() => {
              if (isVerifier) setActiveTab('verifier');
              else if (isRto) setActiveTab('rto');
              else if (isInstitution) setActiveTab('admin');
              else setActiveTab('dashboard');
            }}
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
          >
            <YaathriLogo variant="full" />
          </button>

          {/* Desktop Global Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 text-label-md font-label-md bg-slate-100/80 dark:bg-[#111722]/90 p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-full transition-all duration-150 font-medium cursor-pointer ${
                    isActive
                      ? 'bg-[#081b2e] text-white dark:bg-sky-500 dark:text-slate-950 shadow-md font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Trailing Actions: RBAC Status, QR Badge, ThemeToggle, Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Active Portal Badge */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-900/90 rounded-full border border-slate-200 dark:border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-label-caps font-label-caps text-slate-700 dark:text-slate-300 tracking-wider">
                {badge.role}
              </span>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* User Auth / Account Switcher Pill */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1.5 bg-slate-100/80 dark:bg-[#111722] p-1 pr-2 rounded-full border border-slate-200 dark:border-slate-800">
                <button
                  onClick={onOpenAuth}
                  className="flex items-center space-x-2 text-left cursor-pointer hover:opacity-80 transition-opacity"
                  title="Switch Account / Manage Access"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                    {badge.icon}
                  </div>
                  <div className="hidden sm:flex flex-col pr-1">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                      {badge.label}
                    </span>
                    <span className={`text-[9px] font-bold tracking-wider uppercase font-mono ${badge.color}`}>
                      {badge.role}
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 text-xs font-bold shadow-sm hover:shadow active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Pill Navigation Bar */}
      <nav className="bg-white/95 dark:bg-[#0D1118]/95 backdrop-blur-lg border border-slate-200 dark:border-slate-800 shadow-xl rounded-full mb-3 mx-4 fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-2 py-1.5 md:hidden transition-colors duration-300">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.action) {
                  item.action();
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-full transition-all duration-150 ${
                isActive
                  ? 'bg-[#081b2e] text-white dark:bg-sky-500 dark:text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              <span className="text-[9px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
