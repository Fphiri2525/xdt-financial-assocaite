'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('email') || url.searchParams.has('password') || url.searchParams.has('token')) {
      url.searchParams.delete('email');
      url.searchParams.delete('password');
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.pathname);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (notification.type) setNotification({ type: null, message: '' });
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.username);
      localStorage.setItem('userId', data.user.user_id.toString());
      localStorage.setItem('userRole', data.user.role);

      setCredentials({ username: '', email: '', password: '', confirmPassword: '' });

      setNotification({
        type: 'success',
        message: `✓ Welcome back, ${data.user.username || data.user.email}! Redirecting...`,
      });

      setTimeout(() => {
        const userRole = data.user.role?.toLowerCase();
        if (userRole === 'admin' || userRole === 'administrator') {
          router.push('/adminpanel/dashboard');
        } else {
          router.push('/client/dashboard');
        }
      }, 1500);

    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Login failed. Please check your credentials.',
      });
      setCredentials((prev) => ({ ...prev, password: '' }));
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (credentials.password !== credentials.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match!' });
      setIsLoading(false);
      return;
    }

    if (credentials.password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://loan-backend-production-558e.up.railway.app/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          email: credentials.email,
          password: credentials.password,
          role: 'client',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setNotification({
        type: 'success',
        message: '✓ Registration successful! Please login with your credentials.',
      });

      setCredentials({ username: '', email: '', password: '', confirmPassword: '' });

      setTimeout(() => {
        setIsLoginMode(true);
        setNotification({ type: null, message: '' });
      }, 2000);

    } catch (error: any) {
      setNotification({
        type: 'error',
        message: error.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 relative">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        aria-label="Go back to home"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-md w-full bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-[#0B3C5D] py-6 px-4 text-center">
          <h1 className="text-2xl font-bold text-white">XDT Financial Associate</h1>
          <p className="text-blue-200 text-sm mt-1">
            {isLoginMode ? 'Sign in to access tools' : 'Create a new account'}
          </p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setIsLoginMode(true); setNotification({ type: null, message: '' }); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              isLoginMode ? 'text-[#0B3C5D] border-b-2 border-[#0B3C5D]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLoginMode(false); setNotification({ type: null, message: '' }); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              !isLoginMode ? 'text-[#0B3C5D] border-b-2 border-[#0B3C5D]' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {notification.type && (
          <div className={`mx-6 mt-4 p-4 rounded-lg text-sm flex items-start ${
            notification.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5 mr-2 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2 flex-shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {isLoginMode ? (
          <form onSubmit={handleLogin} method="post" className="p-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" id="email" name="email" required
                value={credentials.email} onChange={handleChange} disabled={isLoading}
                autoComplete="email"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-5">
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-[#1D70B8] hover:underline">Forgot?</a>
              </div>
              <input
                type="password" id="password" name="password" required
                value={credentials.password} onChange={handleChange} disabled={isLoading}
                autoComplete="current-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-[#0B3C5D] hover:bg-[#082d47] text-white font-medium rounded-lg transition-colors text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
            <p className="mt-6 text-center text-xs text-gray-500">Unauthorized access is logged</p>
          </form>
        ) : (
          <form onSubmit={handleRegister} method="post" className="p-6">
            <div className="mb-4">
              <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text" id="reg-username" name="username" required
                value={credentials.username} onChange={handleChange} disabled={isLoading}
                autoComplete="username"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Choose a username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" id="reg-email" name="email" required
                value={credentials.email} onChange={handleChange} disabled={isLoading}
                autoComplete="email"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password" id="reg-password" name="password" required
                value={credentials.password} onChange={handleChange} disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Create a password (min. 6 characters)"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
            </div>

            <div className="mb-5">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password" id="confirm-password" name="confirmPassword" required
                value={credentials.confirmPassword} onChange={handleChange} disabled={isLoading}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Confirm your password"
              />
            </div>

            <div className="mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                You will be registered as a Client
              </p>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3 bg-[#0B3C5D] hover:bg-[#082d47] text-white font-medium rounded-lg transition-colors text-base disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
            <p className="mt-6 text-center text-xs text-gray-500">By registering, you agree to our Terms of Service</p>
          </form>
        )}
      </div>
    </div>
  );
}