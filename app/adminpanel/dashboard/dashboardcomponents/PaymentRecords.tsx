// components/admin/PaymentRecords.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet, Plus, X, ChevronDown, Loader2,
  CheckCircle2, AlertCircle, RefreshCw, Filter, Mail
} from 'lucide-react';

interface LoanUser {
  user_id: number;
  username: string;
  email: string;
  loan_id: number;
  loan_amount: number;
  total_repayment: number;
  status: string;
}

interface PaymentRecord {
  payment_id: number;
  loan_id: number;
  username: string;
  email: string;
  amount_paid: number | string;
  payment_date: string;
  payment_method: string | null;
  total_amount_paid: number | string;
  total_payments: number;
  total_repayment?: number;
  remaining_balance?: number;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  email_notification_sent: boolean;
  loan_completed: boolean;
  data: {
    payment_id: number;
    loan_id: number;
    user_id: number;
    email: string;
    amount_paid: number;
    payment_date: string;
    payment_method: string | null;
    total_paid_so_far: number;
    remaining_balance: number;
    loan_status: string;
  };
}

const PAYMENT_METHODS = [
  'Airtel Money',
  'TNM Mpamba',
  'National Bank',
  'Standard Bank',
  'FDH Bank',
  'NBS Bank',
  'Ecobank',
  'Cash',
];

const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://loan-backend-production-558e.up.railway.app';

// ─── Dropdown Component ───────────────────────────────────────────────────────

