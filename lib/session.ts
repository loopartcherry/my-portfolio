import { cookies } from 'next/headers';
import { UserRole } from './types/user';

const SESSION_COOKIE_NAME = 'auth_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天

export interface SessionData {
  userId: string;
  email: string;
  role: UserRole;
  name?: string;
}

/**
 * 创建 Session
 */
export async function createSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * 获取 Session
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionData;
  } catch {
    return null;
  }
}

/**
 * 删除 Session
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * 从请求头获取 Session（用于 API 路由）
 */
export function getSessionFromRequest(request: Request): SessionData | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [key, ...values] = c.split('=');
      return [key, decodeURIComponent(values.join('='))];
    })
  );

  const sessionValue = cookies[SESSION_COOKIE_NAME];
  if (!sessionValue) return null;

  try {
    return JSON.parse(sessionValue) as SessionData;
  } catch {
    return null;
  }
}
