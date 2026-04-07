// components/admin/Footer.tsx
'use client';

import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
        <p>XT Data Loan Management System</p>
        <p className="mt-2 sm:mt-0">© {currentYear} Robert Mwase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;