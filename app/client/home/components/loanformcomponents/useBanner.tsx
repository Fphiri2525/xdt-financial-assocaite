'use client';

// app/home/components/loanformcomponents/useBanner.tsx

import React, { useEffect, useState } from 'react';
import { User, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserBannerProps {
  darkMode: boolean;
  userEmail: string;
  userName?: string;
}

export const UserBanner: React.FC<UserBannerProps> = ({ darkMode, userEmail, userName }) => {
  const router = useRouter();

  // Pull the logged-in name from localStorage — same pattern as Sidebar
  const [displayName, setDisplayName] = useState<string>(userName || '');

  useEffect(() => {
    // Only read storage if no name was passed as a prop
    if (!displayName) {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setDisplayName(parsed.username || parsed.email || 'Valued Customer');
        }
      } catch {
        setDisplayName('Valued Customer');
      }
    }
  }, [displayName]);

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500" />

      {/* Decorative blobs */}
      <div className="absolute -right-12 -top-12 w-52 h-52 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-52 h-52 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-40 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          {/* Left — greeting */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-blue-200" />
                <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">
                  Customer Portal
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Welcome ,{' '}
                <span className="text-blue-100">
                  {displayName || 'Valued Customer'}
                </span>
                !
              </h2>
              <p className="text-blue-100/80 text-sm mt-1.5 max-w-md leading-snug">
                Your financial journey starts here. Apply for a loan quickly and securely with XT Data.
              </p>
            </div>
          </div>

          {/* Right — Apply for Loan button */}
          <div className="shrink-0">
            <button
              onClick={() => {
                console.log('Navigating to /client/home');
                router.push('/client/home');
              }}
              className="
                group flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm
                bg-white text-blue-700 shadow-lg
                hover:bg-blue-50 hover:shadow-xl
                active:scale-95
                transition-all duration-200
              "
            >
              <FileText size={15} className="shrink-0" />
              Apply for Loan
              <ArrowRight
                size={14}
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-5 pt-4 border-t border-white/20 flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <p className="text-white/75 text-sm">
            Fill in your details to complete your loan application online with XT Data.
          </p>
        </div>
      </div>
    </div>
  );
};