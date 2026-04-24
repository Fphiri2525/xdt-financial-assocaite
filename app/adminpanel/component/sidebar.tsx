// app/adminpanel/component/sidebar.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Users,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  User,
  UserPlus,
  UserCheck,
  UsersRound,
} from 'lucide-react';

interface SidebarProps {
  userData?: {
    username: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  userData, 
  isCollapsed, 
  isMobileOpen, 
  onToggleCollapse, 
  onCloseMobile 
}) => {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/adminpanel/dashboard',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      accent: 'border-blue-500',
      dot: 'bg-blue-500',
    },
    {
      name: 'Loan Applications',
      href: '/adminpanel/Recentapplication',
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      accent: 'border-purple-500',
      dot: 'bg-purple-500',
    },
    {
      name: 'Payments',
      href: '/adminpanel/payments',
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      accent: 'border-emerald-500',
      dot: 'bg-emerald-500',
    },
    {
      name: 'Users',
      href: '/adminpanel/users',
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      accent: 'border-indigo-500',
      dot: 'bg-indigo-500',
    },

    {
      name: 'Profile',
      href: '/adminpanel/settings',
      icon: UserCircle,
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
      accent: 'border-teal-500',
      dot: 'bg-teal-500',
    },

  ];

  
  const isActiveLink = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 flex flex-col
          bg-white border-r border-gray-200 shadow-xl
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`p-5 border-b border-gray-100 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">XT</span>
          </div>
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">XT Data</h2>
          )}
        </div>

        {/* User info */}
        {userData && (
          <div className={`border-b border-gray-100 ${isCollapsed ? 'p-4 flex justify-center' : 'p-5'}`}>
            {isCollapsed ? (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {userData.username?.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-base shrink-0">
                  {userData.username?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userData.username}</p>
                  <p className="text-xs text-blue-600 font-medium truncate">{userData.role}</p>
                  <p className="text-xs text-gray-400 truncate">{userData.email}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveLink(item.href);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={`
                      flex items-center rounded-xl transition-all duration-200 group
                      ${isCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-2.5'}
                      ${active
                        ? `${item.bgColor} ${item.color} border-l-4 ${item.accent}`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                      }
                    `}
                  >
                    <Icon
                      size={isCollapsed ? 22 : 19}
                      className={`shrink-0 transition-colors
                        ${isCollapsed ? '' : 'mr-3'}
                        ${active ? item.color : 'text-gray-400 group-hover:text-gray-600'}
                      `}
                    />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{item.name}</span>
                        {active && <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - No logout button here */}
        <div className={`border-t border-gray-100 py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && (
            <p className="text-xs text-gray-300 text-center">© 2024 XT Data · v1.0.0</p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;