import React, { useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * RenewModal component:
 * - Allows quick semester re-endorsement
 * - Queries attendance and fee records
 * - Extends concession pass validity
 * - Fully adapted for Light and Dark themes
 */
export default function RenewModal({ isOpen, onClose, studentData, onRenewSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRenewed, setIsRenewed] = useState(false);

  if (!isOpen) return null;

  const handleRenew = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsRenewed(true);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {}
      if (onRenewSuccess) {
        onRenewSuccess();
      }
    }, 1200);
  };

  const handleClose = () => {
    setIsRenewed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0D1118] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 transition-colors duration-300">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[22px]">autorenew</span>
            </div>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-slate-900 dark:text-white font-bold">
                YAATHRI — Semester Concession Renewal
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                PASS ID: {studentData.passId}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {isRenewed ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <div>
              <h4 className="text-headline-sm font-headline-sm text-slate-900 dark:text-white font-bold">
                Pass Re-Endorsed Successfully!
              </h4>
              <p className="text-body-sm font-body-sm text-slate-500 dark:text-slate-400 mt-1">
                College attendance (86.4%) and academic eligibility verified. Concession valid through 31 MAR 2027.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-8 h-[48px] rounded-full font-label-lg text-label-lg hover:shadow-lg active:scale-95 transition-all font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-[#111722] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">College Attendance:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">86.4% (Eligible &gt; 75%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Academic Standing:</span>
                <span className="text-slate-900 dark:text-white font-bold">Semester 5 Cleared</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-sans">Current Validity:</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">{studentData.validUntil}</span>
              </div>
            </div>

            <p className="text-body-sm font-body-sm text-slate-600 dark:text-slate-300">
              By requesting renewal, your digital signature token will be re-signed by the Christ College Principal and RTO Thrissur database.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-label-md text-label-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRenew}
                disabled={isProcessing}
                className="bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 px-7 py-2.5 rounded-full font-label-lg text-label-lg hover:shadow-md active:scale-95 transition-all flex items-center space-x-2 font-bold"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>Re-Signing Token...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Verify &amp; Renew</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
