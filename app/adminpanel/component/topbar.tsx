// app/adminpanel/component/topbar.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut, Settings, ChevronDown, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  userData?: {
    username: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
  onMenuClick?: () => void;
  onLayoutChange?: (layout: 'grid' | 'list') => void;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onQuickAdd?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  userData, 
  onLogout, 
  onMenuClick,
  isCollapsed,
  onToggleCollapse
}) => {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Your loan payment was verified', time: '5 min ago', read: false },
    { id: 2, text: 'Weekly payment due in 2 days', time: '1 hour ago', read: false },
    { id: 3, text: 'Loan application approved', time: 'Yesterday', read: true },
  ]);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = async () => {
    try {
      // Clear all authentication data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('sidebarCollapsed');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Optional: Call logout API if needed
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {
        // Ignore API errors, just proceed with logout
        console.log('Logout API not available, proceeding with client-side logout');
      });
      
      // Close the profile menu
      setShowProfileMenu(false);
      
      // Redirect to admin login page
      router.push('/admin/login');
      router.refresh(); // Refresh to clear any cached data
      
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/admin/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left section - Menu Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar collapse"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Center - App Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Client Portal
            </h1>
          </div>

          {/* Right section - Notifications and Profile */}
          <div className="flex items-center gap-2">
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {notification.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Bell size={24} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-sm text-gray-500">No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown with Logout */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                  {userData?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userData?.username || 'User'}</p>
                  <p className="text-xs text-gray-500">{userData?.email?.split('@')[0] || ''}</p>
                </div>
                <ChevronDown size={16} className="hidden md:block text-gray-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{userData?.username || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{userData?.email || 'user@example.com'}</p>
                  </div>
                  
                  <a
                    href="/client/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>Your Profile</span>
                  </a>
                  
                  <a
                    href="/client/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={16} className="text-gray-400" />
                    <span>Settings</span>
                  </a>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;