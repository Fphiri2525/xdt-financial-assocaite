'use client';

import { usePathname } from 'next/navigation';
import NaviBar from './NaviBar';
import Footer from './footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  // Only hide navbar/footer for dashboard, admin or client routes
  const hideLayout =
    pathname === '/admin/login' ||
    pathname === '/login' ||
    pathname.startsWith('/client/') ||
    pathname.startsWith('/adminpanel/') ||
    pathname.startsWith('/xtData/') ||
    pathname.startsWith('/payment-details');

  return (
    <>
      {!hideLayout && <NaviBar />}
      <main className={`flex-grow ${hideLayout ? '' : 'pt-16'} min-h-screen`}>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}