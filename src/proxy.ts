import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const loggedIn = request.cookies.get('logged_in')?.value === 'true';

  if (!loggedIn) {
    const redirect = request.nextUrl.pathname;
    const loginUrl = new URL(`/login?redirect=${encodeURIComponent(redirect)}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
