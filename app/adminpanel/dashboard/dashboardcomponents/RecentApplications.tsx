'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText, Filter, Download, Eye, X, Loader2,
  Briefcase, User, Phone, ImageIcon, CheckCircle,
  XCircle, RefreshCw, Shield, TrendingUp, Clock,
  ChevronRight, AlertCircle, Package, Car, Home,
  Landmark, Box, DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  status: 'pending' | 'approved' | 'rejected';
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
  status: 'pending' | 'approved' | 'rejected';
  duration_weeks: number;
  interest_rate: number;
  total_repayment: number;
  employment_status: string;
  collateral_count: number;
  collateral_value: number;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://loan-backend-production-558e.up.railway.app/api';

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
      <div className="w-full h-40 bg-white flex items-center justify-center overflow-hidden">
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
      <div className="px-3 py-2 bg-white border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-700 capitalize truncate">{label}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:  'bg-amber-50 text-amber-700 border border-amber-200',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };
  const dots: Record<string, string> = {
    pending:  'bg-amber-500',
    approved: 'bg-emerald-500',
    rejected: 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-slate-400'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
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

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function RecentApplications() {
  const router = useRouter();
  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanStatuses, setLoanStatuses] = useState<Record<number, 'pending' | 'approved' | 'rejected'>>({});

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/profile/all-details`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();

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
      // Limit to 10 applications
      setRows(tableRows.slice(0, 10));

      const statusMap: Record<number, 'pending' | 'approved' | 'rejected'> = {};
      tableRows.forEach((r) => { statusMap[r.loan_id] = r.status; });
      setLoanStatuses(statusMap);

    } catch (err) {
      setError('Failed to load applications. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (userId: number) => {
    router.push(`/adminpanel/Recentapplication?userId=${userId}`);
  };

  const fmt = (v: number) => `K${(v ?? 0).toLocaleString()}`;
  const fmtPct = (r: number) => `${((r || 0) * 100).toFixed(0)}%`;

  // Loading / Error states
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
        <div className="p-3 bg-red-100 rounded-full"><AlertCircle size={24} className="text-red-500" /></div>
        <p className="text-slate-700 font-medium">{error}</p>
        <button onClick={fetchData} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <FileText size={16} className="text-blue-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Loan Applications</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={fetchData} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors" title="Refresh">
            <RefreshCw size={15} />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <Filter size={15} />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <Download size={15} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="text-center py-16">
            <FileText size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 text-sm">No applications found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-white border-y border-slate-200">
                {['Applicant', 'National ID', 'Email', 'Loan Amount', 'Status', ''].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const liveStatus = loanStatuses[row.loan_id] ?? row.status;
                return (
                  <tr key={row.loan_id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Applicant */}
                    <td className="px-5 py-3.5">
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

                    {/* National ID */}
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {row.national_id}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-slate-600">{row.email}</p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-900">{fmt(row.loan_amount)}</p>
                      <p className="text-[11px] text-slate-400">{row.duration_weeks} wks @ {fmtPct(row.interest_rate)}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusBadge status={liveStatus} />
                    </td>

                    {/* View More Button */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleViewMore(row.user_id)}
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-white font-semibold bg-blue-50 hover:bg-blue-600 px-3.5 py-1.5 rounded-xl transition-all duration-200"
                      >
                        <Eye size={14} />
                        View More
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-0.5 transition-opacity" />
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
  );
}