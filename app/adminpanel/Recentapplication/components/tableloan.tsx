'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Filter, Download, Eye, X, Loader2,
  Briefcase, User, Phone, ImageIcon, CheckCircle,
  XCircle, RefreshCw, Shield, TrendingUp, Clock,
  ChevronRight, AlertCircle, Package, Car, Home,
  Landmark, Box, DollarSign
} from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
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

interface Employment {
  employment_id: number;
  occupation: string;
  employer_name: string;
  monthly_income: number;
  employment_status: string;
  job_title: string;
  work_address: string;
  years_employed: number;
}

interface NextOfKin {
  kin_id: number;
  full_name: string;
  phone: string;
  relationship: string;
}

interface IdImage {
  id: number;
  image_type: string;
  image_path: string;
}

interface CollateralImage {
  image_id: number;
  image_path: string;
}

interface Collateral {
  collateral_id: number;
  collateral_type: string;
  description: string;
  estimated_value: number;
  images: CollateralImage[];
}

interface Loan {
  loan_id: number;
  loan_amount: number;
  interest_rate: number;
  total_repayment: number;
  duration_weeks: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
}

interface UserDetails {
  user: UserInfo;
  employment: Employment | null;
  next_of_kin: NextOfKin | null;
  id_images: IdImage[];
  collateral: Collateral[];
  loans: Loan[];
}

interface ApiResponse {
  message: string;
  total_users: number;
  data: UserDetails[];
}

interface TableRow {
  loan_id: number;
  user_id: number;
  applicant_name: string;
  national_id: string;
  email: string;
  loan_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  duration_weeks: number;
  interest_rate: number;
  total_repayment: number;
  employment_status: string;
  collateral_count: number;
  collateral_value: number;
}

// ─────────────────────────────────────────────
// ✅ FIX 1: Single source of truth for API base URL
// All fetch calls now use this — no more hardcoded localhost strings
// ─────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  return `${API_BASE_URL.replace('/api', '')}/uploads/${imagePath.replace(/^\/+/, '')}`;
};

// ─────────────────────────────────────────────
// Collateral helpers
// ─────────────────────────────────────────────
type CollateralStyle = {
  badge: string;
  dot: string;
  icon: React.ElementType;
  iconColor: string;
};

