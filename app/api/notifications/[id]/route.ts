import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/notifications/[id]
 * 标记通知为已读
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new ApiError(404, '通知不存在', 'NOTIFICATION_NOT_FOUND');
    }

    if (notification.userId !== userId) {
      throw new ApiError(403, '无权操作此通知', 'FORBIDDEN');
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: '通知已标记为已读',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/notifications/[id]
 * 删除通知
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new ApiError(404, '通知不存在', 'NOTIFICATION_NOT_FOUND');
    }

    if (notification.userId !== userId) {
      throw new ApiError(403, '无权删除此通知', 'FORBIDDEN');
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '通知已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
