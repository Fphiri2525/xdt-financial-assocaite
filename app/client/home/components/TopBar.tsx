'use client';

import React, { useState, useEffect } from 'react';
import { User, LogOut, Moon, Sun, Bell, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface UserData {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

export interface TopBarProps {
  darkMode: boolean;
  userData: UserData | null;
  onToggleTheme: () => void;
  onLogout: () => void;
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  darkMode,
  userData,
  onToggleTheme,
  onLogout,
  onMenuClick,
  isSidebarOpen = false,
}) => {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
    setShowDropdown(false);
    setShowNotifications(false);
  };

  const toggleDropdown = () => {
    setShowDropdown((v) => !v);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((v) => !v);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    onLogout();
    router.push('/admin/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.dropdown-container') &&
        !target.closest('.notifications-container')
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, message: 'Loan application approved',    time: '2 hours ago', read: false },
    { id: 2, message: 'Payment due in 3 days',        time: '1 day ago',   read: false },
    { id: 3, message: 'Profile updated successfully', time: '2 days ago',  read: true  },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav
      className={`
        sticky top-0 z-30 w-full border-b shadow-lg transition-all duration-300
        ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Left: hamburger + logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
              aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu size={20} className="md:w-6 md:h-6" />
            </button>

            <div className="flex items-center space-x-2 md:space-x-3">
              <div className={`
                w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center
                ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}
              `}>
                <span className="text-white font-bold text-sm md:text-base">XD</span>
              </div>
              <h1 className={`
                text-lg md:text-xl font-bold hidden sm:block
                ${darkMode ? 'text-white' : 'text-gray-900'}
              `}>
                XDT
              </h1>
            </div>
          </div>

          {/* Right: notifications, theme, user */}
          <div className="flex items-center space-x-2 md:space-x-3">

            {/* Notifications */}
            <div className="relative notifications-container">
              <button
                onClick={toggleNotifications}
                className={`
                  p-2 rounded-lg transition-all duration-200 relative
                  ${darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                aria-label="Notifications"
              >
                <Bell size={20} className="md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-gray-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className={`
                  absolute right-0 mt-2 w-80 md:w-96 rounded-xl shadow-xl py-2 z-50
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
                `}>
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`
                          px-4 py-3 cursor-pointer transition-colors
                          ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}
                          ${!n.read ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}
                        `}
                        onClick={() => handleNavigation('/xdt/notifications')}
                      >
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {n.message}
                        </p>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => handleNavigation('/xdt/notifications')}
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 w-full text-center font-medium"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className={`
                p-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                ${darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
              aria-label="Toggle theme"
            >
              {darkMode
                ? <Sun size={20} className="md:w-5 md:h-5" />
                : <Moon size={20} className="md:w-5 md:h-5" />
              }
            </button>

            {/* User dropdown */}
            {userData && (
              <div className="relative dropdown-container">
                <button
                  onClick={toggleDropdown}
                  className={`
                    flex items-center space-x-2 p-1.5 rounded-lg transition-all duration-200
                    ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
                  `}
                  aria-label="User menu"
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}
                  `}>
                    <User size={16} className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userData.username}
                    </p>
                  </div>
                  <svg
                    className={`
                      w-4 h-4 transition-transform hidden lg:block
                      ${darkMode ? 'text-gray-400' : 'text-gray-500'}
                      ${showDropdown ? 'rotate-180' : ''}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className={`
                    absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 z-50
                    ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}
                  `}>
                    <button
                      onClick={() => handleNavigation('/client/profile')}
                      className={`
                        w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3
                        ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <User size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`
                        w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3
                        ${darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}
                      `}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;