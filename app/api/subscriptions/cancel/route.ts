import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * POST /api/subscriptions/cancel
 * 取消订阅
 * 需要认证，仅限客户角色
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 获取用户当前活跃的订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing'],
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '您当前没有活跃的订阅',
            code: 'NO_ACTIVE_SUBSCRIPTION',
          },
        },
        { status: 422 }
      );
    }

    // 更新订阅状态为已取消
    // 注意：这里不立即终止订阅，而是关闭自动续费，让当前周期自然结束
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        autoRenew: false,
        status: 'cancelled',
        cancelledAt: new Date(),
      },
      include: {
        plan: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          plan: updatedSubscription.plan,
          endDate: updatedSubscription.endDate,
          cancelledAt: updatedSubscription.cancelledAt,
        },
      },
      message: '订阅已取消，当前周期将在到期日结束，之后将不再自动续费',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
