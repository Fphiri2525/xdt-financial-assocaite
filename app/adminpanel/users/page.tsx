'use client';

import { useState, useEffect, ChangeEvent } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface User {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

interface FormState {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
}

// ── API Layer ──────────────────────────────────────────────────────────────────
const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://loan-backend-production-558e.up.railway.app') + '/api/users';

async function apiGetAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE}/all`, { cache: 'no-store' });
  const json = (await res.json()) as { users?: User[]; message?: string };
  if (!res.ok) throw new Error(json.message ?? 'Failed to fetch users');
  return json.users ?? [];
}

async function apiAddUser(payload: FormState): Promise<void> {
  const res = await fetch(`${BASE}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = (await res.json()) as { message?: string };
  if (!res.ok) throw new Error(json.message ?? 'Failed to create user');
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const initials = (name: string) => (name ?? '').slice(0, 2).toUpperCase();

const ROLE_COLORS: Record<string, { dot: string; badge: string }> = {
  admin:     { dot: 'bg-rose-500',    badge: 'bg-rose-50 text-rose-700 ring-rose-200' },
  moderator: { dot: 'bg-amber-400',   badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  client:    { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
};

function getRoleStyle(role: string) {
  const normalizedRole = role?.toLowerCase() === 'client' ? 'client' : role?.toLowerCase();
  return ROLE_COLORS[normalizedRole] ?? ROLE_COLORS['client'];
}

// ── Small Components ───────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const s = getRoleStyle(role);
  const displayRole = role?.toLowerCase() === 'client' ? 'Client' : role;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider ring-1 ${s.badge}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {displayRole === 'client' ? 'Client' : displayRole}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
      {initials(name)}
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 rounded-full border-3 border-gray-200 border-t-gray-800 animate-spin" />
    </div>
  );
}

