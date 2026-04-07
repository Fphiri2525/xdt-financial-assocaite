import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value?.toLowerCase();
  const path = request.nextUrl.pathname;

  // ✅ Protect these routes only
  if (path.startsWith('/adminpanel') || path.startsWith('/client')) {

    if (!token) {
      // ✅ Redirect to your actual login page path
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (path.startsWith('/adminpanel')) {
      if (userRole !== 'admin' && userRole !== 'administrator') {
        return NextResponse.redirect(new URL('/client/dashboard', request.url));
      }
    }

    if (path.startsWith('/client')) {
      if (userRole === 'admin' || userRole === 'administrator') {
        return NextResponse.redirect(new URL('/adminpanel/dashboard', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  // ✅ Only match protected routes — NOT /admin/login itself
  matcher: ['/adminpanel/:path*', '/client/:path*'],
};