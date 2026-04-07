'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  UserCircle, Mail, Phone, MapPin, Briefcase, Heart,
  ShieldCheck, AlertCircle, Calendar, CreditCard,
  Building2, DollarSign, Home, Users, Pencil, X,
  Check, Loader2, CheckCircle2, Sun, Moon
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData { username: string; email: string; role: string; }

interface UserProfile {
  user_id: number; username: string; email: string; role: string;
  profile_id: number; date_of_birth: string; national_id: string;
  phone: string; alternative_phone: string | null;
  city: string | null; street: string | null; house_number: string | null;
}

interface EmploymentDetails {
  employment_id: number; occupation: string;
  employer_name: string | null; monthly_income: number;
}

interface NextOfKin {
  kin_id: number; full_name: string; phone: string; relationship: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = 'https://loan-backend-production-558e.up.railway.app/api';

// ─── UI Primitives ────────────────────────────────────────────────────────────

const Card = ({
  icon: Icon, title, iconColor = 'text-blue-500',
  editing, onEdit, onCancel, onSave, saving, children, darkMode
}: {
  icon: React.ElementType; title: string; iconColor?: string;
  editing: boolean; onEdit: () => void; onCancel: () => void;
  onSave: () => void; saving: boolean; children: React.ReactNode; darkMode: boolean;
}) => (
  <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  }`}>
    <div className={`flex items-center justify-between px-6 py-4 border-b ${
      darkMode ? 'border-gray-700' : 'border-gray-100'
    }`}>
      <div className="flex items-center gap-2.5">
        <Icon size={17} className={iconColor} />
        <h3 className={`text-sm font-semibold uppercase tracking-wider ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {editing ? (
          <>
            <button
              onClick={onCancel}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:bg-gray-700 border-gray-600' 
                  : 'text-gray-500 hover:bg-gray-50 border-gray-200'
              } border`}
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              darkMode 
                ? 'text-blue-400 hover:bg-gray-700 border-blue-800' 
                : 'text-blue-600 hover:bg-blue-50 border-blue-100'
            } border`}
          >
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({
  label, value, onChange, type = 'text', placeholder, editing, icon: Icon, darkMode
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; editing: boolean;
  icon?: React.ElementType; darkMode: boolean;
}) => (
  <div className="space-y-1.5">
    <label className={`flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider ${
      darkMode ? 'text-gray-500' : 'text-gray-400'
    }`}>
      {Icon && <Icon size={12} />}
      {label}
    </label>
    {editing ? (
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
        className={`w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300 ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' 
            : 'bg-white border-gray-200 text-gray-800 placeholder-gray-300'
        } border`}
      />
    ) : (
      <p className={`text-sm font-medium px-0.5 min-h-[1.25rem] ${
        darkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {value || <span className={darkMode ? 'text-gray-600' : 'text-gray-300'}>Not set</span>}
      </p>
    )}
  </div>
);

const Divider = ({ darkMode }: { darkMode: boolean }) => (
  <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-50'}`} />
);

const Toast = ({ message, type, darkMode }: { message: string; type: 'success' | 'error'; darkMode: boolean }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-colors duration-300
    ${type === 'success' 
      ? darkMode 
        ? 'bg-gray-800 border border-green-800 text-green-400' 
        : 'bg-white border border-green-100 text-green-700'
      : darkMode 
        ? 'bg-gray-800 border border-red-800 text-red-400' 
        : 'bg-white border border-red-100 text-red-600'
    }`}>
    {type === 'success'
      ? <CheckCircle2 size={16} className="text-green-500 shrink-0" />
      : <AlertCircle size={16} className="text-red-400 shrink-0" />}
    {message}
  </div>
);

const CardSkeleton = ({ darkMode }: { darkMode: boolean }) => (
  <div className="animate-pulse space-y-5">
    {[1, 2, 3].map(i => (
      <div key={i} className="space-y-1.5">
        <div className={`h-2.5 rounded w-1/4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
        <div className={`h-4 rounded w-1/2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
      </div>
    ))}
  </div>
);

const EmptyState = ({ message, darkMode }: { message: string; darkMode: boolean }) => (
  <div className="flex flex-col items-center justify-center py-6 text-center">
    <AlertCircle size={20} className={`mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-200'}`} />
    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{message}</p>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const [userData, setUserData]       = useState<UserData | null>(null);
  const [profile, setProfile]         = useState<UserProfile | null>(null);
  const [employment, setEmployment]   = useState<EmploymentDetails | null>(null);
  const [nextOfKin, setNextOfKin]     = useState<NextOfKin | null>(null);

  const [loadingProfile, setLoadingProfile]         = useState(true);
  const [loadingEmployment, setLoadingEmployment]   = useState(true);
  const [loadingKin, setLoadingKin]                 = useState(true);

  const [errorProfile, setErrorProfile]       = useState<string | null>(null);
  const [errorEmployment, setErrorEmployment] = useState<string | null>(null);
  const [errorKin, setErrorKin]               = useState<string | null>(null);

  // Edit mode
  const [editingProfile, setEditingProfile]       = useState(false);
  const [editingAddress, setEditingAddress]       = useState(false);
  const [editingEmployment, setEditingEmployment] = useState(false);
  const [editingKin, setEditingKin]               = useState(false);

  // Saving flags
  const [savingProfile, setSavingProfile]       = useState(false);
  const [savingAddress, setSavingAddress]       = useState(false);
  const [savingEmployment, setSavingEmployment] = useState(false);
  const [savingKin, setSavingKin]               = useState(false);

  // Draft state
  const [profileDraft, setProfileDraft] = useState({
    date_of_birth: '', national_id: '', phone: '', alternative_phone: ''
  });
  const [addressDraft, setAddressDraft] = useState({
    city: '', street: '', house_number: ''
  });
  const [employmentDraft, setEmploymentDraft] = useState({
    occupation: '', employer_name: '', monthly_income: ''
  });
  const [kinDraft, setKinDraft] = useState({
    full_name: '', phone: '', relationship: ''
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUserData(JSON.parse(stored)); } catch { setUserData(null); }
    }
  }, []);

  // Fetch all data once email is available
  useEffect(() => {
    if (!userData?.email) return;
    const email = encodeURIComponent(userData.email);

    fetch(`${API_BASE}/profile/get?email=${email}`)
      .then(r => r.json())
      .then(data => {
        if (data.profile) {
          setProfile(data.profile);
          setProfileDraft({
            date_of_birth: data.profile.date_of_birth?.split('T')[0] ?? '',
            national_id:   data.profile.national_id ?? '',
            phone:         data.profile.phone ?? '',
            alternative_phone: data.profile.alternative_phone ?? ''
          });
          setAddressDraft({
            city:         data.profile.city ?? '',
            street:       data.profile.street ?? '',
            house_number: data.profile.house_number ?? ''
          });
        } else setErrorProfile(data.message || 'Profile not found');
      })
      .catch(() => setErrorProfile('Failed to load profile'))
      .finally(() => setLoadingProfile(false));

    fetch(`${API_BASE}/employment/get?email=${email}`)
      .then(r => r.json())
      .then(data => {
        if (data.employment) {
          setEmployment(data.employment);
          setEmploymentDraft({
            occupation:     data.employment.occupation ?? '',
            employer_name:  data.employment.employer_name ?? '',
            monthly_income: String(data.employment.monthly_income ?? '')
          });
        } else setErrorEmployment(data.message || 'No employment data');
      })
      .catch(() => setErrorEmployment('Failed to load employment details'))
      .finally(() => setLoadingEmployment(false));

    fetch(`${API_BASE}/next-of-kin/get?email=${email}`)
      .then(r => r.json())
      .then(data => {
        if (data.next_of_kin) {
          setNextOfKin(data.next_of_kin);
          setKinDraft({
            full_name:    data.next_of_kin.full_name ?? '',
            phone:        data.next_of_kin.phone ?? '',
            relationship: data.next_of_kin.relationship ?? ''
          });
        } else setErrorKin(data.message || 'No next of kin data');
      })
      .catch(() => setErrorKin('Failed to load next of kin'))
      .finally(() => setLoadingKin(false));

  }, [userData]);

  // Save handlers
  const saveProfile = async () => {
    if (!userData?.email) return;
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE}/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, ...profileDraft })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, ...profileDraft } : prev);
        setEditingProfile(false);
        showToast('Personal info updated successfully', 'success');
      } else showToast(data.message || 'Update failed', 'error');
    } catch { showToast('Network error', 'error'); }
    setSavingProfile(false);
  };

  const saveAddress = async () => {
    if (!userData?.email) return;
    setSavingAddress(true);
    try {
      const res = await fetch(`${API_BASE}/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, ...addressDraft })
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, ...addressDraft } : prev);
        setEditingAddress(false);
        showToast('Address updated successfully', 'success');
      } else showToast(data.message || 'Update failed', 'error');
    } catch { showToast('Network error', 'error'); }
    setSavingAddress(false);
  };

  const saveEmployment = async () => {
    if (!userData?.email) return;
    setSavingEmployment(true);
    try {
      const res = await fetch(`${API_BASE}/employment/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          ...employmentDraft,
          monthly_income: Number(employmentDraft.monthly_income)
        })
      });
      const data = await res.json();
      if (res.ok) {
        setEmployment(prev => prev ? {
          ...prev, ...employmentDraft,
          monthly_income: Number(employmentDraft.monthly_income)
        } : prev);
        setEditingEmployment(false);
        showToast('Employment details updated successfully', 'success');
      } else showToast(data.message || 'Update failed', 'error');
    } catch { showToast('Network error', 'error'); }
    setSavingEmployment(false);
  };

  const saveKin = async () => {
    if (!userData?.email) return;
    setSavingKin(true);
    try {
      const res = await fetch(`${API_BASE}/next-of-kin/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email, ...kinDraft })
      });
      const data = await res.json();
      if (res.ok) {
        setNextOfKin(prev => prev ? { ...prev, ...kinDraft } : prev);
        setEditingKin(false);
        showToast('Next of kin updated successfully', 'success');
      } else showToast(data.message || 'Update failed', 'error');
    } catch { showToast('Network error', 'error'); }
    setSavingKin(false);
  };

  // Cancel handlers
  const cancelProfile = () => {
    if (profile) setProfileDraft({
      date_of_birth:     profile.date_of_birth?.split('T')[0] ?? '',
      national_id:       profile.national_id ?? '',
      phone:             profile.phone ?? '',
      alternative_phone: profile.alternative_phone ?? ''
    });
    setEditingProfile(false);
  };

  const cancelAddress = () => {
    if (profile) setAddressDraft({
      city: profile.city ?? '', street: profile.street ?? '', house_number: profile.house_number ?? ''
    });
    setEditingAddress(false);
  };

  const cancelEmployment = () => {
    if (employment) setEmploymentDraft({
      occupation:    employment.occupation ?? '',
      employer_name: employment.employer_name ?? '',
      monthly_income: String(employment.monthly_income ?? '')
    });
    setEditingEmployment(false);
  };

  const cancelKin = () => {
    if (nextOfKin) setKinDraft({
      full_name: nextOfKin.full_name ?? '', phone: nextOfKin.phone ?? '', relationship: nextOfKin.relationship ?? ''
    });
    setEditingKin(false);
  };

  const formatCurrency = (v: number) =>
    v ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v) : '';

  if (!userData) return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } flex items-center justify-center`}>
      <div className="text-center">
        <UserCircle size={40} className={`mx-auto mb-3 ${darkMode ? 'text-gray-700' : 'text-gray-200'}`} />
        <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Please log in to view your profile.
        </p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Header - Removed role display and profile ID */}
      <div className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      }`}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shrink-0">
              <span className="text-white font-bold text-2xl">
                {userData.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{userData.username}</h1>
                {/* Removed role badge for security */}
              </div>
              <p className={`text-sm mt-1 flex items-center gap-1.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                <Mail size={13} /> {userData.email}
              </p>
              {profile && (
                <p className={`text-xs mt-1 flex items-center gap-1.5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-300'
                }`}>
                  <MapPin size={12} />
                  {[profile.city, profile.street, profile.house_number].filter(Boolean).join(', ') || 'Address not set'}
                </p>
              )}
            </div>
            {/* Removed profile ID display for security */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Personal Information */}
          <Card
            icon={UserCircle} title="Personal Information" iconColor="text-blue-500"
            editing={editingProfile} onEdit={() => setEditingProfile(true)}
            onCancel={cancelProfile} onSave={saveProfile} saving={savingProfile}
            darkMode={darkMode}
          >
            {loadingProfile ? <CardSkeleton darkMode={darkMode} /> : errorProfile ? <EmptyState message={errorProfile} darkMode={darkMode} /> : (
              <div className="space-y-4">
                <Field
                  label="Date of Birth" icon={Calendar} type="date" editing={editingProfile}
                  value={editingProfile ? profileDraft.date_of_birth : (profile?.date_of_birth?.split('T')[0] ?? '')}
                  onChange={v => setProfileDraft(p => ({ ...p, date_of_birth: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="National ID" icon={CreditCard} editing={editingProfile}
                  value={editingProfile ? profileDraft.national_id : (profile?.national_id ?? '')}
                  onChange={v => setProfileDraft(p => ({ ...p, national_id: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Phone" icon={Phone} type="tel" editing={editingProfile}
                  value={editingProfile ? profileDraft.phone : (profile?.phone ?? '')}
                  onChange={v => setProfileDraft(p => ({ ...p, phone: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Alternative Phone" icon={Phone} type="tel" placeholder="Optional" editing={editingProfile}
                  value={editingProfile ? profileDraft.alternative_phone : (profile?.alternative_phone ?? '')}
                  onChange={v => setProfileDraft(p => ({ ...p, alternative_phone: v }))}
                  darkMode={darkMode}
                />
              </div>
            )}
          </Card>

          {/* Address */}
          <Card
            icon={Home} title="Address" iconColor="text-violet-500"
            editing={editingAddress} onEdit={() => setEditingAddress(true)}
            onCancel={cancelAddress} onSave={saveAddress} saving={savingAddress}
            darkMode={darkMode}
          >
            {loadingProfile ? <CardSkeleton darkMode={darkMode} /> : errorProfile ? <EmptyState message={errorProfile} darkMode={darkMode} /> : (
              <div className="space-y-4">
                <Field
                  label="City" icon={MapPin} editing={editingAddress}
                  value={editingAddress ? addressDraft.city : (profile?.city ?? '')}
                  onChange={v => setAddressDraft(p => ({ ...p, city: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Street" icon={MapPin} editing={editingAddress}
                  value={editingAddress ? addressDraft.street : (profile?.street ?? '')}
                  onChange={v => setAddressDraft(p => ({ ...p, street: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="House Number" icon={Building2} editing={editingAddress}
                  value={editingAddress ? addressDraft.house_number : (profile?.house_number ?? '')}
                  onChange={v => setAddressDraft(p => ({ ...p, house_number: v }))}
                  darkMode={darkMode}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Employment */}
          <Card
            icon={Briefcase} title="Employment Details" iconColor="text-emerald-500"
            editing={editingEmployment} onEdit={() => setEditingEmployment(true)}
            onCancel={cancelEmployment} onSave={saveEmployment} saving={savingEmployment}
            darkMode={darkMode}
          >
            {loadingEmployment ? <CardSkeleton darkMode={darkMode} /> : errorEmployment ? <EmptyState message={errorEmployment} darkMode={darkMode} /> : (
              <div className="space-y-4">
                <Field
                  label="Occupation" icon={Briefcase} editing={editingEmployment}
                  value={editingEmployment ? employmentDraft.occupation : (employment?.occupation ?? '')}
                  onChange={v => setEmploymentDraft(p => ({ ...p, occupation: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Employer Name" icon={Building2} placeholder="Optional" editing={editingEmployment}
                  value={editingEmployment ? employmentDraft.employer_name : (employment?.employer_name ?? '')}
                  onChange={v => setEmploymentDraft(p => ({ ...p, employer_name: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Monthly Income" icon={DollarSign} type={editingEmployment ? 'number' : 'text'} editing={editingEmployment}
                  value={editingEmployment ? employmentDraft.monthly_income : formatCurrency(employment?.monthly_income ?? 0)}
                  onChange={v => setEmploymentDraft(p => ({ ...p, monthly_income: v }))}
                  darkMode={darkMode}
                />
              </div>
            )}
          </Card>

          {/* Next of Kin */}
          <Card
            icon={Users} title="Next of Kin" iconColor="text-amber-500"
            editing={editingKin} onEdit={() => setEditingKin(true)}
            onCancel={cancelKin} onSave={saveKin} saving={savingKin}
            darkMode={darkMode}
          >
            {loadingKin ? <CardSkeleton darkMode={darkMode} /> : errorKin ? <EmptyState message={errorKin} darkMode={darkMode} /> : (
              <div className="space-y-4">
                <Field
                  label="Full Name" icon={UserCircle} editing={editingKin}
                  value={editingKin ? kinDraft.full_name : (nextOfKin?.full_name ?? '')}
                  onChange={v => setKinDraft(p => ({ ...p, full_name: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Phone" icon={Phone} type="tel" editing={editingKin}
                  value={editingKin ? kinDraft.phone : (nextOfKin?.phone ?? '')}
                  onChange={v => setKinDraft(p => ({ ...p, phone: v }))}
                  darkMode={darkMode}
                />
                <Divider darkMode={darkMode} />
                <Field
                  label="Relationship" icon={Heart} editing={editingKin}
                  value={editingKin ? kinDraft.relationship : (nextOfKin?.relationship ?? '')}
                  onChange={v => setKinDraft(p => ({ ...p, relationship: v }))}
                  darkMode={darkMode}
                />
              </div>
            )}
          </Card>
        </div>

        {/* Account Details — read-only - Removed role display */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className={`flex items-center gap-2.5 px-6 py-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <ShieldCheck size={17} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Account Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Username', value: userData.username, icon: UserCircle, color: 'text-blue-400' },
              { label: 'Email',    value: userData.email,    icon: Mail,        color: 'text-blue-400' }
              // Removed role from account details
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Icon size={17} className={`${color} shrink-0`} />
                <div className="min-w-0">
                  <p className={`text-xs uppercase tracking-wider ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>{label}</p>
                  <p className={`text-sm font-semibold truncate ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} darkMode={darkMode} />}

    </div>
  );
}