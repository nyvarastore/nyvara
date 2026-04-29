import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginRoute = request.nextUrl.pathname === '/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    // Check for the admin session cookie
    const adminAuth = request.cookies.get('nyvara_admin_auth')?.value;

    if (!adminAuth || adminAuth !== 'authenticated') {
      // Not authenticated, redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoginRoute) {
    const adminAuth = request.cookies.get('nyvara_admin_auth')?.value;
    if (adminAuth === 'authenticated') {
      // Already authenticated, redirect to admin dashboard
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