function Toast({ message, type, visible }: ToastState) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
    } ${
      type === 'success'
        ? 'bg-white border border-emerald-200 text-emerald-800 shadow-emerald-100'
        : 'bg-white border border-rose-200 text-rose-800 shadow-rose-100'
    }`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      {message}
    </div>
  );
}

function InputField({
  label, name, type = 'text', placeholder, value, onChange, required, error,
}: {
  label: string; name: string; type?: string; placeholder?: string;
  value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean; error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-300 outline-none focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all ${
          error ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-gray-400'
        }`}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UserManagementPage() {
  const [tab, setTab]               = useState<'list' | 'add'>('list');
  const [users, setUsers]           = useState<User[]>([]);
  const [filtered, setFiltered]     = useState<User[]>([]);
  const [loading, setLoading]       = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string>('');
  const [search, setSearch]         = useState<string>('');
  const [roleFilter, setRole]       = useState<string>('');
  const [submitting, setSub]        = useState<boolean>(false);
  const [toast, setToast]           = useState<ToastState>({ visible: false, message: '', type: 'success' });
  const [form, setForm]             = useState<FormState>({ username: '', email: '', password: '', role: '' });
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({});

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  }

  async function loadUsers(): Promise<void> {
    setLoading(true);
    setFetchError('');
    try {
      const list = await apiGetAllUsers();
      setUsers(list);
      setFiltered(list);
    } catch (err) {
      const msg = (err as Error).message;
      setFetchError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const r = roleFilter.toLowerCase();
    setFiltered(
      users.filter((u: User) => {
        const matchQ = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        const matchR = !r || u.role.toLowerCase() === r;
        return matchQ && matchR;
      })
    );
  }, [search, roleFilter, users]);

  // Calculate stats
  const stats = {
    totalClients: users.filter((u: User) => u.role?.toLowerCase() === 'client').length,
    totalAdmins: users.filter((u: User) => u.role?.toLowerCase() === 'admin').length,
  };

  function validateForm(): boolean {
    const errors: Partial<FormState> = {};
    if (!form.username.trim())  errors.username = 'Username is required';
    if (!form.email.trim())     errors.email    = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.password)         errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Min. 6 characters';
    if (!form.role)             errors.role     = 'Select a role';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleAddUser(): Promise<void> {
    if (!validateForm()) return;
    setSub(true);
    try {
      await apiAddUser(form);
      showToast(`"${form.username}" has been added successfully`, 'success');
      setForm({ username: '', email: '', password: '', role: '' });
      setFormErrors({});
      setTab('list');
      await loadUsers();
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setSub(false);
    }
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (formErrors[name as keyof FormState]) {
      setFormErrors(fe => ({ ...fe, [name]: '' }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        
        
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
          
            <button
              onClick={() => setTab('add')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                tab === 'add'
                  ? 'bg-blue text-white shadow-lg shadow-gray-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Add New
            </button>
          </div>
          
          {/* Status Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
            fetchError ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${fetchError ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
            <span className="hidden sm:inline">{fetchError ? 'Connection Error' : 'Connected'}</span>
          </div>
        </div>

        {/* ════ LIST PANEL ════ */}
        {tab === 'list' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clients</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">
                      {loading ? '—' : stats.totalClients}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 118 0m-8 0a4 4 0 008 0m-4-6a4 4 0 110-8 4 4 0 010 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Admins</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1 tracking-tight">
                      {loading ? '—' : stats.totalAdmins}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
                />
              </div>
              <select
                value={roleFilter}
                onChange={e => setRole(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white outline-none focus:border-gray-400 cursor-pointer transition-all"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="client">Client</option>
              </select>
              <button
                onClick={loadUsers}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white hover:border-gray-400 hover:text-gray-800 transition-all disabled:opacity-50"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {loading ? (
                <Spinner />
              ) : fetchError ? (
                <div className="flex flex-col items-center justify-center py-32 text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-gray-800">Cannot reach the database</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-md">{fetchError}</p>
                  <button onClick={loadUsers} className="mt-6 px-6 py-2.5 text-sm bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                    Retry Connection
                  </button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 118 0m-8 0a4 4 0 008 0M12 12a4 4 0 100-8 4 4 0 000 8z" />
                  </svg>
                  <p className="text-base">No users found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">User</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">ID</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map((u: User) => (
                        <tr key={u.user_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={u.username} />
                              <p className="text-sm font-semibold text-gray-900">{u.username}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <RoleBadge role={u.role} />
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 font-mono">
                              #{String(u.user_id).padStart(4, '0')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 break-all">{u.email}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            {!loading && !fetchError && filtered.length > 0 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <p className="text-xs text-gray-500">
                  Showing {filtered.length} of {users.length} users
                </p>
              </div>
            )}
          </div>
        )}

        {/* ════ ADD USER PANEL ════ */}
        {tab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Add New User</h2>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Username" name="username" placeholder="johndoe"
                    value={form.username} onChange={handleFormChange}
                    required error={formErrors.username}
                  />
                  <InputField
                    label="Email" name="email" type="email" placeholder="john@example.com"
                    value={form.email} onChange={handleFormChange}
                    required error={formErrors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Password" name="password" type="password" placeholder="Min 6 characters"
                    value={form.password} onChange={handleFormChange}
                    required error={formErrors.password}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Role <span className="text-rose-400">*</span>
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleFormChange}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-gray-100 transition-all cursor-pointer ${
                        formErrors.role ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-gray-50 focus:border-gray-400'
                      }`}
                    >
                      <option value="">Select role...</option>
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="client">Client</option>
                    </select>
                    {formErrors.role && <p className="text-xs text-rose-500">{formErrors.role}</p>}
                  </div>
                </div>

                {/* Preview Card */}
                {(form.username || form.email || form.role) && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                    <Avatar name={form.username || '?'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">
                        {form.username || <span className="text-gray-400">Username</span>}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {form.email || <span className="text-gray-400">Email</span>}
                      </p>
                    </div>
                    {form.role && <RoleBadge role={form.role} />}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      onClick={() => { setForm({ username: '', email: '', password: '', role: '' }); setFormErrors({}); }}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors order-2 sm:order-1"
                    >
                      Clear form
                    </button>
                    <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                      <button
                        onClick={() => setTab('list')}
                        className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddUser}
                        disabled={submitting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Create User
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast {...toast} />
    </div>
  );
}