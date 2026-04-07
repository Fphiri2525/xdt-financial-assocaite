// components/ApplicantDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { UserBanner } from '../home/components/loanformcomponents/useBanner';
import { useTheme } from '../../contexts/ThemeContext';
import {
  DollarSign, Calendar, TrendingUp, Phone, Building2,
  AlertCircle, CheckCircle2, Upload, ArrowRight, Sun, Moon
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

interface PaymentData {
  total_amount_paid: number;
  total_payments: number;
  remaining_balance: number;
  payment_progress: number;
  last_payment_date: string | null;
}

const emptyLoan: LoanData = {
  loan_id:         0,
  borrowed:        0,
  weeks_to_pay:    0,
  total_to_pay:    0,
  weekly_payment:  0,
  interest_rate:   0,
  interest_amount: 0,
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://loan-backend-production-558e.up.railway.app';

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  userEmail: emailProp = '',
  userName: nameProp   = '',
}) => {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal]           = useState(false);
  const [loanData, setLoanData]                           = useState<LoanData>(emptyLoan);
  const [paymentData, setPaymentData]                     = useState<PaymentData>({
    total_amount_paid: 0,
    total_payments: 0,
    remaining_balance: 0,
    payment_progress: 0,
    last_payment_date: null
  });
  const [loading, setLoading]                             = useState(true);
  const [mounted, setMounted]                             = useState(false);
  const [submitting, setSubmitting]                       = useState(false);
  const [selectedFile, setSelectedFile]                   = useState<File | null>(null);

  // Resolve email and name
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [resolvedName,  setResolvedName]  = useState('');

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const email = emailProp || localStorage.getItem('userEmail') || '';
    const name  = nameProp  || localStorage.getItem('userName')  || '';
    setResolvedEmail(email);
    setResolvedName(name);
  }, [emailProp, nameProp]);

  // Fetch loan data and payment data
  useEffect(() => {
    if (!resolvedEmail) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch loan data
        const loanUrl = `${API_BASE}/api/loans/current?email=${encodeURIComponent(resolvedEmail)}`;
        const loanRes = await fetch(loanUrl);
        
        console.log('Loan API response status:', loanRes.status);

        let loan = emptyLoan;
        if (loanRes.ok) {
          const data = await loanRes.json();
          console.log('Loan data received:', data);
          
          const borrowed = Number(data.borrowed) || 0;
          const weeksToPay = Number(data.weeks_to_pay) || 0;
          const interestRate = Number(data.interest_rate) || 0;
          
          const dailyInterestAmount = (borrowed * interestRate) / 100;
          const totalDays = weeksToPay * 7;
          const totalInterestAmount = dailyInterestAmount * totalDays;
          const totalToPay = borrowed + totalInterestAmount;
          const weeklyPayment = weeksToPay > 0 ? totalToPay / weeksToPay : 0;

          loan = {
            loan_id:         data.loan_id ?? 0,
            borrowed:        borrowed,
            weeks_to_pay:    weeksToPay,
            total_to_pay:    totalToPay,
            weekly_payment:  weeklyPayment,
            interest_rate:   interestRate,
            interest_amount: totalInterestAmount,
            total_interest:  totalInterestAmount,
            daily_interest:  dailyInterestAmount,
            status:          data.status,
          };
          setLoanData(loan);
        } else if (loanRes.status === 404) {
          console.log('No active loan found');
          setLoanData(emptyLoan);
        }

        // Fetch payment data
        const paymentUrl = `${API_BASE}/api/loan-payments/total-paid-by-email?email=${encodeURIComponent(resolvedEmail)}`;
        const paymentRes = await fetch(paymentUrl);
        
        console.log('Payment API response status:', paymentRes.status);
        
        if (paymentRes.ok) {
          const paymentResult = await paymentRes.json();
          console.log('Payment data received:', paymentResult);
          
          if (paymentResult.success && paymentResult.data) {
            const paidAmount = paymentResult.data.payment_summary?.total_amount_paid || 0;
            const totalToPay = loan.total_to_pay > 0 ? loan.total_to_pay : 0;
            const remaining = Math.max(0, totalToPay - paidAmount);
            const progress = totalToPay > 0 ? (paidAmount / totalToPay) * 100 : 0;
            
            console.log('Calculated values:', { paidAmount, totalToPay, remaining, progress });
            
            setPaymentData({
              total_amount_paid: paidAmount,
              total_payments: paymentResult.data.payment_summary?.total_payments || 0,
              remaining_balance: remaining,
              payment_progress: progress,
              last_payment_date: paymentResult.data.payment_summary?.last_payment_date || null
            });
          }
        } else {
          console.log('No payment data found');
          setPaymentData({
            total_amount_paid: 0,
            total_payments: 0,
            remaining_balance: loan.total_to_pay,
            payment_progress: 0,
            last_payment_date: null
          });
        }

      } catch (err) {
        console.error('[Dashboard] Fetch error:', err);
        setLoanData(emptyLoan);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedEmail]);

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod || !resolvedEmail) {
      alert('Please select a payment method');
      return;
    }

    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('email', resolvedEmail);
      formData.append('amount_paid', String(loanData.weekly_payment));
      formData.append('payment_date', new Date().toISOString().split('T')[0]);
      formData.append('payment_method', selectedPaymentMethod);
      
      if (selectedFile) {
        formData.append('screenshot', selectedFile);
      }

      const response = await fetch(`${API_BASE}/api/loan-payments/pay`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Payment submitted successfully! ${result.email_notification_sent ? 'Confirmation email sent.' : ''}`);
        setShowPaymentModal(false);
        setSelectedFile(null);
        // Refresh data
        window.location.reload();
      } else {
        alert(`Payment failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPercent = paymentData.payment_progress;
  const paidAmount = paymentData.total_amount_paid;
  const remainingAmount = paymentData.remaining_balance > 0 ? paymentData.remaining_balance : loanData.total_to_pay - paidAmount;
  const remainingWeeks = loanData.weekly_payment > 0
    ? Math.ceil(Math.max(0, remainingAmount) / loanData.weekly_payment)
    : 0;

  // Theme classes
  const themeClasses = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    subtle: darkMode ? 'text-gray-300' : 'text-gray-600',
    muted: darkMode ? 'text-gray-400' : 'text-gray-500',
    divider: darkMode ? 'border-gray-700' : 'border-gray-100',
    inset: darkMode ? 'bg-gray-700/60' : 'bg-gray-50',
    input: darkMode 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400',
    buttonDanger: darkMode 
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
      : 'border-gray-200 text-gray-600 hover:bg-gray-50',
    cardHover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
  };

  const statsCards = [
    {
      title: 'Money Borrowed',
      value: `K${loanData.borrowed.toLocaleString()}`,
      icon: DollarSign,
      iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Loan Duration',
      value: `${loanData.weeks_to_pay} weeks`,
      icon: Calendar,
      iconBg: darkMode ? 'bg-purple-500/20' : 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Weekly Payment',
      value: `K${loanData.weekly_payment.toFixed(0)}`,
      icon: TrendingUp,
      iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-50',
      iconColor: 'text-green-500',
    },
  ];

  const bankAccounts = [
    { bank: 'NATIONAL BANK', name: 'Robert Mwase', number: '1008203098' },
    { bank: 'FDH BANK', name: 'Robert Mwase', number: '140000628157' },
    { bank: 'First Capital Bank', name: 'Robert Mwase', number: '0004503119692' },
    { bank: 'STANDARD BANK', name: 'Robert Mwase', number: '9100008634197' },
  ];

  const mobileAccounts = [
    { bank: 'AIRTEL MONEY AGENT', name: 'Robert Mwase', number: '885584' },
    { bank: 'AIRTEL MONEY AGENT', name: 'Robert Mwase', number: '123324' },
    { bank: 'TNM MPAMBA AGENT', name: 'Robert Mwase', number: '140547' },
    { bank: 'TNM MPAMBA AGENT', name: 'Robert Mwase', number: '2001542' },
    { bank: 'AIRTEL MONEY DEALER', name: 'Robert Mwase', number: '0998843651' },
    { bank: 'AIRTEL MONEY DEALER', name: 'Robert Mwase', number: '0983170685' },
  ];

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.bg}`}>
        <div className="p-6 pb-0">
          <UserBanner darkMode={darkMode} userEmail={resolvedEmail} userName={resolvedName} />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`rounded-xl border shadow-sm p-6 ${themeClasses.card}`}>
                <div className={`h-4 w-24 rounded mb-3 animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-8 w-32 rounded animate-pulse ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>
            ))}
          </div>
          <p className={`text-center text-sm ${themeClasses.muted}`}>Loading your loan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses.bg}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className="p-6 pb-0">
        <UserBanner darkMode={darkMode} userEmail={resolvedEmail} userName={resolvedName} />
      </div>

      <div className="p-6 space-y-6">
        {/* No loan banner */}
        {loanData.loan_id === 0 && (
          <div className={`flex items-center gap-3 p-4 rounded-xl border-l-4 ${
            darkMode
              ? 'bg-blue-500/10 border-blue-400 text-blue-300'
              : 'bg-blue-50 border-blue-400 text-blue-700'
          }`}>
            <AlertCircle size={16} className="shrink-0" />
            <p className="text-sm">You have no active loan. Statistics will show once a loan is applied.</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {statsCards.map(({ title, value, icon: Icon, iconBg, iconColor }) => (
            <div
              key={title}
              className={`rounded-xl border shadow-sm p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${themeClasses.card}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeClasses.subtle}`}>{title}</p>
                  <p className={`text-2xl font-bold mt-1.5 ${themeClasses.text}`}>{value}</p>
                </div>
                <div className={`${iconBg} p-3 rounded-xl`}>
                  <Icon className={iconColor} size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interest Calculation Card */}
        {loanData.loan_id > 0 && (
          <div className={`rounded-xl border shadow-sm p-6 ${themeClasses.card}`}>
            <h2 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Loan Calculation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${themeClasses.inset}`}>
                <p className={`text-xs ${themeClasses.muted} mb-1`}>Principal Amount</p>
                <p className={`text-lg font-bold ${themeClasses.text}`}>K{loanData.borrowed.toLocaleString()}</p>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.inset}`}>
                <p className={`text-xs ${themeClasses.muted} mb-1`}>Daily Interest Rate</p>
                <p className="text-lg font-bold text-blue-500">{loanData.interest_rate}%</p>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.inset}`}>
                <p className={`text-xs ${themeClasses.muted} mb-1`}>Daily Interest Amount</p>
                <p className="text-lg font-bold text-purple-500">K{loanData.daily_interest?.toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.inset}`}>
                <p className={`text-xs ${themeClasses.muted} mb-1`}>Total Days</p>
                <p className="text-lg font-bold text-orange-500">{loanData.weeks_to_pay * 7} days</p>
              </div>
            </div>
            
            <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                Calculation Summary:
              </p>
              <div className={`space-y-1 text-sm ${darkMode ? 'text-green-200' : 'text-green-600'}`}>
                <p>• Daily Interest = (K{loanData.borrowed.toLocaleString()} × {loanData.interest_rate}%) ÷ 100 = K{loanData.daily_interest?.toFixed(2)} per day</p>
                <p>• Total Days = {loanData.weeks_to_pay} weeks × 7 days = {loanData.weeks_to_pay * 7} days</p>
                <p>• Total Interest = K{loanData.daily_interest?.toFixed(2)} × {loanData.weeks_to_pay * 7} days = K{loanData.total_interest?.toFixed(2)}</p>
                <p>• Gross Income = K{loanData.borrowed.toLocaleString()} + K{loanData.total_interest?.toFixed(2)} = K{loanData.total_to_pay.toFixed(2)}</p>
                <p>• Weekly Payment = K{loanData.total_to_pay.toFixed(2)} ÷ {loanData.weeks_to_pay} weeks = K{loanData.weekly_payment.toFixed(0)} per week</p>
              </div>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Payment Summary */}
          <div className={`lg:col-span-2 rounded-xl border shadow-sm p-6 ${themeClasses.card}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Payment Summary</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                loanData.loan_id > 0
                  ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  : darkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                {loanData.loan_id > 0 ? loanData.status || 'active' : 'no loan'}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
              <div className={`flex items-start gap-2.5 p-3 rounded-xl border-l-4 mb-3 ${
                darkMode
                  ? 'bg-yellow-500/10 border-yellow-400 text-yellow-300'
                  : 'bg-yellow-50 border-yellow-400 text-yellow-700'
              }`}>
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p className="text-xs leading-snug">
                  Any payment details not listed below is not legitimate. Send a screenshot after payment.
                </p>
              </div>

              {bankAccounts.map(p => (
                <PaymentAccount
                  key={p.number}
                  bank={p.bank}
                  accountName={p.name}
                  accountNumber={p.number}
                  type="bank"
                  darkMode={darkMode}
                  onSelect={setSelectedPaymentMethod}
                />
              ))}

              <div className="pt-3">
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${themeClasses.muted}`}>
                  <Phone size={12} /> Mobile Money
                </h3>
                <div className="space-y-2.5">
                  {mobileAccounts.map(p => (
                    <PaymentAccount
                      key={p.number}
                      bank={p.bank}
                      accountName={p.name}
                      accountNumber={p.number}
                      type="mobile"
                      darkMode={darkMode}
                      onSelect={setSelectedPaymentMethod}
                    />
                  ))}
                </div>
              </div>
            </div>

            {selectedPaymentMethod && (
              <div className={`mt-5 p-4 rounded-xl flex items-center justify-between gap-3 ${
                darkMode
                  ? 'bg-blue-500/15 border border-blue-500/30'
                  : 'bg-blue-50 border border-blue-100'
              }`}>
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 size={17} className="text-green-500 shrink-0" />
                  <span className={`text-sm font-medium truncate ${themeClasses.text}`}>
                    Selected: {selectedPaymentMethod}
                  </span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0"
                >
                  Make Payment
                </button>
              </div>
            )}
          </div>

          {/* Loan Progress - WITH TOTAL PAYMENT DISPLAYED */}
          <div className={`rounded-xl border shadow-sm p-6 ${themeClasses.card}`}>
            <h2 className={`text-lg font-semibold mb-5 ${themeClasses.text}`}>Loan Progress</h2>
            
            {/* Payment Stats Overview */}
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-medium ${themeClasses.muted}`}>Total Payments Made</span>
                <span className={`text-lg font-bold text-blue-500`}>
                  K{paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {paymentData.total_payments > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className={themeClasses.muted}>Number of payments</span>
                  <span className={`font-semibold ${themeClasses.text}`}>{paymentData.total_payments}</span>
                </div>
              )}
              {paymentData.last_payment_date && (
                <div className="flex justify-between items-center text-xs mt-1">
                  <span className={themeClasses.muted}>Last payment</span>
                  <span className={`font-semibold ${themeClasses.text}`}>
                    {new Date(paymentData.last_payment_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {[
                { label: 'Principal Borrowed', value: `K${loanData.borrowed.toLocaleString()}`, size: 'text-xl', color: themeClasses.text },
                { label: 'Total Interest', value: `K${loanData.total_interest?.toFixed(2) || '0'}`, size: 'text-xl', color: 'text-purple-500' },
                { label: 'Gross Income', value: `K${loanData.total_to_pay.toFixed(2)}`, size: 'text-2xl', color: 'text-green-500' },
                { label: 'Total Paid', value: `K${paidAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, size: 'text-xl', color: 'text-blue-500' },
                { label: 'Remaining Balance', value: `K${Math.max(0, remainingAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, size: 'text-xl', color: 'text-orange-500' },
              ].map(({ label, value, size, color }) => (
                <div key={label} className={`flex justify-between items-baseline pb-3 border-b last:border-0 ${themeClasses.divider}`}>
                  <span className={`text-sm ${themeClasses.subtle}`}>{label}</span>
                  <span className={`${size} font-bold ${color}`}>{value}</span>
                </div>
              ))}

              <div className="pt-1">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm ${themeClasses.subtle}`}>Progress</span>
                  <span className="text-sm font-semibold text-blue-500">{progressPercent.toFixed(1)}%</span>
                </div>
                <div className={`w-full rounded-full h-2.5 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, progressPercent)}%` }}
                  />
                </div>
                <p className={`text-xs ${themeClasses.muted} mt-2 text-center`}>
                  {progressPercent.toFixed(1)}% of your loan has been paid
                </p>
              </div>

              <div className={`p-4 rounded-xl ${themeClasses.inset}`}>
                <div className={`space-y-2.5`}>
                  {[
                    { label: 'Weekly Payment', value: `K${loanData.weekly_payment.toFixed(0)}`, color: 'text-green-500' },
                    { label: 'Daily Interest Rate', value: `${loanData.interest_rate}%`, color: 'text-blue-500' },
                    { label: 'Daily Interest', value: `K${loanData.daily_interest?.toFixed(2) || '0'}`, color: 'text-purple-500' },
                    { label: 'Remaining Weeks', value: `${remainingWeeks} weeks`, color: 'text-orange-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className={themeClasses.subtle}>{label}</span>
                      <span className={`font-semibold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Progress Message */}
              {paidAmount > 0 && paidAmount < loanData.total_to_pay && (
                <div className={`p-3 rounded-lg text-center text-sm ${darkMode ? 'bg-yellow-500/10 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}`}>
                  💪 Keep going! You've paid K{paidAmount.toLocaleString()} so far.
                  {remainingWeeks > 0 && ` Only ${remainingWeeks} weeks left!`}
                </div>
              )}

              {paidAmount >= loanData.total_to_pay && loanData.total_to_pay > 0 && (
                <div className={`p-3 rounded-lg text-center text-sm ${darkMode ? 'bg-green-500/10 text-green-300' : 'bg-green-50 text-green-700'}`}>
                  🎉 Congratulations! Your loan is fully paid!
                </div>
              )}

              {paidAmount === 0 && loanData.loan_id > 0 && (
                <div className={`p-3 rounded-lg text-center text-sm ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} ${themeClasses.muted}`}>
                  No payments recorded yet. Make your first payment today!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border ${themeClasses.card}`}>
            <h3 className={`text-lg font-semibold mb-5 ${themeClasses.text}`}>Complete Payment</h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${themeClasses.inset}`}>
                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${themeClasses.muted}`}>Payment Method</p>
                <p className={`font-semibold text-sm ${themeClasses.text}`}>{selectedPaymentMethod}</p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.subtle}`}>Weekly Payment Amount (K)</label>
                <input
                  type="number"
                  value={loanData.weekly_payment.toFixed(0)}
                  readOnly
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                />
                <p className={`text-xs ${themeClasses.muted} mt-1`}>This is your weekly payment amount</p>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.subtle}`}>Upload Payment Screenshot</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    id="screenshot-upload"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className={themeClasses.muted} size={22} />
                    <span className={`text-sm ${themeClasses.muted}`}>
                      {selectedFile ? selectedFile.name : 'Click to upload screenshot'}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedFile(null);
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${themeClasses.buttonDanger}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Submit Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>
    </div>
  );
};

// PaymentAccount Component
interface PaymentAccountProps {
  bank: string;
  accountName: string;
  accountNumber: string;
  type: 'bank' | 'mobile';
  darkMode: boolean;
  onSelect: (method: string) => void;
}

const PaymentAccount: React.FC<PaymentAccountProps> = ({
  bank, accountName, accountNumber, type, darkMode, onSelect,
}) => {
  const Icon = type === 'bank' ? Building2 : Phone;
  
  const bgHover = darkMode 
    ? 'hover:bg-gray-700 hover:border-gray-500' 
    : 'hover:bg-white hover:shadow-sm';
  
  const bgDefault = darkMode 
    ? 'bg-gray-700/50 border-gray-600' 
    : 'bg-gray-50 border-gray-200';
  
  const iconBg = type === 'bank'
    ? darkMode ? 'bg-blue-500/20' : 'bg-blue-50'
    : darkMode ? 'bg-green-500/20' : 'bg-green-50';
  
  const iconColor = type === 'bank' ? 'text-blue-500' : 'text-green-500';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const subtleColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const arrowColor = darkMode ? 'text-gray-500' : 'text-gray-400';

  return (
    <div
      onClick={() => onSelect(`${bank} — ${accountNumber}`)}
      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${bgDefault} ${bgHover}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg shrink-0 ${iconBg}`}>
          <Icon size={14} className={iconColor} />
        </div>
        <div>
          <p className={`text-sm font-medium ${textColor}`}>{bank}</p>
          <p className={`text-xs ${subtleColor}`}>
            {accountName} · {accountNumber}
          </p>
        </div>
      </div>
      <ArrowRight size={14} className={arrowColor} />
    </div>
  );
};

export default ApplicantDashboard;