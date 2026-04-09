'use client';

import React, { useState, useEffect } from 'react';
import { UserBanner } from '../home/components/loanformcomponents/useBanner';
import { useTheme } from '../../contexts/ThemeContext';
import {
  DollarSign, Calendar, TrendingUp, Phone, Building2,
  AlertCircle, CheckCircle2, Upload, ArrowRight, Sun, Moon,
  CreditCard, Banknote, ChevronRight, X, Wallet, FileText
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
}

// Interfaces from RecentApplications.tsx logic
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

const emptyLoan: LoanData = {
  loan_id: 0, borrowed: 0, weeks_to_pay: 0,
  total_to_pay: 0, weekly_payment: 0, interest_rate: 0, interest_amount: 0,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://loan-backend-production-558e.up.railway.app';

// ─── Status badge helper ───────────────────────────────────────────────────
const statusColor = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'active':    return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' };
    case 'approved':  return { bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400'    };
    case 'pending':   return { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400'   };
    case 'completed': return { bg: 'bg-gray-500/15',    text: 'text-gray-400',    dot: 'bg-gray-400'    };
    default:          return { bg: 'bg-gray-500/15',    text: 'text-gray-400',    dot: 'bg-gray-400'    };
  }
};

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
        // Use the "working" logic from RecentApplications.tsx
        const profileRes = await fetch(`${API_BASE}/api/profile/all-details`);
        if (profileRes.ok) {
          const data: ApiResponse = await profileRes.json();
          const userDetail = (data.data ?? []).find(ud => ud.user.email?.toLowerCase() === resolvedEmail.toLowerCase());
          
          if (userDetail) {
            setUserDetails(userDetail);
            const userLoans = [...(userDetail.loans || [])].sort((a, b) => b.loan_id - a.loan_id);
            setAllLoans(userLoans);
            
            // Current loan is the most recent active/approved/pending one
            const current = userLoans[0];
            if (current) {
              const borrowed      = Number(current.loan_amount) || 0;
              const weeksToPay    = Number(current.duration_weeks) || 0;
              const interestRate  = Number(current.interest_rate) || 0;
              // Some interest calculations from current implementation
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

              // Now fetch payment data for this specific loan
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
        } else {
          console.error('[Dashboard] Failed to fetch profile details');
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

  const paidAmt       = paymentData.total_amount_paid;
  const remAmt        = paymentData.remaining_balance > 0 ? paymentData.remaining_balance : loanData.total_to_pay - paidAmt;
  const remWeeks      = loanData.weekly_payment > 0 ? Math.ceil(Math.max(0, remAmt) / loanData.weekly_payment) : 0;
  const progress      = Math.min(100, paymentData.payment_progress);
  const sc            = statusColor(loanData.status);
  const hasLoan       = loanData.loan_id > 0;

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

  // ─── theme helpers ────────────────────────────────────────────────────────
  const bg      = dk ? 'bg-[#0f1117]'          : 'bg-[#f5f6fa]';
  const surface = dk ? 'bg-[#1a1d27]'          : 'bg-white';
  const border  = dk ? 'border-white/[0.07]'   : 'border-black/[0.07]';
  const txt     = dk ? 'text-white'             : 'text-gray-900';
  const muted   = dk ? 'text-gray-400'          : 'text-gray-500';
  const subtle  = dk ? 'text-gray-300'          : 'text-gray-600';
  const inset   = dk ? 'bg-white/[0.04]'        : 'bg-gray-50';
  const inp     = dk ? 'bg-white/[0.06] border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900';

  const fmt  = (n: number) => `K${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtI = (n: number) => `K${n.toLocaleString()}`;

  if (!mounted) return null;

  if (loading) return (
    <div className={`min-h-screen ${bg} p-6`}>
      <div className="max-w-6xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-24 rounded-2xl animate-pulse ${dk ? 'bg-white/[0.06]' : 'bg-gray-200'}`} />
        ))}
        <p className={`text-center text-sm ${muted}`}>Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>

      {/* ── Theme toggle ── */}
      <button
        onClick={toggleTheme}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all
          ${dk ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-gray-900 hover:bg-gray-700 text-white'}`}
      >
        {dk ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 space-y-5">

        {/* ── Banner ── */}
        <UserBanner darkMode={dk} userEmail={resolvedEmail} userName={resolvedName} />

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Borrowed',        value: hasLoan ? fmtI(loanData.borrowed)                    : 'K0',       icon: DollarSign, accent: 'text-blue-400',   ring: dk ? 'bg-blue-400/10'   : 'bg-blue-50'   },
            { label: 'Duration',        value: hasLoan ? `${loanData.weeks_to_pay} weeks`            : '—',        icon: Calendar,   accent: 'text-violet-400', ring: dk ? 'bg-violet-400/10' : 'bg-violet-50' },
            { label: 'Weekly payment',  value: hasLoan ? `K${loanData.weekly_payment.toFixed(0)}`    : 'K0',       icon: TrendingUp, accent: 'text-emerald-400',ring: dk ? 'bg-emerald-400/10': 'bg-emerald-50' },
          ].map(({ label, value, icon: Icon, accent, ring }) => (
            <div key={label} className={`${surface} border ${border} rounded-2xl p-5 flex items-center gap-4`}>
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

        {/* ── Loan status + progress bar (full width) ── */}
        {hasLoan && (
          <div className={`${surface} border ${border} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className={`text-xs ${muted} mb-0.5`}>Loan repayment progress</p>
                <p className={`text-lg font-semibold ${txt}`}>{fmt(paidAmt)} <span className={`text-sm font-normal ${muted}`}>of {fmt(loanData.total_to_pay)}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {loanData.status || 'active'}
                </span>
                <span className={`text-sm font-semibold ${txt}`}>{progress.toFixed(1)}%</span>
              </div>
            </div>
            <div className={`w-full h-2 rounded-full ${dk ? 'bg-white/10' : 'bg-gray-100'}`}>
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total paid',     value: fmt(paidAmt),                         color: 'text-blue-400'    },
                { label: 'Remaining',      value: fmt(Math.max(0, remAmt)),              color: 'text-amber-400'   },
                { label: 'Total interest', value: fmt(loanData.total_interest || 0),     color: 'text-violet-400'  },
                { label: 'Weeks left',     value: `${remWeeks} wks`,                     color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`${inset} rounded-xl p-3`}>
                  <p className={`text-xs ${muted} mb-0.5`}>{label}</p>
                  <p className={`text-base font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* ── Payment methods (left, wider) ── */}
          <div className={`lg:col-span-3 ${surface} border ${border} rounded-2xl p-5 flex flex-col`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold ${txt}`}>Payment methods</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full ${dk ? 'bg-amber-400/10 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                Verified accounts only
              </span>
            </div>

            <div className={`flex items-start gap-2 p-3 rounded-xl mb-4 ${dk ? 'bg-amber-500/8 border border-amber-500/15' : 'bg-amber-50 border border-amber-100'}`}>
              <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <p className={`text-xs leading-relaxed ${dk ? 'text-amber-300' : 'text-amber-700'}`}>
                Only pay to the accounts listed below. Send a screenshot after payment to confirm.
              </p>
            </div>

            {/* Tabs */}
            <div className={`flex gap-1 p-1 rounded-xl mb-4 ${dk ? 'bg-white/[0.04]' : 'bg-gray-100'}`}>
              {(['bank', 'mobile'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
                    ${activeTab === tab
                      ? dk ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm'
                      : muted}`}
                >
                  {tab === 'bank' ? <><Banknote size={13} /> Bank transfer</> : <><Phone size={13} /> Mobile money</>}
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
                      ? dk ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-300 bg-blue-50'
                      : dk ? `border-white/[0.06] ${inset} hover:border-white/10` : `border-black/[0.06] ${inset} hover:border-black/10`}`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${activeTab === 'bank' ? dk ? 'bg-blue-400/10' : 'bg-blue-50' : dk ? 'bg-emerald-400/10' : 'bg-emerald-50'}`}>
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

            {/* Make Payment CTA */}
            {selectedMethod && (
              <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 ${dk ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-100'}`}>
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

          {/* ── Loan summary card (right) ── */}
          <div className={`lg:col-span-2 ${surface} border ${border} rounded-2xl p-5`}>
            <h2 className={`font-semibold mb-4 ${txt}`}>Loan summary</h2>

            {/* Payment stats */}
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
                { label: 'Principal',       value: hasLoan ? fmtI(loanData.borrowed)                  : 'K0',   color: txt             },
                { label: 'Daily rate',      value: hasLoan ? `${loanData.interest_rate}% / day`        : '—',    color: 'text-blue-400' },
                { label: 'Daily interest',  value: hasLoan ? `K${loanData.daily_interest?.toFixed(2)}` : 'K0',   color: 'text-violet-400'},
                { label: 'Total interest',  value: hasLoan ? fmt(loanData.total_interest || 0)         : 'K0',   color: 'text-violet-400'},
                { label: 'Gross total',     value: hasLoan ? fmt(loanData.total_to_pay)                : 'K0',   color: 'text-emerald-400'},
                { label: 'Total paid',      value: fmt(paidAmt),                                                  color: 'text-blue-400' },
                { label: 'Balance due',     value: fmt(Math.max(0, remAmt)),                                       color: 'text-amber-400'},
              ].map(({ label, value, color }) => (
                <div key={label} className={`flex justify-between items-baseline border-b last:border-0 pb-2.5 last:pb-0 ${dk ? 'border-white/[0.05]' : 'border-gray-100'}`}>
                  <span className={`text-xs ${muted}`}>{label}</span>
                  <span className={`text-sm font-semibold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Status messages */}
            <div className="mt-4">
              {hasLoan && paidAmt === 0 && (
                <p className={`text-xs text-center py-2 rounded-lg ${dk ? 'bg-white/[0.04] text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                  No payments recorded yet — start today!
                </p>
              )}
              {hasLoan && paidAmt > 0 && paidAmt < loanData.total_to_pay && (
                <p className={`text-xs text-center py-2 rounded-lg ${dk ? 'bg-amber-500/8 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                  💪 {remWeeks} week{remWeeks !== 1 ? 's' : ''} to go — keep it up!
                </p>
              )}
              {hasLoan && paidAmt >= loanData.total_to_pay && loanData.total_to_pay > 0 && (
                <p className={`text-xs text-center py-2 rounded-lg ${dk ? 'bg-emerald-500/8 text-emerald-300' : 'bg-emerald-50 text-emerald-700'}`}>
                  🎉 Loan fully paid — congratulations!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Recent Applications Table ── */}
        <div className={`${surface} border ${border} rounded-2xl overflow-hidden`}>
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${dk ? 'bg-blue-400/10' : 'bg-blue-50'}`}>
                <FileText size={16} className="text-blue-400" />
              </div>
              <h2 className={`text-base font-bold ${txt}`}>Recent Applications</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            {allLoans.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={40} className={`mx-auto mb-3 ${dk ? 'text-white/10' : 'text-gray-100'}`} />
                <p className={`text-sm ${muted}`}>No applications found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${dk ? 'border-white/[0.05]' : 'border-gray-100'}`}>
                    {['Loan ID', 'Amount', 'Duration', 'Interest', 'Total Repayment', 'Status'].map((h) => (
                      <th key={h} className={`px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider ${muted}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${dk ? 'divide-white/[0.05]' : 'divide-gray-50'}`}>
                  {allLoans.map((loan) => {
                    const sc = statusColor(loan.status);
                    return (
                      <tr key={loan.loan_id} className={`hover:${dk ? 'bg-white/[0.02]' : 'bg-gray-50/50'} transition-colors`}>
                        <td className="px-6 py-4 text-sm font-medium text-blue-400">
                          #{loan.loan_id}
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold ${txt}`}>
                          {fmtI(loan.loan_amount)}
                        </td>
                        <td className={`px-6 py-4 text-sm ${subtle}`}>
                          {loan.duration_weeks} weeks
                        </td>
                        <td className={`px-6 py-4 text-sm ${subtle}`}>
                          {loan.interest_rate}%
                        </td>
                        <td className={`px-6 py-4 text-sm font-semibold ${txt}`}>
                          {fmt(loan.total_repayment || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${sc.bg} ${sc.text}`}>
                            <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Loan calculation breakdown ── */}
        {hasLoan && (
          <div className={`${surface} border ${border} rounded-2xl p-5`}>
            <h2 className={`font-semibold mb-4 ${txt}`}>Calculation breakdown</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Principal',      value: fmtI(loanData.borrowed),                     accent: 'text-blue-400'    },
                { label: 'Daily rate',     value: `${loanData.interest_rate}%`,                 accent: 'text-violet-400'  },
                { label: 'Daily interest', value: `K${loanData.daily_interest?.toFixed(2)}`,    accent: 'text-violet-400'  },
                { label: 'Total days',     value: `${loanData.weeks_to_pay * 7}`,               accent: 'text-amber-400'   },
              ].map(({ label, value, accent }) => (
                <div key={label} className={`${inset} rounded-xl p-3`}>
                  <p className={`text-xs ${muted} mb-1`}>{label}</p>
                  <p className={`text-lg font-semibold ${accent}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className={`rounded-xl p-4 space-y-1.5 text-xs ${dk ? 'bg-emerald-500/8 border border-emerald-500/15' : 'bg-emerald-50 border border-emerald-100'}`}>
              {[
                `Daily interest = K${fmtI(loanData.borrowed)} × ${loanData.interest_rate}% ÷ 100 = K${loanData.daily_interest?.toFixed(2)} / day`,
                `Total days = ${loanData.weeks_to_pay} weeks × 7 = ${loanData.weeks_to_pay * 7} days`,
                `Total interest = K${loanData.daily_interest?.toFixed(2)} × ${loanData.weeks_to_pay * 7} = K${loanData.total_interest?.toFixed(2)}`,
                `Gross repayment = ${fmtI(loanData.borrowed)} + K${loanData.total_interest?.toFixed(2)} = ${fmt(loanData.total_to_pay)}`,
                `Weekly payment = ${fmt(loanData.total_to_pay)} ÷ ${loanData.weeks_to_pay} = K${loanData.weekly_payment.toFixed(0)} / week`,
              ].map((line, i) => (
                <p key={i} className={dk ? 'text-emerald-300/80' : 'text-emerald-700'}>• {line}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Payment modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md ${surface} rounded-2xl border ${border} p-6`}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`font-semibold ${txt}`}>Confirm payment</h3>
              <button onClick={() => { setShowModal(false); setSelectedFile(null); }}
                className={`p-1.5 rounded-lg ${dk ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
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
                <label htmlFor="ss-upload" className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-colors
                  ${dk ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'}`}>
                  <Upload className={muted} size={20} />
                  <span className={`text-xs ${muted}`}>{selectedFile ? selectedFile.name : 'Tap to upload screenshot'}</span>
                  <input type="file" id="ss-upload" accept="image/*" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowModal(false); setSelectedFile(null); }}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors
                    ${dk ? 'border-white/10 text-gray-300 hover:bg-white/[0.06]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
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