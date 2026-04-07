import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to protect admin and client routes based on authentication and role.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value?.toLowerCase();
  const path = request.nextUrl.pathname;

  // ✅ Only protect adminpanel and client routes
  if (path.startsWith('/adminpanel') || path.startsWith('/client')) {
    
    // Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Admin panel route protection
    if (path.startsWith('/adminpanel')) {
      if (userRole !== 'admin' && userRole !== 'administrator') {
        return NextResponse.redirect(new URL('/client/dashboard', request.url));
      }
    }

    // Client route protection
    if (path.startsWith('/client')) {
      if (userRole === 'admin' || userRole === 'administrator') {
        return NextResponse.redirect(new URL('/adminpanel/dashboard', request.url));
      }
    }
  }

  // Allow access if all checks pass
  return NextResponse.next();
}

/**
 * Configure which routes the middleware applies to.
 */
export const config = {
  matcher: ['/adminpanel/:path*', '/client/:path*'],
};