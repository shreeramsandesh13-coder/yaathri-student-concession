import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, loginAsDemoStudent, loginAsDemoAdmin, authError } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('Christ College of Engineering, Irinjalakuda');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      await register({
        email,
        password,
        full_name: fullName,
        roll_number: rollNumber,
        phone,
        college_name: collegeName,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      setSuccessMessage(`Password recovery instructions & OTP dispatched to ${email}. (Demo bypass code: 2026)`);
    } catch (err) {
      setErrorMessage('Unable to process recovery request.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStudent = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginAsDemoStudent();
      onClose();
    } catch (err) {
      setErrorMessage('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      await loginAsDemoAdmin();
      onClose();
    } catch (err) {
      setErrorMessage('Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-white dark:bg-[#0D1118] text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm font-bold text-slate-900 dark:text-white">
                YAATHRI Account
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secure Authentication &amp; RBAC Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 dark:bg-[#111722] rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'login' ? 'bg-white dark:bg-[#1A2333] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'register' ? 'bg-white dark:bg-[#1A2333] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Student Register
          </button>
          <button
            type="button"
            onClick={() => { setTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${tab === 'forgot' ? 'bg-white dark:bg-[#1A2333] text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Recovery
          </button>
        </div>

        {/* Alert Notifications */}
        {(errorMessage || authError) && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs flex items-center space-x-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@cce.edu.in or admin@yaathri.kerala.gov.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Sign In to YAATHRI</span>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Shreeram Sandesh"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Roll / Admission No.
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="CCE24CS001"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98470 12345"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institution / College
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@cce.edu.in"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Create Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60 mt-1"
            >
              {loading ? <span>Creating Student Account...</span> : <span>Complete Registration</span>}
            </button>
          </form>
        )}

        {/* TAB 3: FORGOT PASSWORD */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your registered student or administrative email to receive a password reset token and verification PIN.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="registered-id@domain.edu.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#111722] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
            >
              {loading ? <span>Requesting...</span> : <span>Send Reset Instructions</span>}
            </button>
          </form>
        )}

        {/* QUICK 1-CLICK DEMO AUTH BAR */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 text-center">
            Instant Demo Account Quick-Switch
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickStudent}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/80 text-sky-800 dark:text-sky-300 text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <span>🎓 Student Profile</span>
              <span className="text-[9.5px] opacity-75 font-mono">Shreeram Sandesh</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer"
            >
              <span>🛡️ Admin Portal</span>
              <span className="text-[9.5px] opacity-75 font-mono">Kerala RTO Desk</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

