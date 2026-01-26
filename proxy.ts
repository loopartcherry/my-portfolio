import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 公开路由（无需登录）
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/about',
  '/methodology',
  '/insights',
  '/portfolio',
  '/pricing',
  '/diagnosis',
  '/cart',
  '/shop',
  '/api/auth/login',
  '/api/auth/register',
];

// 角色路由映射
const roleRoutes: Record<string, string[]> = {
  client: ['/dashboard'],
  designer: ['/designer'],
  admin: ['/admin', '/dashboard', '/designer'], // 管理员可以访问所有
};

// 根据角色获取默认重定向路径
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

// 检查路径是否匹配路由前缀
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => pathname.startsWith(route));
}

// 从 cookie 中解析 session
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

    const session = JSON.parse(sessionValue);
    return {
      userId: session.userId,
      role: session.role,
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静态资源和 API 路由直接通过
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 检查是否为公开路由
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));

  // 获取 session
  const session = getSessionFromCookie(request.headers.get('cookie'));

  // 未登录用户
  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    // 重定向到登录页
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录用户访问登录/注册页，重定向到对应 dashboard
  if (pathname === '/login' || pathname === '/register') {
    const defaultPath = getDefaultPathForRole(session.role);
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  // 检查角色权限
  const allowedRoutes = roleRoutes[session.role] || [];
  const hasAccess = isPublicRoute || matchesRoute(pathname, allowedRoutes);

  if (!hasAccess) {
    // 无权限访问，重定向到对应 dashboard
    const defaultPath = getDefaultPathForRole(session.role);
    return NextResponse.redirect(new URL(defaultPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png).*)',
  ],
};
