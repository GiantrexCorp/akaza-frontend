import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedPaths = [
  '/dashboard',
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

function stripLocalePrefix(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length) || '/';
    }
  }
  return pathname;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for admin routes, API routes, and static assets
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.')
  ) {
    // Still handle auth redirects for admin
    if (pathname.startsWith('/admin')) {
      const isLoggedIn = request.cookies.get('logged_in')?.value === 'true';
      if (!isLoggedIn) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
    return NextResponse.next();
  }

  // Run next-intl middleware (handles locale detection, redirects, rewrites)
  const intlResponse = intlMiddleware(request);

  // After intl processing, check auth on the locale-stripped path
  const cleanPath = stripLocalePrefix(pathname);
  const isLoggedIn = request.cookies.get('logged_in')?.value === 'true';

  const isProtected = protectedPaths.some(
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`)
  );

  const isAuthPage = authPages.some(
    (p) => cleanPath === p || cleanPath.startsWith(`${p}/`)
  );

  if (!isLoggedIn && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return intlResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