const getCollateralStyle = (type: string): CollateralStyle => {
  const t = (type ?? '').toLowerCase();
  if (t.includes('motor') || t.includes('vehicle') || t.includes('car') || t.includes('truck')) {
    return {
      badge: 'bg-blue-50 text-blue-700 border border-blue-200',
      dot: 'bg-blue-500',
      icon: Car,
      iconColor: 'text-blue-500',
    };
  }
  if (t.includes('real estate') || t.includes('house') || t.includes('property') || t.includes('home')) {
    return {
      badge: 'bg-amber-50 text-amber-700 border border-amber-200',
      dot: 'bg-amber-500',
      icon: Home,
      iconColor: 'text-amber-500',
    };
  }
  if (t.includes('land') || t.includes('plot') || t.includes('farm')) {
    return {
      badge: 'bg-green-50 text-green-700 border border-green-200',
      dot: 'bg-green-500',
      icon: Landmark,
      iconColor: 'text-green-500',
    };
  }
  return {
    badge: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400',
    icon: Box,
    iconColor: 'text-slate-400',
  };
};

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function InlineImage({ imagePath, label }: { imagePath: string; label: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm group">
      <div className="w-full h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
        {!errored ? (
          <img
            src={getImageUrl(imagePath)}
            alt={label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <ImageIcon size={28} />
            <span className="text-xs">Image unavailable</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-700 capitalize truncate">{label}</p>
      </div>
    </div>
  );
}

function CollateralImageThumb({ imagePath, label }: { imagePath: string; label: string }) {
  const [errored, setErrored] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group cursor-pointer">
      <div className="w-full h-28 flex items-center justify-center overflow-hidden">
        {!errored ? (
          <img
            src={getImageUrl(imagePath)}
            alt={label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setErrored(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-slate-400">
            <ImageIcon size={20} />
            <span className="text-[10px]">Unavailable</span>
          </div>
        )}
      </div>
      <div className="px-2.5 py-1.5 border-t border-slate-100">
        <p className="text-[10px] font-medium text-slate-500 truncate capitalize">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-700 border border-amber-200',
    approved:  'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected:  'bg-red-50 text-red-700 border border-red-200',
    active:    'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-slate-100 text-slate-700 border border-slate-200',
  };
  const dots: Record<string, string> = {
    pending:   'bg-amber-500',
    approved:  'bg-emerald-500',
    rejected:  'bg-red-500',
    active:    'bg-blue-500',
    completed: 'bg-slate-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-slate-400'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─────────────────────────────────────────────
// ✅ FIX 2: LoanActions now uses API_BASE_URL (no more hardcoded localhost)
// ─────────────────────────────────────────────
function LoanActions({
  loanId,
  currentStatus,
  onStatusChange,
}: {
  loanId: number;
  currentStatus: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  onStatusChange: (loanId: number, newStatus: 'approved' | 'rejected') => void;
}) {
  const [busy, setBusy] = useState<'approved' | 'rejected' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAction = async (action: 'approved' | 'rejected') => {
    setBusy(action);

    try {
      // ✅ FIXED: uses API_BASE_URL env variable — same as all other working API calls
      const url = `${API_BASE_URL}/loans/${loanId}/status`;

      console.log('📤 PATCH', url, '→', action);

      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }),
      });

      const data = await res.json();
      console.log('📥 Response:', data);

      if (res.ok) {
        const emailNote = data.email_notification_sent
          ? ' Email sent to applicant.'
          : '';
        showToast(`Loan ${action} successfully.${emailNote}`, 'success');
        onStatusChange(loanId, action);
      } else {
        showToast(
          `Failed to ${action} loan: ${data.message || 'Unknown error'}`,
          'error'
        );
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      showToast(
        'Network error — make sure the backend server is running.',
        'error'
      );
    } finally {
      setBusy(null);
    }
  };

  if (currentStatus === 'approved') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
        <CheckCircle size={15} className="text-emerald-600" />
        <span className="text-sm font-semibold text-emerald-700">Approved</span>
      </div>
    );
  }

  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl">
        <XCircle size={15} className="text-red-600" />
        <span className="text-sm font-semibold text-red-700">Rejected</span>
      </div>
    );
  }

  return (
    <>
      {/* Toast notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-xl text-sm font-medium max-w-sm
            ${toastType === 'success'
              ? 'bg-emerald-700 text-white border border-emerald-600'
              : 'bg-red-700 text-white border border-red-600'
            }`}
        >
          <div className="flex items-start gap-2">
            {toastType === 'success'
              ? <CheckCircle size={16} className="mt-0.5 shrink-0" />
              : <AlertCircle size={16} className="mt-0.5 shrink-0" />
            }
            {toastMessage}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* Approve */}
        <button
          onClick={() => handleAction('approved')}
          disabled={!!busy}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            text-white text-sm font-semibold rounded-xl transition-all duration-200
            cursor-pointer shadow-sm hover:shadow-md"
        >
          {busy === 'approved'
            ? <Loader2 size={14} className="animate-spin" />
            : <CheckCircle size={14} />
          }
          Approve
        </button>

        {/* Reject */}
        <button
          onClick={() => handleAction('rejected')}
          disabled={!!busy}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            text-white text-sm font-semibold rounded-xl transition-all duration-200
            cursor-pointer shadow-sm hover:shadow-md"
        >
          {busy === 'rejected'
            ? <Loader2 size={14} className="animate-spin" />
            : <XCircle size={14} />
          }
          Reject
        </button>
      </div>
    </>
  );
}

