import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/notifications
 * 获取当前用户的通知列表
 * 查询参数：
 * - read: 是否只显示已读/未读（可选）
 * - type: 通知类型（可选）
 * - page: 页码（默认1）
 * - limit: 每页数量（默认20）
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const read = searchParams.get('read');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
    };

    if (read !== null) {
      where.read = read === 'true';
    }

    if (type) {
      where.type = type;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
