"use client";

// components/Navbar.jsx
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Accepted Collaterals', href: '/accepted-collaterals' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav 
      style={{ backgroundColor: '#0B3C5D' }} 
      className="text-white fixed top-0 left-0 w-full z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Business Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white hover:text-[#1D70B8] transition-colors">
            XDT financial Associate
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href 
                    ? 'bg-[#1D70B8] text-white' 
                    : 'text-white hover:bg-[#1D70B8] hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Login Button */}
              <Link
                href="/admin/login"
                className={`px-4 py-2 rounded-md text-sm font-medium border-2 border-white transition-colors ${
                  pathname === '/admin/login'
                  ? 'bg-white text-[#0B3C5D]'
                  : 'text-white hover:bg-white hover:text-[#0B3C5D]'
                }`}
              >
                Apply LOan
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#1D70B8] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href 
                  ? 'bg-[#1D70B8] text-white' 
                  : 'text-white hover:bg-[#1D70B8]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Admin Login */}
            <Link
              href="/admin/login"
              className={`block px-3 py-2 rounded-md text-base font-medium border-2 border-white transition-colors ${
                pathname === '/admin/login'
                ? 'bg-white text-[#0B3C5D]'
                : 'text-white hover:bg-white hover:text-[#0B3C5D]'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
            apply
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;