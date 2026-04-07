'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TopBar } from '../client/home/components/TopBar';
import { Sidebar } from '../client/home/components/Sidebar';
import { useRouter, usePathname } from 'next/navigation';

interface UserData {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublicPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/';

  useEffect(() => {
    setMounted(true);

    // Open sidebar by default on desktop
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/admin/login');
  };

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
        {children}
      </div>
    );
  }

  if (isPublicPage) {
    return (
      <ThemeProvider>
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
          <main>{children}</main>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>

        {/* Sidebar — always rendered, slides in/out via transform */}
        {userData && (
          <Sidebar
            darkMode={darkMode}
            userData={userData}
            onLogout={handleLogout}
            isOpen={sidebarOpen}
            onClose={closeSidebar}
          />
        )}

        {/*
          Main content wrapper.
          On desktop (md+): shift right by sidebar width (w-72 = 288px) when open.
          On mobile: no margin — sidebar uses overlay instead.
        */}
        <div
          className={`
            flex flex-col min-h-screen
            transition-[margin] duration-300 ease-in-out
            ${sidebarOpen ? 'md:ml-72' : 'ml-0'}
          `}
        >
          {/* TopBar */}
          {userData && (
            <TopBar
              darkMode={darkMode}
              userData={userData}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
              onMenuClick={toggleSidebar}
              isSidebarOpen={sidebarOpen}
            />
          )}

          {/* Page content */}
          <main
            className={`
              flex-1 transition-colors duration-300
              ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}
            `}
          >
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

      </div>
    </ThemeProvider>
  );
}