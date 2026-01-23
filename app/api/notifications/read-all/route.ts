import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * POST /api/notifications/read-all
 * 标记所有通知为已读
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireAuth(request);

    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        updatedCount: result.count,
      },
      message: `已标记 ${result.count} 条通知为已读`,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