function InfoField({ label, value, accent }: { label: string; value: React.ReactNode; accent?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`text-sm font-medium ${accent ?? 'text-slate-800'}`}>{value ?? '—'}</p>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="p-1.5 bg-blue-100 rounded-lg">
          <Icon size={13} className="text-blue-600" />
        </div>
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Collateral Section Component
// ─────────────────────────────────────────────
function CollateralSection({ collateral }: { collateral: Collateral[] }) {
  const totalValue = collateral.reduce((s, c) => s + (c.estimated_value || 0), 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Shield size={13} className="text-blue-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            Collateral ({collateral.length} item{collateral.length !== 1 ? 's' : ''})
          </h4>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
          <DollarSign size={11} className="text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700">
            K{totalValue.toLocaleString()} total
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {collateral.map((coll, index) => {
          const style = getCollateralStyle(coll.collateral_type);
          const CollIcon = style.icon;

          return (
            <div key={coll.collateral_id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-slate-500">{index + 1}</span>
                  </div>
                  <div className="p-1.5 bg-slate-100 rounded-lg">
                    <CollIcon size={13} className={style.iconColor} />
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${style.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    {coll.collateral_type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Est. Value</p>
                  <p className="text-sm font-bold text-emerald-600">K{(coll.estimated_value || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="px-4 py-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{coll.description || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Collateral ID</p>
                    <span className="inline-block text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg">
                      #{coll.collateral_id}
                    </span>
                  </div>
                </div>

                {coll.images?.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <ImageIcon size={11} className="text-slate-400" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Supporting Photos ({coll.images.length})
                      </p>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {coll.images.map((img, imgIndex) => (
                        <CollateralImageThumb
                          key={img.image_id}
                          imagePath={img.image_path}
                          label={`Photo ${imgIndex + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-2 px-3 bg-slate-100 rounded-lg border border-dashed border-slate-300">
                    <ImageIcon size={13} className="text-slate-400" />
                    <p className="text-xs text-slate-400 italic">No supporting photos attached</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center gap-2">
            <DollarSign size={14} className="text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Total Collateral Value</span>
          </div>
          <span className="text-base font-bold text-emerald-700">K{totalValue.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function RecentApplications() {
  const [rows, setRows] = useState<TableRow[]>([]);
  const [allDetails, setAllDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<UserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [loanStatuses, setLoanStatuses] = useState<Record<number, 'pending' | 'approved' | 'rejected' | 'active' | 'completed'>>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/profile/all-details`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();

      setAllDetails(data.data ?? []);

      const tableRows: TableRow[] = [];
      (data.data ?? []).forEach((ud) => {
        if (!ud?.user || !Array.isArray(ud.loans)) return;

        const totalCollateralValue = (ud.collateral ?? []).reduce(
          (s, c) => s + (c.estimated_value || 0), 0
        );

        ud.loans.forEach((loan) => {
          tableRows.push({
            loan_id:           loan.loan_id,
            user_id:           ud.user.user_id,
            applicant_name:    ud.user.username || 'Unknown',
            national_id:       ud.user.national_id || '—',
            email:             ud.user.email || '—',
            loan_amount:       loan.loan_amount || 0,
            status:            loan.status || 'pending',
            duration_weeks:    loan.duration_weeks || 0,
            interest_rate:     loan.interest_rate || 0,
            total_repayment:   loan.total_repayment || 0,
            employment_status: ud.employment?.employment_status || 'N/A',
            collateral_count:  (ud.collateral ?? []).length,
            collateral_value:  totalCollateralValue,
          });
        });
      });

      tableRows.sort((a, b) => b.loan_id - a.loan_id);
      setRows(tableRows.slice(0, 15));

      const statusMap: Record<number, 'pending' | 'approved' | 'rejected' | 'active' | 'completed'> = {};
      tableRows.forEach((r) => { statusMap[r.loan_id] = r.status; });
      setLoanStatuses(statusMap);

    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (userId: number) => {
    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedDetail(null);
    const detail = allDetails.find((d) => d.user.user_id === userId) ?? null;
    setSelectedDetail(detail);
    setModalLoading(false);
  };

  const handleLoanStatusChange = (loanId: number, newStatus: 'approved' | 'rejected') => {
    setLoanStatuses((prev) => ({ ...prev, [loanId]: newStatus }));
    setRows((prev) =>
      prev.map((r) => r.loan_id === loanId ? { ...r, status: newStatus } : r)
    );
    setSelectedDetail((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        loans: prev.loans.map((l) =>
          l.loan_id === loanId ? { ...l, status: newStatus } : l
        ),
      };
    });
  };

  const fmt    = (v: number) => `K${(v ?? 0).toLocaleString()}`;
  const fmtPct = (r: number) => `${((r || 0) * 100).toFixed(0)}%`;

  const pendingCount = rows.filter(
    (r) => (loanStatuses[r.loan_id] ?? r.status) === 'pending'
  ).length;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm text-slate-500">Loading applications…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center gap-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle size={24} className="text-red-500" />
        </div>
        <p className="text-slate-700 font-medium">{error}</p>
        <button
          onClick={fetchData}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Loan Applications</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recent submissions requiring review</p>
            </div>
            {pendingCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-full border border-amber-200">
                {pendingCount} pending
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RefreshCw size={15} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
              <Filter size={15} />
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
              <Download size={15} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          {rows.length === 0 ? (
            <div className="text-center py-16 bg-white">
              <FileText size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No applications found</p>
            </div>
          ) : (
            <table className="w-full bg-white">
              <thead className="bg-slate-50">
                <tr className="border-y border-slate-200">
                  {['Applicant', 'National ID', 'Email', 'Loan Amount', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row) => {
                  const liveStatus = loanStatuses[row.loan_id] ?? row.status;
                  return (
                    <tr key={row.loan_id} className="hover:bg-slate-50 transition-colors bg-white">
                      <td className="px-5 py-3.5 bg-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {row.applicant_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{row.applicant_name}</p>
                            <p className="text-[11px] text-slate-400">Loan #{row.loan_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 bg-white">
                        <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {row.national_id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 bg-white">
                        <p className="text-sm text-slate-600">{row.email}</p>
                      </td>
                      <td className="px-5 py-3.5 bg-white">
                        <p className="text-sm font-bold text-slate-900">{fmt(row.loan_amount)}</p>
                        <p className="text-[11px] text-slate-400">{row.duration_weeks} wks @ {fmtPct(row.interest_rate)}</p>
                      </td>
                      <td className="px-5 py-3.5 bg-white">
                        <StatusBadge status={liveStatus} />
                      </td>
                      <td className="px-5 py-3.5 bg-white">
                        <button
                          onClick={() => handleView(row.user_id)}
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-white font-semibold
                            bg-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600
                            px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <Eye size={14} />
                          View More
                          <ChevronRight size={12} className="-ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col border border-slate-200">

            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between rounded-t-2xl shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <User size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Application Details</h3>
                  {selectedDetail && (
                    <p className="text-xs text-slate-500">
                      {selectedDetail.user.username} · {selectedDetail.user.email}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setIsModalOpen(false); setSelectedDetail(null); }}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-5 bg-slate-50">
              {modalLoading ? (
                <div className="flex justify-center py-20 bg-white rounded-xl">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : selectedDetail ? (
                <>
                  {/* ── Personal Info ── */}
                  <SectionCard icon={User} title="Personal Information">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      <InfoField label="Full Name"     value={selectedDetail.user.username} />
                      <InfoField label="Email"         value={selectedDetail.user.email} />
                      <InfoField label="National ID"   value={
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {selectedDetail.user.national_id || '—'}
                        </span>
                      } />
                      <InfoField label="Phone"         value={selectedDetail.user.phone || '—'} />
                      <InfoField label="Date of Birth" value={selectedDetail.user.date_of_birth || '—'} />
                      <InfoField label="City"          value={selectedDetail.user.city || '—'} />
                      <InfoField label="Street"        value={selectedDetail.user.street || '—'} />
                      <InfoField label="Alt. Phone"    value={selectedDetail.user.alternative_phone || '—'} />
                    </div>
                  </SectionCard>

                  {/* ── Employment ── */}
                  {selectedDetail.employment && (
                    <SectionCard icon={Briefcase} title="Employment Details">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <InfoField label="Occupation"     value={selectedDetail.employment.occupation} />
                        <InfoField label="Employer"       value={selectedDetail.employment.employer_name} />
                        <InfoField label="Job Title"      value={selectedDetail.employment.job_title} />
                        <InfoField label="Status"         value={selectedDetail.employment.employment_status} />
                        <InfoField label="Monthly Income" value={fmt(selectedDetail.employment.monthly_income)} accent="text-emerald-600" />
                        <InfoField label="Years Employed" value={`${selectedDetail.employment.years_employed} yrs`} />
                        <div className="col-span-2 md:col-span-3">
                          <InfoField label="Work Address" value={selectedDetail.employment.work_address} />
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* ── Next of Kin ── */}
                  {selectedDetail.next_of_kin && (
                    <SectionCard icon={Phone} title="Next of Kin">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        <InfoField label="Full Name"    value={selectedDetail.next_of_kin.full_name} />
                        <InfoField label="Relationship" value={selectedDetail.next_of_kin.relationship} />
                        <InfoField label="Phone"        value={selectedDetail.next_of_kin.phone} />
                      </div>
                    </SectionCard>
                  )}

                  {/* ── ID Documents ── */}
                  {selectedDetail.id_images?.length > 0 && (
                    <SectionCard icon={ImageIcon} title="ID Documents">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedDetail.id_images.map((img) => (
                          <InlineImage key={img.id} imagePath={img.image_path} label={img.image_type} />
                        ))}
                      </div>
                    </SectionCard>
                  )}

                  {/* ── Collateral ── */}
                  {selectedDetail.collateral?.length > 0 ? (
                    <CollateralSection collateral={selectedDetail.collateral} />
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <Shield size={13} className="text-blue-600" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Collateral</h4>
                      </div>
                      <div className="px-5 py-8 flex flex-col items-center gap-2 text-slate-400">
                        <Package size={28} className="text-slate-300" />
                        <p className="text-sm">No collateral items registered</p>
                      </div>
                    </div>
                  )}

                  {/* ── Loans ── */}
                  {selectedDetail.loans?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                          <TrendingUp size={13} className="text-blue-600" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                          Loan Applications ({selectedDetail.loans.length})
                        </h4>
                      </div>

                      {selectedDetail.loans.map((loan) => {
                        const liveStatus = loanStatuses[loan.loan_id] ?? loan.status;
                        return (
                          <div key={loan.loan_id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-slate-800">Loan #{loan.loan_id}</span>
                                <StatusBadge status={liveStatus} />
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Clock size={12} />
                                {loan.duration_weeks} weeks
                              </div>
                            </div>

                            <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-5">
                              <InfoField label="Loan Amount"     value={fmt(loan.loan_amount)} accent="text-blue-600" />
                              <InfoField label="Total Repayment" value={fmt(loan.total_repayment)} />
                              <InfoField label="Interest Rate"   value={fmtPct(loan.interest_rate)} />
                              <InfoField label="Duration"        value={`${loan.duration_weeks} weeks`} />
                            </div>

                            <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                              <p className="text-xs text-slate-400 max-w-sm">
                                {liveStatus === 'pending'
                                  ? 'Review and take action. The applicant will receive an email notification.'
                                  : `This loan has been ${liveStatus}.${
                                      liveStatus === 'approved' || liveStatus === 'rejected'
                                        ? ' The applicant has been notified via email.'
                                        : ''
                                    }`
                                }
                              </p>
                              <LoanActions
                                loanId={loan.loan_id}
                                currentStatus={liveStatus}
                                onStatusChange={handleLoanStatusChange}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 bg-white rounded-xl">
                  <AlertCircle size={32} className="text-slate-300" />
                  <p className="text-slate-400 text-sm">No details available for this applicant.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-white rounded-b-2xl flex justify-end shrink-0">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedDetail(null); }}
                className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}