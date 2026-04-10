'use client';

import React, { useState, useEffect } from 'react';
import { UserBanner } from '../home/components/loanformcomponents/useBanner';
import { useTheme } from '../../contexts/ThemeContext';
import {
  DollarSign, Calendar, TrendingUp, Phone, Building2,
  AlertCircle, CheckCircle2, Upload, ArrowRight, Sun, Moon,
  CreditCard, Banknote, ChevronRight, X, Wallet, FileText, Clock
} from 'lucide-react';

interface ApplicantDashboardProps {
  userEmail?: string;
  userName?: string;
}

interface LoanData {
  loan_id:         number;
  borrowed:        number;
  weeks_to_pay:    number;
  total_to_pay:    number;
  weekly_payment:  number;
  interest_rate:   number;
  interest_amount: number;
  total_interest?: number;
  daily_interest?: number;
  status?:         string;
  created_at?:     string;
}

interface Loan {
  loan_id: number;
  loan_amount: number;
  interest_rate: number;
  total_repayment: number;
  duration_weeks: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
}

interface UserInfo {
  user_id: number;
  username: string;
  email: string;
  role: string;
  is_active: number;
  profile_id?: number;
  date_of_birth?: string;
  national_id?: string;
  phone?: string;
  alternative_phone?: string;
  city?: string;
  street?: string;
  house_number?: string;
}

interface UserDetails {
  user: UserInfo;
  employment: any;
  next_of_kin: any;
  id_images: any[];
  collateral: any[];
  loans: Loan[];
}

interface ApiResponse {
  message: string;
  total_users: number;
  data: UserDetails[];
}

interface PaymentData {
  total_amount_paid:  number;
  total_payments:     number;
  remaining_balance:  number;
  payment_progress:   number;
  last_payment_date:  string | null;
}

interface ApprovalData {
  is_approved: boolean;
  status: string;
  loan: {
    loan_id: number;
    loan_amount: number;
    interest_rate: number;
    interest_amount: number;
    total_repayment: number;
    weekly_payment: number;
    duration_weeks: number;
    created_at: string;
  } | null;
}

const emptyLoan: LoanData = {
  loan_id: 0, borrowed: 0, weeks_to_pay: 0,
  total_to_pay: 0, weekly_payment: 0, interest_rate: 0, interest_amount: 0,
  created_at: undefined,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://loan-backend-production-558e.up.railway.app';

const statusColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'active':    return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' };
    case 'approved':  return { bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400'    };
    case 'pending':   return { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   };
    case 'completed': return { bg: 'bg-gray-500/15',    text: 'text-gray-400',    dot: 'bg-gray-400'    };
    default:          return { bg: 'bg-gray-500/15',    text: 'text-gray-400',    dot: 'bg-gray-400'    };
  }
};

