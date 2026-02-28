import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/admin',
  '/hotels/book',
  '/tours/book',
  '/transfers/book',
];

const authPages = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get('logged_in')?.value === 'true';

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const isAuthPage = authPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/hotels/book',
    '/tours/book',
    '/transfers/book',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ],
};
