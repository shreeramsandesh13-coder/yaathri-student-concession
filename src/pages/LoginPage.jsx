import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Mail, Lock, UserCheck, ArrowRight, ShieldCheck, Building, Bus, GraduationCap } from 'lucide-react';

/**
 * LOGIN PAGE (/login)
 * Supports email/password authentication across all roles and includes instant demo switchers.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsDemoStudent, loginAsDemoInstitution, loginAsDemoVerifier, loginAsDemoRto } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await login(email, password);
      const role = res?.user?.role?.toUpperCase();

      // If user was trying to reach a specific matching portal route, send them there
      if (from && from !== '/' && from !== '/login') {
        const isRoleMatch =
          (role === 'VERIFIER' && from.startsWith('/verifier')) ||
          (role === 'RTO' && from.startsWith('/rto')) ||
          ((role === 'INSTITUTION' || role === 'ADMIN') && from.startsWith('/institution')) ||
          (role === 'STUDENT' && from.startsWith('/student'));
        if (isRoleMatch) {
          navigate(from, { replace: true });
          return;
        }
      }

      // Default role landing portal
      if (role === 'VERIFIER') navigate('/verifier', { replace: true });
      else if (role === 'RTO') navigate('/rto', { replace: true });
      else if (role === 'INSTITUTION' || role === 'ADMIN') navigate('/institution', { replace: true });
      else navigate('/student', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = async (demoFn, targetRoute) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await demoFn();
      navigate(targetRoute);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to switch demo profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-sky-500/20">
          Y
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mt-3">
          Sign In to YAATHRI
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your accredited student or transport authority credentials
        </p>
      </div>

      {/* Authentication Required Notice */}
      {from && !errorMsg && (
        <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-700 dark:text-sky-300 text-xs font-medium flex items-center space-x-2.5">
          <span className="material-symbols-outlined text-[18px] text-sky-500">lock</span>
          <span>Please sign in with your credentials to access that portal.</span>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Login Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu.in or authority@gov.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-sky-600 dark:text-sky-400 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full shadow-lg dark:shadow-sky-500/20"
          >
            Sign In &rarr;
          </Button>
        </form>

        {/* Demo Fast-Switch Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block text-center">
            Or Explore with Demo Role:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSwitch(loginAsDemoStudent, '/student')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <GraduationCap className="w-3.5 h-3.5 text-sky-500" />
                <span>Student</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">student@yaathri</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSwitch(loginAsDemoInstitution, '/institution')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Building className="w-3.5 h-3.5 text-amber-500" />
                <span>Institution</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">institution@yaathri</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSwitch(() => loginAsDemoVerifier('ksrtc'), '/verifier')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <Bus className="w-3.5 h-3.5 text-emerald-500" />
                <span>Conductor</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">verifier@yaathri</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSwitch(loginAsDemoRto, '/rto')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-left transition-colors cursor-pointer text-xs space-y-1"
            >
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>RTO / MVD</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">rto@yaathri</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/signup" className="font-bold text-sky-600 dark:text-sky-400 hover:underline">
            Register as Student
          </Link>
        </div>

      </div>

    </div>
  );
}

