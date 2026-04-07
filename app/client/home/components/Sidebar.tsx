'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  History,
  UserCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  userData?: {
    username: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  darkMode,
  userData,
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const closeSidebar = () => {
    if (onClose) onClose();
  };

  const isActiveLink = (href: string) => pathname === href;

  const navigationItems = [
    { name: 'Dashboard',      href: '/client/dashboard', icon: LayoutDashboard },
    { name: 'Apply for Loan', href: '/client/home',      icon: FileText },
    { name: 'User Profile',   href: '/client/profile',   icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40
          transition-transform duration-300 ease-in-out
          border-r shadow-xl w-72
          ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">XD</span>
                </div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  XDT
                </h2>
              </div>
              {/* Close button — mobile only */}
              {isMobile && isOpen && (
                <button
                  onClick={closeSidebar}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X size={24} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                </button>
              )}
            </div>
          </div>

          {/* User info */}
          {userData && (
            <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-4">
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
                `}>
                  <UserCircle size={32} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {userData.username}
                  </p>
                  <p className={`text-xs truncate mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        // ✅ Only close sidebar on mobile — keeps it open on desktop
                        if (isMobile) closeSidebar();
                      }}
                      className={`
                        flex items-center px-4 py-3 text-base rounded-xl transition-all duration-200
                        ${active
                          ? 'bg-blue-600 text-white shadow-md'
                          : darkMode
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon size={20} className="mr-4 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                      {active && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-white" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Version 1.0.0
            </p>
            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2024 XDT. All rights reserved.
            </p>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;