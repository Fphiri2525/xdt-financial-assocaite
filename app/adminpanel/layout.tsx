// app/client/layout.tsx
'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { TopBar } from '../adminpanel/component/topbar';
import { Sidebar } from '../adminpanel/component/sidebar';
import { useRouter } from 'next/navigation';

interface UserData {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

// Create Sidebar Context
interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Load sidebar state from localStorage
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === 'true');
    }
  }, []);

  // Save sidebar state
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', String(isCollapsed));
    }
  }, [isCollapsed, mounted]);

  // Handle window resize - close mobile sidebar on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('sidebarCollapsed');
    sessionStorage.clear();
    
    // Redirect to admin login page
    router.push('/admin/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  const handleLayoutChange = (layout: 'grid' | 'list') => {
    console.log('Layout changed:', layout);
  };

  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  const handleQuickAdd = () => {
    console.log('Quick add');
  };

  const handleNotificationClick = () => {
    console.log('Notifications');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <SidebarContext.Provider 
        value={{ 
          isCollapsed, 
          toggleCollapse, 
          isMobileOpen, 
          toggleMobile, 
          closeMobile 
        }}
      >
        <div className="min-h-screen bg-gray-50">
          {/* Sidebar - Fixed position */}
          <Sidebar 
            userData={userData}
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
            isMobileOpen={isMobileOpen}
            onToggleCollapse={toggleCollapse}
            onCloseMobile={closeMobile}
          />
          
          {/* Main content - With dynamic margin based on sidebar state */}
          <div 
            className={`
              transition-all duration-300 min-h-screen flex flex-col
              ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}
              ${isMobileOpen ? 'overflow-hidden' : ''}
            `}
          >
            {/* TopBar - Fixed at top */}
            <TopBar 
              userData={userData}
              onLogout={handleLogout}
              onMenuClick={toggleMobile}
              onLayoutChange={handleLayoutChange}
              onSearch={handleSearch}
              onNotificationClick={handleNotificationClick}
              onQuickAdd={handleQuickAdd}
              isCollapsed={isCollapsed}
              onToggleCollapse={toggleCollapse}
            />
            
            {/* Page Content - Scrollable area */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarContext.Provider>
    </ThemeProvider>
  );
}