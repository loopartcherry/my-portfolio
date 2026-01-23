import { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { UserRole } from '@/lib/types/user';
import { ApiError } from './errors';

/**
 * 从请求中获取当前用户ID和角色
 */
export async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  const session = getSessionFromRequest(request);
  return session?.userId || null;
}

/**
 * 验证用户是否已认证
 */
export async function requireAuth(request: NextRequest): Promise<string> {
  const session = getSessionFromRequest(request);
  if (!session?.userId) {
    throw new ApiError(401, '未登录', 'UNAUTHORIZED');
  }
  return session.userId;
}

/**
 * 验证用户角色
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<{ userId: string; role: UserRole }> {
  const session = getSessionFromRequest(request);
  
  if (!session?.userId) {
    throw new ApiError(401, '未登录', 'UNAUTHORIZED');
  }

  const role = session.role as UserRole;
  
  if (!allowedRoles.includes(role)) {
    throw new ApiError(403, '权限不足', 'FORBIDDEN');
  }
  
  return { userId: session.userId, role };
}

/**
 * 仅允许客户角色访问
 */
export async function requireClient(request: NextRequest): Promise<string> {
  const { userId } = await requireRole(request, ['client']);
  return userId;
}

/**
 * 仅允许管理员角色访问
 */
export async function requireAdmin(request: NextRequest): Promise<string> {
  const { userId } = await requireRole(request, ['admin']);
  return userId;
}
