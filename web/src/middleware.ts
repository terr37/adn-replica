import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token');
  const pathname = request.nextUrl.pathname;

  // Protect the root route (and potentially other internal paths if needed later)
  if (pathname === '/') {
    if (!sessionToken) {
      // Redirect to login if there is no session token cookie
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to / if trying to access auth pages while logged in
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    if (sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register'],
};
