import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

  const { pathname } = req.nextUrl;

  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL(`/dashboard/${token.role}`, req.url));
    }
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (token && (pathname.startsWith('/signin') || pathname.startsWith('/signup'))) {
    return NextResponse.redirect(new URL(`/dashboard/${token.role}`, req.url));
  }

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  if (token && pathname.startsWith('/dashboard')) {
    const role = token.role as string;
    if (!pathname.startsWith(`/dashboard/${role}`)) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/signin', '/signup'],
};