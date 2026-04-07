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
  console.log('🔍 [DEBUG] Fetching status for email:', email);
  console.log('🔍 [DEBUG] API URL:', `${API_BASE}/loans/status?email=${encodeURIComponent(email)}`);
  
  try {
    const res = await fetch(`${API_BASE}/loans/status?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🔍 [DEBUG] Response status:', res.status);
    console.log('🔍 [DEBUG] Response ok:', res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [DEBUG] API Error Response:', errorText);
      return { profile_completed: 0, loan_submitted: 0 };
    }
    
    const data = await res.json();
    console.log('✅ [DEBUG] API Success Response:', data);
    return data;
  } catch (error) {
    console.error('❌ [DEBUG] Fetch exception:', error);
    return { profile_completed: 0, loan_submitted: 0 };
  }
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
    console.log('📦 [DEBUG] Stored user data:', stored);
    
    if (stored) {
      try { 
        const parsed = JSON.parse(stored);
        console.log('✅ [DEBUG] Parsed user data:', parsed);
        setUserData(parsed);
      }
      catch { 
        console.error('❌ [DEBUG] Failed to parse user data');
        router.push('/login'); 
      }
    } else {
      console.log('❌ [DEBUG] No user data found in localStorage');
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
    console.log('🔄 [DEBUG] loadStatus called with email:', email);
    setStatusLoading(true);
    setStatusError(null);
    try {
      const s = await fetchProfileStatus(email);
      console.log('📊 [DEBUG] Status result:', s);
      setStatus(s);
      
      // Log what the form will show
      console.log('📊 [DEBUG] profile_completed:', s.profile_completed);
      console.log('📊 [DEBUG] loan_submitted:', s.loan_submitted);
      console.log('📊 [DEBUG] Will show partial form:', s.profile_completed === 1);
    } catch (error) {
      console.error('❌ [DEBUG] Error in loadStatus:', error);
      setStatusError('Could not check your profile status.');
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData?.email) {
      console.log('🔄 [DEBUG] userData.email changed, calling loadStatus');
      loadStatus(userData.email);
    } else {
      console.log('⚠️ [DEBUG] No userData.email available');
    }
  }, [userData, loadStatus]);

  // ── Form submit ──────────────────────────────────────────────────────────────
  const handleFormSubmit = async (data: FormData) => {
    console.log('📝 [DEBUG] Form submitted:', data);
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
    console.log('🔄 [DEBUG] Apply again clicked');
    setShowSuccess(false);
    setSubmittedData(null);
    if (userData?.email) loadStatus(userData.email);
  };

  // ── Guards ───────────────────────────────────────────────────────────────────
  if (!mounted || !userData) {
    console.log('⏳ [DEBUG] Waiting for mount or userData');
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (statusLoading) {
    console.log('⏳ [DEBUG] Status is loading');
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-3">
        <Loader2 size={28} className="text-blue-500 animate-spin" />
        <p className="text-sm text-gray-400">Checking your profile…</p>
      </div>
    );
  }

  if (statusError) {
    console.log('❌ [DEBUG] Status error:', statusError);
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={32} className="text-red-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">{statusError}</p>
        <p className="text-xs text-gray-400 mb-4">Debug: Check console for more details</p>
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

  console.log('🎯 [DEBUG] Final decision:', {
    profileDone,
    loanDone,
    showPartialForm: profileDone,
    status
  });

  // ── Decide what the form shows ───────────────────────────────────────────────
  const showPartialForm = profileDone; // hides borrower + kin steps

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Debug info - remove in production */}
      <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
        <p>Debug: profile_completed={status?.profile_completed}, loan_submitted={status?.loan_submitted}</p>
        <p>Debug: showPartialForm={showPartialForm ? 'true' : 'false'}</p>
      </div>

      {/* ── Success screen (shown right after submission) ── */}
      {showSuccess && submittedData ? (
        // ... rest of your success screen code (keep as is)
        <div>Success Screen</div> // Replace with your actual success screen
      ) : (
        <LoanForm
          darkMode={darkMode}
          onSubmit={handleFormSubmit}
          userEmail={userData.email}
          userName={userData.username}
          skipToCollateral={showPartialForm}
          hideCompletedSteps={showPartialForm}
        />
      )}
    </div>
  );
}