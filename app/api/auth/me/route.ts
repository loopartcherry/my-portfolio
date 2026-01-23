import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/session';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 */
export async function GET(request: NextRequest) {
  try {
    const session = getSessionFromRequest(request);

    if (!session) {
      throw new ApiError(401, '未登录', 'UNAUTHORIZED');
    }

    // 从数据库获取最新用户信息
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, '用户不存在', 'USER_NOT_FOUND');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