interface DropdownProps {
  placeholder: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  placeholder, options, value, onChange, disabled = false
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-blue-400 cursor-pointer'}
          ${open ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-400 text-center">No options available</div>
          ) : (
            options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors
                  ${value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─── Add Payment Modal ───────────────────────────────────────────────────────

interface AddPaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({ onClose, onSuccess }) => {
  const [users, setUsers] = useState<LoanUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState('');

  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<LoanUser | null>(null);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean;
    message: string;
  } | null>(null);

  // Fetch users with incomplete loans
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        setUsersError('');
        const res = await fetch(`${API}/api/loans/incomplete-users`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const list: LoanUser[] = json.data ?? json ?? [];
        setUsers(list);
      } catch (err: any) {
        setUsersError('Failed to load users. Check your connection.');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Update selected user when email changes
  useEffect(() => {
    const user = users.find(u => u.email === selectedEmail);
    setSelectedUser(user || null);
  }, [selectedEmail, users]);

  // Build dropdown options
  const userOptions = users.map(u => ({
    value: u.email,
    label: `${u.username} - ${u.email}`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailStatus(null);

    if (!selectedEmail) return setError('Please select a user.');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return setError('Please enter a valid amount.');
    if (!method) return setError('Please select a payment method.');
    if (!paymentDate) return setError('Please select a payment date.');

    try {
      setSubmitting(true);
      const res = await fetch(`${API}/api/loan-payments/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedEmail,
          amount_paid: Number(amount),
          payment_date: paymentDate,
          payment_method: method,
        }),
      });

      const json: PaymentResponse = await res.json();
      if (!res.ok) throw new Error(json.message ?? 'Payment failed');

      if (json.email_notification_sent) {
        setEmailStatus({
          sent: true,
          message: json.loan_completed 
            ? 'Payment recorded and completion email sent!'
            : 'Payment recorded and confirmation email sent!'
        });
      } else {
        setEmailStatus({
          sent: false,
          message: 'Payment recorded but email notification failed.'
        });
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Wallet size={16} className="text-white" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Record Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Success state */}
          {success && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-700 font-medium">Payment recorded successfully!</p>
                {emailStatus && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <Mail size={12} />
                    {emailStatus.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Email notification status */}
          {emailStatus && !success && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${emailStatus.sent ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              {emailStatus.sent ? (
                <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              ) : (
                <AlertCircle size={18} className="text-yellow-600 shrink-0" />
              )}
              <p className={`text-sm ${emailStatus.sent ? 'text-green-700' : 'text-yellow-700'}`}>
                {emailStatus.message}
              </p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* User / Client */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Client <span className="text-red-500">*</span>
            </label>
            {loadingUsers ? (
              <div className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                <Loader2 size={14} className="animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">Loading clients…</span>
              </div>
            ) : usersError ? (
              <div className="flex items-center gap-2 px-3 py-2.5 border border-red-200 rounded-lg bg-red-50">
                <AlertCircle size={14} className="text-red-400" />
                <span className="text-sm text-red-500">{usersError}</span>
              </div>
            ) : (
              <Dropdown
                placeholder="Select client"
                options={userOptions}
                value={selectedEmail}
                onChange={setSelectedEmail}
              />
            )}
            {users.length === 0 && !loadingUsers && !usersError && (
              <p className="text-xs text-gray-400">No clients with active loans found.</p>
            )}
          </div>

          {/* Loan Info */}
          {selectedUser && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-gray-500">Loan Information</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Loan Amount:</span>
                <span className="text-sm font-semibold text-gray-900">
                  K{selectedUser.loan_amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Repayment:</span>
                <span className="text-sm font-semibold text-blue-600">
                  K{selectedUser.total_repayment.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Status:</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  selectedUser.status === 'active' ? 'bg-green-100 text-green-700' :
                  selectedUser.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {selectedUser.status.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Amount Paid (MWK) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">K</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <Dropdown
              placeholder="Select method"
              options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
              value={method}
              onChange={setMethod}
            />
          </div>

          {/* Payment Date */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? (
                <><Loader2 size={14} className="animate-spin" /> Processing…</>
              ) : success ? (
                <><CheckCircle2 size={14} /> Recorded!</>
              ) : (
                'Record Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main PaymentRecords Component ───────────────────────────────────────────

const PaymentRecords: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [filterMethod, setFilterMethod] = useState('');

  // Fetch payment records from API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/api/loan-payments/paid-users`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      
      // Map and calculate remaining balance for each payment record
      const paymentsWithBalance = (json.data ?? json ?? []).map((payment: any) => ({
        ...payment,
        remaining_balance: (payment.total_repayment || 0) - (payment.total_amount_paid || 0)
      }));
      
      setPayments(paymentsWithBalance);
    } catch (err: any) {
      setError('Failed to load payment records.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments by method
  const filteredPayments = filterMethod
    ? payments.filter(p => p.payment_method === filterMethod)
    : payments;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-MW', { minimumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Wallet size={18} className="text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">Manual Payment Records</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="">All Methods</option>
              {PAYMENT_METHODS.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            <Filter size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Refresh records"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Add Payment Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span>Add Payment</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="ml-3 text-sm text-gray-500">Loading payment records...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle size={32} className="text-red-400 mb-2" />
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={fetchPayments}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Wallet size={32} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">No payment records found</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Payment" to record one</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => {
                const totalRepayment = Number(payment.total_repayment || 0);
                const totalAmountPaid = Number(payment.total_amount_paid || 0);
                const remainingBalance = totalRepayment - totalAmountPaid;
                
                return (
                  <tr key={payment.payment_id || `${payment.loan_id}-${payment.email}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{payment.username || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">#{payment.loan_id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                        {payment.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 whitespace-nowrap">
                      K{formatCurrency(totalAmountPaid)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        {payment.total_payments || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {remainingBalance <= 0 ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          Fully Paid
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                          K{formatCurrency(remainingBalance)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer with record count */}
      {!loading && !error && filteredPayments.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            Showing {filteredPayments.length} of {payments.length} record{payments.length !== 1 ? 's' : ''}
            {filterMethod && ` (filtered by ${filterMethod})`}
          </p>
        </div>
      )}

      {/* Add Payment Modal */}
      {showModal && (
        <AddPaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchPayments}
        />
      )}
    </div>
  );
};

// Export both as default and named export to maintain compatibility
export default PaymentRecords;
export { PaymentRecords };