// ─── Pending screen shown when loan is not yet approved ───────────────────
const PendingScreen: React.FC<{
  approvalData: ApprovalData;
  dk: boolean;
  resolvedName: string;
  resolvedEmail: string;
  toggleTheme: () => void;
}> = ({ approvalData, dk, resolvedName, resolvedEmail, toggleTheme }) => {
  const loan = approvalData.loan;
  const fmt  = (n: number) => `K${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className={`min-h-screen ${dk ? 'bg-[#0f1117]' : 'bg-[#f5f6fa]'} transition-colors duration-300`}>

      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all
          ${dk ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}
      >
        {dk ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-5">

        <UserBanner darkMode={dk} userEmail={resolvedEmail} userName={resolvedName} />

        {/* Single pending card — pure white */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Amber top stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-orange-400" />

            <div className="p-6">

              {/* Icon + heading */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                  <Clock size={26} className="text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Application Under Review</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Your loan application has been received and is being reviewed by our team.
                  You will be notified once a decision is made.
                </p>
              </div>

              {/* Status badge */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  {(approvalData.status || 'pending').charAt(0).toUpperCase() + (approvalData.status || 'pending').slice(1)}
                </span>
              </div>

              {/* Loan amount + details */}
              {loan && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Application Details</p>

                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-500">Amount applied</span>
                    <span className="text-xl font-bold text-gray-900">
                      K{Number(loan.loan_amount).toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    {[
                      { label: 'Reference',      value: `XT-${loan.loan_id}`                                      },
                      { label: 'Duration',        value: `${loan.duration_weeks} weeks`                            },
                      { label: 'Interest rate',   value: `${loan.interest_rate}%`                                  },
                      { label: 'Total repayment', value: fmt(Number(loan.total_repayment))                         },
                      { label: 'Date submitted',  value: new Date(loan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-semibold text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info note */}
              <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-600 leading-relaxed">
                  Our team reviews applications within 24–48 hours. Check your email for updates or log in again to see your status.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main dashboard ───────────────────────────────────────────────────────
export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  userEmail: emailProp = '',
  userName:  nameProp  = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const dk = theme === 'dark';

  const [selectedMethod,    setSelectedMethod]    = useState<string | null>(null);
  const [showModal,         setShowModal]         = useState(false);
  const [loanData,          setLoanData]          = useState<LoanData>(emptyLoan);
  const [allLoans,          setAllLoans]          = useState<Loan[]>([]);
  const [userDetails,       setUserDetails]       = useState<UserDetails | null>(null);
  const [approvalData,      setApprovalData]      = useState<ApprovalData | null>(null);
  const [paymentData,       setPaymentData]       = useState<PaymentData>({
    total_amount_paid: 0, total_payments: 0,
    remaining_balance: 0, payment_progress: 0, last_payment_date: null,
  });
  const [loading,           setLoading]           = useState(true);
  const [mounted,           setMounted]           = useState(false);
  const [submitting,        setSubmitting]        = useState(false);
  const [selectedFile,      setSelectedFile]      = useState<File | null>(null);
  const [resolvedEmail,     setResolvedEmail]     = useState('');
  const [resolvedName,      setResolvedName]      = useState('');
  const [activeTab,         setActiveTab]         = useState<'bank' | 'mobile'>('bank');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const email = emailProp || localStorage.getItem('userEmail') || '';
    const name  = nameProp  || localStorage.getItem('userName')  || '';
    setResolvedEmail(email);
    setResolvedName(name);
  }, [emailProp, nameProp]);

  useEffect(() => {
    if (!resolvedEmail) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Check approval status first
        const approvalRes = await fetch(`${API_BASE}/api/loans/is-approved?email=${encodeURIComponent(resolvedEmail)}`);
        if (approvalRes.ok) {
          const approvalResult = await approvalRes.json();
          setApprovalData({
            is_approved: approvalResult.is_approved ?? false,
            status:      approvalResult.status       ?? 'pending',
            loan:        approvalResult.loan          ?? null,
          });

          // If not approved, stop here — no need to fetch full dashboard data
          if (!approvalResult.is_approved) {
            setLoading(false);
            return;
          }
        }

        // 2. Approved — fetch full profile & payment data
        const profileRes = await fetch(`${API_BASE}/api/profile/all-details`);
        if (profileRes.ok) {
          const data: ApiResponse = await profileRes.json();
          const userDetail = (data.data ?? []).find(ud =>
            ud.user.email?.toLowerCase() === resolvedEmail.toLowerCase()
          );

          if (userDetail) {
            setUserDetails(userDetail);
            const userLoans = [...(userDetail.loans || [])].sort((a, b) => b.loan_id - a.loan_id);
            setAllLoans(userLoans);

            const current = userLoans[0];
            if (current) {
              const borrowed      = Number(current.loan_amount) || 0;
              const weeksToPay    = Number(current.duration_weeks) || 0;
              const interestRate  = Number(current.interest_rate) || 0;
              const dailyInt      = (borrowed * interestRate) / 100;
              const totalInt      = dailyInt * weeksToPay * 7;
              const totalToPay    = borrowed + totalInt;
              const weeklyPayment = weeksToPay > 0 ? totalToPay / weeksToPay : 0;

              const currentLoanData: LoanData = {
                loan_id: current.loan_id,
                borrowed,
                weeks_to_pay: weeksToPay,
                total_to_pay: totalToPay,
                weekly_payment: weeklyPayment,
                interest_rate: interestRate,
                interest_amount: totalInt,
                total_interest: totalInt,
                daily_interest: dailyInt,
                status: current.status,
              };
              setLoanData(currentLoanData);

              const pmtRes = await fetch(`${API_BASE}/api/loan-payments/total-paid-by-email?email=${encodeURIComponent(resolvedEmail)}`);
              if (pmtRes.ok) {
                const pmtResult = await pmtRes.json();
                if (pmtResult.success && pmtResult.data) {
                  const paid      = pmtResult.data.payment_summary?.total_amount_paid || 0;
                  const total     = currentLoanData.total_to_pay > 0 ? currentLoanData.total_to_pay : 0;
                  const remaining = Math.max(0, total - paid);
                  const progress  = total > 0 ? (paid / total) * 100 : 0;
                  setPaymentData({
                    total_amount_paid:  paid,
                    total_payments:     pmtResult.data.payment_summary?.total_payments || 0,
                    remaining_balance:  remaining,
                    payment_progress:   progress,
                    last_payment_date:  pmtResult.data.payment_summary?.last_payment_date || null,
                  });
                }
              }
            } else {
              setLoanData(emptyLoan);
            }
          }
        }
      } catch (err) {
        console.error('[Dashboard] fetch error:', err);
        setLoanData(emptyLoan);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [resolvedEmail]);

  const handlePaymentSubmit = async () => {
    if (!selectedMethod || !resolvedEmail) { alert('Please select a payment method'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('email',          resolvedEmail);
      fd.append('amount_paid',    String(loanData.weekly_payment));
      fd.append('payment_date',   new Date().toISOString().split('T')[0]);
      fd.append('payment_method', selectedMethod);
      if (selectedFile) fd.append('screenshot', selectedFile);

      const res    = await fetch(`${API_BASE}/api/loan-payments/pay`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.success) {
        alert(`Payment submitted! ${result.email_notification_sent ? 'Confirmation email sent.' : ''}`);
        setShowModal(false);
        setSelectedFile(null);
        window.location.reload();
      } else {
        alert(`Payment failed: ${result.message}`);
      }
    } catch (e) {
      console.error('Payment error:', e);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const paidAmt   = paymentData.total_amount_paid;
  const remAmt    = paymentData.remaining_balance > 0 ? paymentData.remaining_balance : loanData.total_to_pay - paidAmt;
  const remWeeks  = loanData.weekly_payment > 0 ? Math.ceil(Math.max(0, remAmt) / loanData.weekly_payment) : 0;
  const progress  = Math.min(100, paymentData.payment_progress);
  const sc        = statusColor(loanData.status);
  const hasLoan   = loanData.loan_id > 0;

  const bankAccounts = [
    { bank: 'National Bank',       name: 'Robert Mwase', number: '1008203098'    },
    { bank: 'FDH Bank',            name: 'Robert Mwase', number: '140000628157'  },
    { bank: 'First Capital Bank',  name: 'Robert Mwase', number: '0004503119692' },
    { bank: 'Standard Bank',       name: 'Robert Mwase', number: '9100008634197' },
  ];
  const mobileAccounts = [
    { bank: 'Airtel Money Agent',  name: 'Robert Mwase', number: '885584'     },
    { bank: 'Airtel Money Agent',  name: 'Robert Mwase', number: '123324'     },
    { bank: 'TNM Mpamba Agent',    name: 'Robert Mwase', number: '140547'     },
    { bank: 'TNM Mpamba Agent',    name: 'Robert Mwase', number: '2001542'    },
    { bank: 'Airtel Money Dealer', name: 'Robert Mwase', number: '0998843651' },
    { bank: 'Airtel Money Dealer', name: 'Robert Mwase', number: '0983170685' },
  ];

  // All cards are pure white (bg-white), dark mode uses a near-white dark surface
  const cardBg  = 'bg-white';
  const border  = 'border-gray-100';
  const bg      = dk ? 'bg-[#0f1117]' : 'bg-[#f5f6fa]';
  const txt     = 'text-gray-900';
  const muted   = 'text-gray-400';
  const subtle  = 'text-gray-500';
  const inset   = 'bg-gray-50';
  const inp     = 'bg-gray-50 border-gray-200 text-gray-900';

  const fmt  = (n: number) => `K${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtI = (n: number) => `K${n.toLocaleString()}`;

  if (!mounted) return null;

  if (loading) return (
    <div className={`min-h-screen ${bg} p-6`}>
      <div className="max-w-6xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-2xl animate-pulse bg-gray-200" />
        ))}
        <p className="text-center text-sm text-gray-400">Loading your dashboard…</p>
      </div>
    </div>
  );

  // ── Not approved → show pending card only ────────────────────────────────
  if (approvalData && !approvalData.is_approved) {
    return (
      <PendingScreen
        approvalData={approvalData}
        dk={dk}
        resolvedName={resolvedName}
        resolvedEmail={resolvedEmail}
        toggleTheme={toggleTheme}
      />
    );
  }

  // ── Approved → show full dashboard ───────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all
          ${dk ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}
      >
        {dk ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-5">

        <UserBanner darkMode={dk} userEmail={resolvedEmail} userName={resolvedName} />

        {/* ── Stat cards — pure white ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Borrowed',       value: hasLoan ? fmtI(loanData.borrowed)                 : 'K0',  icon: DollarSign, accent: 'text-blue-400',    ring: 'bg-blue-50'    },
            { label: 'Duration',       value: hasLoan ? `${loanData.weeks_to_pay} weeks`         : '—',   icon: Calendar,   accent: 'text-violet-400',  ring: 'bg-violet-50'  },
            { label: 'Weekly payment', value: hasLoan ? `K${loanData.weekly_payment.toFixed(0)}` : 'K0',  icon: TrendingUp, accent: 'text-emerald-400', ring: 'bg-emerald-50' },
          ].map(({ label, value, icon: Icon, accent, ring }) => (
            <div key={label} className={`${cardBg} border ${border} rounded-2xl p-5 flex items-center gap-4 shadow-sm`}>
              <div className={`${ring} p-3 rounded-xl shrink-0`}>
                <Icon className={accent} size={20} />
              </div>
              <div>
                <p className={`text-xs font-medium ${muted} mb-0.5`}>{label}</p>
                <p className={`text-2xl font-semibold ${txt}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Repayment progress card — pure white ── */}
        {hasLoan && (
          <div className={`${cardBg} border ${border} rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-xs ${muted} mb-0.5`}>Loan repayment progress</p>
                <p className={`text-lg font-semibold ${txt}`}>
                  {fmt(paidAmt)} <span className={`text-sm font-normal ${muted}`}>of {fmt(loanData.total_to_pay)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {loanData.status || 'active'}
                </span>
                <span className={`text-sm font-semibold ${txt}`}>{progress.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total paid',     value: fmt(paidAmt),                     color: 'text-blue-500'    },
                { label: 'Remaining',      value: fmt(Math.max(0, remAmt)),          color: 'text-amber-500'   },
                { label: 'Total interest', value: fmt(loanData.total_interest || 0), color: 'text-violet-500'  },
                { label: 'Weeks left',     value: `${remWeeks} wks`,                 color: 'text-emerald-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${inset} rounded-xl p-3`}>
                  <p className={`text-xs ${muted} mb-0.5`}>{label}</p>
                  <p className={`text-base font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── Payment methods — pure white ── */}
          <div className={`lg:col-span-3 ${cardBg} border ${border} rounded-2xl p-5 flex flex-col shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold ${txt}`}>Payment methods</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                Verified accounts only
              </span>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-xl mb-4 bg-amber-50 border border-amber-100">
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-amber-700">
                Only pay to the accounts listed below. Send a screenshot after payment to confirm.
              </p>
            </div>

            <div className="flex gap-1 p-1 rounded-xl mb-4 bg-gray-100">
              {(['bank', 'mobile'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
                    ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  {tab === 'bank'
                    ? <><Banknote size={13} /> Bank transfer</>
                    : <><Phone    size={13} /> Mobile money</>}
                </button>
              ))}
            </div>

            <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight: 320 }}>
              {(activeTab === 'bank' ? bankAccounts : mobileAccounts).map(acc => (
                <button
                  key={acc.number}
                  onClick={() => setSelectedMethod(`${acc.bank} — ${acc.number}`)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                    ${selectedMethod === `${acc.bank} — ${acc.number}`
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${activeTab === 'bank' ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                    {activeTab === 'bank'
                      ? <Banknote size={14} className="text-blue-400" />
                      : <Phone    size={14} className="text-emerald-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${txt}`}>{acc.bank}</p>
                    <p className={`text-xs ${muted}`}>{acc.name} · {acc.number}</p>
                  </div>
                  {selectedMethod === `${acc.bank} — ${acc.number}`
                    ? <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                    : <ChevronRight size={14} className={`${muted} shrink-0`} />}
                </button>
              ))}
            </div>

            {selectedMethod && (
              <div className="mt-4 p-3 rounded-xl flex items-center gap-3 bg-emerald-50 border border-emerald-100">
                <div className="min-w-0 flex-1">
                  <p className={`text-xs ${muted}`}>Selected</p>
                  <p className={`text-sm font-medium truncate ${txt}`}>{selectedMethod}</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="shrink-0 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all"
                >
                  Pay now
                </button>
              </div>
            )}
          </div>

          {/* ── Loan summary — pure white ── */}
          <div className={`lg:col-span-2 ${cardBg} border ${border} rounded-2xl p-5 shadow-sm`}>
            <h2 className={`font-semibold mb-4 ${txt}`}>Loan summary</h2>

            {paymentData.total_payments > 0 && (
              <div className={`${inset} rounded-xl p-3 mb-4 space-y-2`}>
                <div className="flex justify-between text-xs">
                  <span className={muted}>Payments made</span>
                  <span className={`font-semibold ${txt}`}>{paymentData.total_payments}</span>
                </div>
                {paymentData.last_payment_date && (
                  <div className="flex justify-between text-xs">
                    <span className={muted}>Last payment</span>
                    <span className={`font-semibold ${txt}`}>{new Date(paymentData.last_payment_date).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              {[
                { label: 'Principal',       value: hasLoan ? fmtI(loanData.borrowed)                   : 'K0',  color: txt              },
                { label: 'Daily rate',      value: hasLoan ? `${loanData.interest_rate}% / day`         : '—',   color: 'text-blue-500'  },
                { label: 'Daily interest',  value: hasLoan ? `K${loanData.daily_interest?.toFixed(2)}`  : 'K0',  color: 'text-violet-500'},
                { label: 'Total interest',  value: hasLoan ? fmt(loanData.total_interest || 0)          : 'K0',  color: 'text-violet-500'},
                { label: 'Gross total',     value: hasLoan ? fmt(loanData.total_to_pay)                 : 'K0',  color: 'text-emerald-500'},
                { label: 'Total paid',      value: fmt(paidAmt),                                                  color: 'text-blue-500'  },
                { label: 'Balance due',     value: fmt(Math.max(0, remAmt)),                                       color: 'text-amber-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-baseline border-b last:border-0 pb-2.5 last:pb-0 border-gray-100">
                  <span className={`text-xs ${muted}`}>{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              {hasLoan && paidAmt === 0 && (
                <p className="text-xs text-center py-2 rounded-lg bg-gray-50 text-gray-400">
                  No payments recorded yet — start today!
                </p>
              )}
              {hasLoan && paidAmt > 0 && paidAmt < loanData.total_to_pay && (
                <p className="text-xs text-center py-2 rounded-lg bg-amber-50 text-amber-700">
                  💪 {remWeeks} week{remWeeks !== 1 ? 's' : ''} to go — keep it up!
                </p>
              )}
              {hasLoan && paidAmt >= loanData.total_to_pay && loanData.total_to_pay > 0 && (
                <p className="text-xs text-center py-2 rounded-lg bg-emerald-50 text-emerald-700">
                  🎉 Loan fully paid — congratulations!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Daily Repayment Tracker — pure white ── */}
        {hasLoan && (() => {
          const totalDays    = loanData.weeks_to_pay * 7;
          const dailyInt     = loanData.daily_interest ?? 0;
          const principal    = loanData.borrowed;
          const startDate    = new Date(loanData.created_at ?? Date.now());
          startDate.setHours(0, 0, 0, 0);
          const today        = new Date();
          today.setHours(0, 0, 0, 0);
          const daysPassed   = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / 86_400_000));
          const currentDay   = Math.min(daysPassed + 1, totalDays); // 1-based, capped at totalDays
          const amountToday  = principal + dailyInt * currentDay;
          const isOverdue    = daysPassed >= totalDays;

          // Build rows: Day 1 → Day totalDays
          const rows = Array.from({ length: totalDays }, (_, i) => {
            const day        = i + 1;
            const date       = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const amountDue  = principal + dailyInt * day;
            const isPast     = day < currentDay;
            const isToday    = day === currentDay;
            return { day, date, amountDue, isPast, isToday };
          });

          return (
            <div className={`${cardBg} border ${border} rounded-2xl overflow-hidden shadow-sm`}>

              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50">
                    <Calendar size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className={`text-base font-bold ${txt}`}>Daily Repayment Schedule</h2>
                    <p className={`text-xs ${muted}`}>Interest accumulates every day — pay any day to stop further growth</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {/* Today's amount chip */}
                  <div className={`px-4 py-2 rounded-xl text-center ${isOverdue ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-wide ${isOverdue ? 'text-red-400' : 'text-blue-400'}`}>
                      {isOverdue ? 'Overdue' : `Day ${currentDay} — Pay today`}
                    </p>
                    <p className={`text-xl font-bold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                      K{amountToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary strip */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                {[
                  { label: 'Principal',     value: `K${principal.toLocaleString()}`,                                             color: 'text-gray-700'    },
                  { label: 'Daily interest',value: `K${dailyInt.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`, color: 'text-violet-500'  },
                  { label: 'Duration',      value: `${totalDays} days (${loanData.weeks_to_pay} wks)`,                           color: 'text-amber-500'   },
                ].map(({ label, value, color }) => (
                  <div key={label} className="px-5 py-3 text-center">
                    <p className={`text-[11px] ${muted} mb-0.5`}>{label}</p>
                    <p className={`text-sm font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Scrollable day-by-day table */}
              <div className="overflow-y-auto" style={{ maxHeight: 420 }}>
                <table className="w-full">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-100">
                      {['Day', 'Date', 'Amount to pay', 'Daily interest added', ''].map(h => (
                        <th key={h} className={`px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${muted}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rows.map(({ day, date, amountDue, isPast, isToday }) => (
                      <tr
                        key={day}
                        className={`transition-colors ${
                          isToday
                            ? 'bg-blue-50'
                            : isPast
                            ? 'bg-gray-50/60'
                            : 'hover:bg-gray-50/50'
                        }`}
                      >
                        {/* Day number */}
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                            ${isToday ? 'bg-blue-500 text-white' : isPast ? 'bg-gray-200 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                            {day}
                          </span>
                        </td>

                        {/* Date */}
                        <td className={`px-5 py-3 text-sm ${isPast ? muted : isToday ? 'text-blue-600 font-semibold' : subtle}`}>
                          {date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          {isToday && <span className="ml-2 text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-semibold">TODAY</span>}
                        </td>

                        {/* Amount to pay */}
                        <td className={`px-5 py-3 text-sm font-bold
                          ${isToday ? 'text-blue-600' : isPast ? 'text-gray-300' : 'text-gray-800'}`}>
                          K{amountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Daily interest added (cumulative from principal) */}
                        <td className={`px-5 py-3 text-sm ${isPast ? 'text-gray-300' : 'text-violet-500 font-medium'}`}>
                          +K{(dailyInt * day).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>

                        {/* Status tag */}
                        <td className="px-5 py-3">
                          {isToday && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              Pay now
                            </span>
                          )}
                          {isPast && !isToday && (
                            <span className="text-[10px] text-gray-300 font-medium">Passed</span>
                          )}
                          {!isToday && !isPast && (
                            <span className="text-[10px] text-gray-300 font-medium">Upcoming</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer note */}
              <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <AlertCircle size={13} className="text-amber-500 shrink-0" />
                <p className="text-xs text-gray-400">
                  The amount shown for each day is <span className="font-semibold text-gray-600">principal + accumulated interest up to that day</span>.
                  Paying earlier means less interest.
                </p>
              </div>
            </div>
          );
        })()}

        {/* ── Calculation breakdown — pure white ── */}
        {hasLoan && (
          <div className={`${cardBg} border ${border} rounded-2xl p-5 shadow-sm`}>
            <h2 className={`font-semibold mb-4 ${txt}`}>Calculation breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Principal',      value: fmtI(loanData.borrowed),                  accent: 'text-blue-500'   },
                { label: 'Daily rate',     value: `${loanData.interest_rate}%`,              accent: 'text-violet-500' },
                { label: 'Daily interest', value: `K${loanData.daily_interest?.toFixed(2)}`, accent: 'text-violet-500' },
                { label: 'Total days',     value: `${loanData.weeks_to_pay * 7}`,            accent: 'text-amber-500'  },
              ].map(({ label, value, accent }) => (
                <div key={label} className={`${inset} rounded-xl p-3`}>
                  <p className={`text-xs ${muted} mb-1`}>{label}</p>
                  <p className={`text-lg font-semibold ${accent}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 space-y-1.5 text-xs bg-emerald-50 border border-emerald-100">
              {[
                `Daily interest = K${fmtI(loanData.borrowed)} × ${loanData.interest_rate}% ÷ 100 = K${loanData.daily_interest?.toFixed(2)} / day`,
                `Total days = ${loanData.weeks_to_pay} weeks × 7 = ${loanData.weeks_to_pay * 7} days`,
                `Total interest = K${loanData.daily_interest?.toFixed(2)} × ${loanData.weeks_to_pay * 7} = K${loanData.total_interest?.toFixed(2)}`,
                `Gross repayment = ${fmtI(loanData.borrowed)} + K${loanData.total_interest?.toFixed(2)} = ${fmt(loanData.total_to_pay)}`,
                `Weekly payment = ${fmt(loanData.total_to_pay)} ÷ ${loanData.weeks_to_pay} = K${loanData.weekly_payment.toFixed(0)} / week`,
              ].map((line, i) => (
                <p key={i} className="text-emerald-700">• {line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Payment modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-semibold ${txt}`}>Confirm payment</h3>
              <button
                onClick={() => { setShowModal(false); setSelectedFile(null); }}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={16} className={muted} />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`${inset} rounded-xl p-4`}>
                <p className={`text-xs ${muted} mb-1`}>Payment to</p>
                <p className={`text-sm font-medium ${txt}`}>{selectedMethod}</p>
              </div>

              <div className={`${inset} rounded-xl p-4 flex justify-between items-center`}>
                <div>
                  <p className={`text-xs ${muted} mb-1`}>Amount due</p>
                  <p className={`text-2xl font-semibold ${txt}`}>K{loanData.weekly_payment.toFixed(0)}</p>
                </div>
                <Wallet className="text-emerald-400" size={28} />
              </div>

              <div>
                <p className={`text-xs font-medium ${subtle} mb-2`}>Upload payment screenshot</p>
                <label htmlFor="ss-upload" className="flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                  <Upload className={muted} size={20} />
                  <span className={`text-xs ${muted}`}>{selectedFile ? selectedFile.name : 'Tap to upload screenshot'}</span>
                  <input type="file" id="ss-upload" accept="image/*" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setSelectedFile(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing…' : 'Submit payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;