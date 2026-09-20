import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import YaathriLogo from './YaathriLogo';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { Power, Menu, X, ArrowRight, UserCheck } from 'lucide-react';

/**
 * GLOBAL NAVBAR COMPONENT
 * Real multi-page navigation using React Router Links.
 * Supports active route styling, authenticated role indicators, and full-featured mobile drawer.
 */
export default function Navbar({ studentData }) {
  const { user, isInstitution, isVerifier, isRto, isStudent, isAuthenticated, logout } = useAuth();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How it works', path: '/how-it-works' },
    { label: 'Transport', path: '/transport' },
    { label: 'Verification', path: '/verification' },
    { label: 'Routes', path: '/routes' },
    { label: 'About', path: '/about' },
  ];

  const getPortalRoute = () => {
    if (isVerifier) return '/verifier';
    if (isRto) return '/rto';
    if (isInstitution) return '/institution';
    return '/student';
  };

  const getPortalLabel = () => {
    if (isVerifier) return 'Conductor Terminal';
    if (isRto) return 'RTO Directorate';
    if (isInstitution) return 'Institution Desk';
    return 'Student Portal';
  };

  const getRoleBadgeVariant = () => {
    if (isVerifier) return 'warning';
    if (isRto) return 'info';
    if (isInstitution) return 'neutral';
    return 'success';
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileDrawerOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-[#060B14]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-left group cursor-pointer focus:outline-none"
            aria-label="YAATHRI Home"
          >
            <YaathriLogo variant="full" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 bg-slate-100/80 dark:bg-[#0F172A]/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 lg:px-4 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Authenticated user portal link */}
            {isAuthenticated && (
              <Link
                to={getPortalRoute()}
                className="px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-all"
              >
                {getPortalLabel()}
              </Link>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Authenticated Role Badge */}
            {isAuthenticated && (
              <div className="hidden xl:flex items-center">
                <Badge variant={getRoleBadgeVariant()} size="md" dot>
                  <span className="font-mono text-[11px] uppercase tracking-wider">
                    {user?.role || 'STUDENT'}
                  </span>
                </Badge>
              </div>
            )}

            <ThemeToggle />

            {/* User Action CTAs */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to={getPortalRoute()}>
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={<Power className="w-3.5 h-3.5" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/student/apply">
                  <Button variant="primary" size="sm">
                    Get Your Pass
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-[#0A0F1A] border-l border-slate-200 dark:border-slate-800 h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <YaathriLogo variant="full" />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`block px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Authenticated Mobile Portal Section */}
              {isAuthenticated && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block px-2">
                    Active Authority Portal
                  </span>
                  <Link
                    to={getPortalRoute()}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="block p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 dark:text-sky-300">
                        {getPortalLabel()}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {isAuthenticated ? (
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleLogout}
                  icon={<Power className="w-4 h-4" />}
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="outline" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/student/apply"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="block w-full"
                  >
                    <Button variant="primary" size="md" className="w-full">
                      Get Your Pass &rarr;
                    </Button>
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
