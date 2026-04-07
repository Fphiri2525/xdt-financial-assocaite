'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  UserCircle, Mail, ShieldCheck, Sun, Moon
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserData { 
  username: string; 
  email: string; 
  role: string; 
}

// ─── Config ───────────────────────────────────────────────────────────────────

const API_BASE = 'https://loan-backend-production-558e.up.railway.app/api';

// ─── UI Primitives ────────────────────────────────────────────────────────────

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
    {message}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === 'dark';

  const [userData, setUserData] = useState<UserData | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { 
        setUserData(JSON.parse(stored)); 
      } catch { 
        setUserData(null); 
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  if (!userData) {
    return (
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
  }

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

      {/* Header */}
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
              <h1 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>{userData.username}</h1>
              <p className={`text-sm mt-1 flex items-center gap-1.5 ${
                darkMode ? 'text-gray-400' : 'text-gray-400'
              }`}>
                <Mail size={13} /> {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Only Account Details */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Account Details */}
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
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <UserCircle size={17} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className={`text-xs uppercase tracking-wider ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>Username</p>
                  <p className={`text-sm font-semibold truncate ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{userData.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Mail size={17} className="text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <p className={`text-xs uppercase tracking-wider ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>Email</p>
                  <p className={`text-sm font-semibold truncate ${
                    darkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>{userData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Toast notification */}
      {toast && <Toast message={toast.message} type={toast.type} darkMode={darkMode} />}

    </div>
  );
}