import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 角色路由映射
const roleRoutes: Record<string, string[]> = {
  client: ['/dashboard'],
  designer: ['/designer'],
  admin: ['/admin', '/dashboard', '/designer'],
};

function getDefaultPathForRole(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin/overview';
    case 'designer':
      return '/designer/overview';
    case 'client':
      return '/dashboard/overview';
    default:
      return '/login';
  }
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

function getSessionFromCookie(cookieHeader: string | null): { userId: string; role: string } | null {
  if (!cookieHeader) return null;
  try {
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map((c) => {
        const [key, ...values] = c.split('=');
        return [key, decodeURIComponent(values.join('='))];
      })
    );
    const sessionValue = cookies['auth_session'];
    if (!sessionValue) return null;
    const session = JSON.parse(sessionValue) as { userId: string; role: string };
    return { userId: session.userId, role: session.role };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const session = getSessionFromCookie(request.headers.get('cookie'));

  if (pathname === '/login' || pathname === '/register') {
    if (session) {
      return NextResponse.redirect(new URL(getDefaultPathForRole(session.role), request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/designer') || pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const allowed = roleRoutes[session.role] ?? [];
    const hasAccess = matchesRoute(pathname, allowed);
    if (!hasAccess) {
      return NextResponse.redirect(new URL(getDefaultPathForRole(session.role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/designer/:path*',
    '/admin/:path*',
  ],
};
