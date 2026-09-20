import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Mail, CheckCircle2 } from 'lucide-react';

/**
 * FORGOT PASSWORD PAGE (/forgot-password)
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered email to receive password recovery instructions
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B111D] border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Check Your Email</h4>
            <p className="text-xs text-slate-500">
              We have dispatched recovery instructions to <strong className="text-slate-700 dark:text-slate-300">{email}</strong>.
            </p>
            <Link to="/login" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full">
              Send Reset Link &rarr;
            </Button>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Link to="/login" className="text-sky-600 dark:text-sky-400 hover:underline">
                Return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}

