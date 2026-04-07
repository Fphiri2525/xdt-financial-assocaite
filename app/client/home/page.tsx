'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, CheckCircle, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import LoanForm from '../home/components/LoanInfo';
import { FormData } from '../home/components/loanformcomponents/type';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData {
  username: string;
  email: string;
  role?: string;
}

interface ProfileStatus {
  profile_completed: number; // 1 = user_profiles row exists
  loan_submitted:    number; // 1 = loans row exists
  profile_id?:       number;
}

const API_BASE = 'https://loan-backend-production-558e.up.railway.app/api';

async function fetchProfileStatus(email: string): Promise<ProfileStatus> {
  const res = await fetch(`${API_BASE}/loans/status?email=${encodeURIComponent(email)}`);
  if (!res.ok) return { profile_completed: 0, loan_submitted: 0 };
  return res.json();
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ label, done }: { label: string; done: boolean }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
    ${done
      ? 'bg-green-50 border-green-200 text-green-700'
      : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
    {done
      ? <CheckCircle size={12} className="text-green-500" />
      : <AlertCircle size={12} className="text-amber-500" />}
    {label}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoanDashboard() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [status, setStatus]               = useState<ProfileStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError]     = useState<string | null>(null);

  const [showSuccess, setShowSuccess]           = useState(false);
  const [submittedData, setSubmittedData]       = useState<FormData | null>(null);
  const [totalRepayment, setTotalRepayment]     = useState(0);

  const interestRates = [
    { min: 0,      max: 9000,   rate: 1.30 },
    { min: 10000,  max: 90000,  rate: 1.20 },
    { min: 110000, max: 140000, rate: 1.10 },
    { min: 150000, max: 200000, rate: 1.05 },
  ];

  // ── Mount / auth ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUserData(JSON.parse(stored)); }
      catch { router.push('/login'); }
    } else {
      router.push('/login');
    }
    if (localStorage.getItem('theme') === 'dark') setDarkMode(true);
  }, [router]);

  // ── Theme observer ───────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setDarkMode(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // ── Fetch status ─────────────────────────────────────────────────────────────
  const loadStatus = useCallback(async (email: string) => {
    setStatusLoading(true);
    setStatusError(null);
    try {
      const s = await fetchProfileStatus(email);
      setStatus(s);
    } catch {
      setStatusError('Could not check your profile status.');
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData?.email) loadStatus(userData.email);
  }, [userData, loadStatus]);

  // ── Form submit ──────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data: FormData) => {
    setSubmittedData(data);

    if (data.loanAmount > 0) {
      const cfg = interestRates.find(r => data.loanAmount >= r.min && data.loanAmount <= r.max)
        ?? interestRates[interestRates.length - 1];
      setTotalRepayment(data.loanAmount * cfg.rate);
    }

    setShowSuccess(true);
    if (userData?.email) await loadStatus(userData.email);
  };

  const handleApplyAgain = () => {
    setShowSuccess(false);
    setSubmittedData(null);
    if (userData?.email) loadStatus(userData.email);
  };

  // ── Guards ───────────────────────────────────────────────────────────────────
  if (!mounted || !userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-3">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
        <p className="text-sm text-gray-400">Checking your profile…</p>
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={32} className="text-red-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">{statusError}</p>
        <button
          onClick={() => userData?.email && loadStatus(userData.email)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const profileDone = (status?.profile_completed ?? 0) === 1;
  const loanDone    = (status?.loan_submitted    ?? 0) === 1;

  // ── Decide what the form shows ───────────────────────────────────────────────
  //
  //  profileDone = false  →  full 4-step form (borrower, kin, collateral, review)
  //  profileDone = true   →  only Collateral + Loan Application (Review)
  //                          — this applies whether loanDone is true OR false
  //                          — the user can always re-submit collateral / loan
  //
  const showPartialForm = profileDone; // hides borrower + kin steps

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Welcome message */}
      <div className="mb-6 text-center">
        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Welcome, {userData.username}!
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Please fill out the form below to apply for your loan
        </p>
      </div>

      {/* ── Success screen (shown right after submission) ── */}
      {showSuccess && submittedData ? (
        <div className={`rounded-2xl border shadow-sm p-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>

          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Application Submitted!
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Thank you, <span className="font-bold text-blue-600">{userData.username}</span>!
            </p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loan Reference: <span className="font-mono font-medium">LOAN-{Date.now().toString().slice(-8)}</span>
            </p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Loan Amount',  value: `K${submittedData.loanAmount.toLocaleString()}`,  bg: darkMode ? 'bg-gray-700' : 'bg-blue-50',   bold: false },
              { label: 'Total to Pay', value: `K${totalRepayment.toLocaleString()}`,              bg: darkMode ? 'bg-gray-700' : 'bg-green-50',  bold: true  },
              { label: 'Duration',     value: `${submittedData.loanDuration} week${submittedData.loanDuration > 1 ? 's' : ''}`, bg: darkMode ? 'bg-gray-700' : 'bg-purple-50', bold: false },
            ].map(({ label, value, bg, bold }) => (
              <div key={label} className={`p-4 rounded-xl ${bg}`}>
                <p className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                <p className={`text-2xl font-bold ${bold ? 'text-green-600' : darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Payment schedule */}
          <div className={`mb-8 p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Calendar size={16} /> Payment Schedule
            </h3>
            <div className="space-y-1">
              {Array.from({ length: submittedData.loanDuration }).map((_, i) => {
                const due = new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000);
                return (
                  <div key={i} className={`flex justify-between items-center py-2 border-b last:border-0 text-sm
                    ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-100 text-gray-700'}`}>
                    <span>Week {i + 1}</span>
                    <span className="font-medium">K{(totalRepayment / submittedData.loanDuration).toLocaleString()}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-400'}>Due: {due.toLocaleDateString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Official payment details */}
          <div className={`p-6 rounded-xl border-2 ${darkMode ? 'border-green-800 bg-gray-700' : 'border-green-200 bg-green-50'}`}>
            <h3 className={`text-lg font-bold mb-4 text-center ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
              ✦ OFFICIAL PAYMENT DETAILS ✦
            </h3>
            <div className="space-y-3">
              {[
                { label: 'NATIONAL BANK',               lines: ['Robert Mwase — 1008203098'] },
                { label: 'AIRTEL MONEY AGENT CODE',     lines: ['Robert Mwase — 885584', 'Robert Mwase — 123324'] },
                { label: 'TNM MPAMBA AGENT CODE',       lines: ['Robert Mwase — 140547', 'Robert Mwase — 2001542'] },
                { label: 'AIRTEL MONEY DEALER NUMBERS', lines: ['Robert Mwase — 0998843651', 'Robert Mwase — 0983170685'] },
                { label: 'FDH BANK',                    lines: ['Robert Mwase — 140000628157'] },
                { label: 'FIRST CAPITAL BANK',          lines: ['Robert Mwase — 0004503119692'] },
                { label: 'STANDARD BANK',               lines: ['Robert Mwase — 9100008634197'] },
              ].map(({ label, lines }) => (
                <div key={label} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{label}</p>
                  {lines.map(l => <p key={l} className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{l}</p>)}
                </div>
              ))}
            </div>
            <div className={`mt-4 p-3 rounded-lg text-center text-sm font-semibold ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-50 text-red-700'}`}>
              Any payment details NOT listed above is not legitimate.
            </div>
            <div className={`mt-3 p-3 rounded-lg text-center text-sm font-semibold ${darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}`}>
              Remember to send a screenshot after payment.
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <button
              onClick={handleApplyAgain}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold text-sm"
            >
              Back to Application
            </button>
            <button
              onClick={() => window.print()}
              className={`px-6 py-3 rounded-xl border transition font-semibold text-sm
                ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Print Details
            </button>
          </div>
        </div>

      ) : (
        /* ── The form ── */
        <div>
          <LoanForm
            darkMode={darkMode}
            onSubmit={handleFormSubmit}
            userEmail={userData.email}
            userName={userData.username}
            skipToCollateral={showPartialForm}
            hideCompletedSteps={showPartialForm}
          />
        </div>
      )}
    </div>
  );
}