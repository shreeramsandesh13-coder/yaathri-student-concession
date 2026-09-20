import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';

/**
 * Redesigned Authentication Modal
 * - Premium, minimal design system styling
 * - Sign In, Sign Up, and Forgot Password flows
 * - Explicit Demo Account switcher buttons (Student, Institution, Conductor, RTO)
 * - Strict privacy: No default user leakage
 */
export default function AuthModal({ isOpen, onClose }) {
  const {
    login,
    register,
    loginAsDemoStudent,
    loginAsDemoInstitution,
    loginAsDemoVerifier,
    loginAsDemoRto,
  } = useAuth();

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
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
    setSuccessMessage('');
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
      const res = await api.auth.forgotPassword(email);
      setSuccessMessage(res.message || 'Password reset link sent to your registered email.');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send password reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (demoFn) => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await demoFn();
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'login' ? 'Sign In to YAATHRI' : tab === 'register' ? 'Student Registration' : 'Reset Password'}
      subtitle={
        tab === 'login'
          ? 'Enter your credentials or choose an official role'
          : tab === 'register'
          ? 'Enroll in the Kerala student transit concession registry'
          : 'Enter your registered email to receive reset instructions'
      }
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-[#111722] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-white dark:bg-[#111722] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            New Student
          </button>
          <button
            type="button"
            onClick={() => { setTab('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              tab === 'forgot'
                ? 'bg-white dark:bg-[#111722] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Help
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-700 dark:text-emerald-300 flex items-center space-x-2">
            <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="student@yaathri.kerala.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={<span className="material-symbols-outlined text-[18px]">lock</span>}
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setTab('forgot')}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer font-medium"
              >
                Forgot your password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Shreeram Sandesh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Roll Number / ID"
                placeholder="CCE24CS001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>

            <Input
              label="Institutional Email"
              type="email"
              placeholder="student@cce.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<span className="material-symbols-outlined text-[18px]">school</span>}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 98470 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Input
              label="College / School"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Create Account &bull; Apply
            </Button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Send Reset Link
            </Button>
          </form>
        )}

        {/* EXPLICIT DEMO ACCOUNT SWITCHER */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
              EXPLICIT DEMO ACCOUNTS (NO PASSWORD REQUIRED)
            </span>
            <Badge variant="neutral" size="sm">TEST ACCESS</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick(loginAsDemoStudent)}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-500 block mb-1">
                school
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Student</p>
              <p className="text-[10px] font-mono text-slate-500">Demo Pass</p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick(loginAsDemoInstitution)}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px] text-indigo-500 block mb-1">
                admin_panel_settings
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Institution</p>
              <p className="text-[10px] font-mono text-slate-500">Registrar Desk</p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick(() => loginAsDemoVerifier('ksrtc'))}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px] text-amber-500 block mb-1">
                directions_bus
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Conductor</p>
              <p className="text-[10px] font-mono text-slate-500">KSRTC Terminal</p>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoClick(loginAsDemoRto)}
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-left transition-all cursor-pointer focus:outline-none"
            >
              <span className="material-symbols-outlined text-[20px] text-sky-500 block mb-1">
                shield
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">RTO Authority</p>
              <p className="text-[10px] font-mono text-slate-500">Kerala MVD</p>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
