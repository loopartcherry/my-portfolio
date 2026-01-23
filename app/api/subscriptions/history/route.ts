import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/subscriptions/history
 * 获取订阅历史记录
 * 需要认证，仅限客户角色
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 解析查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // 查询所有订阅记录（包括历史）
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where: {
          userId,
        },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.subscription.count({
        where: {
          userId,
        },
      }),
    ]);

    // 查询相关的订单记录
    const orderIds = subscriptions
      .map((s) => s.id)
      .filter((id): id is string => id !== null);
    
    const orders = await prisma.order.findMany({
      where: {
        subscriptionId: {
          in: orderIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 组合订阅和订单数据
    const history = subscriptions.map((subscription) => {
      const relatedOrders = orders.filter(
        (order) => order.subscriptionId === subscription.id
      );

      return {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          type: subscription.type,
          plan: subscription.plan,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          price: subscription.price,
          autoRenew: subscription.autoRenew,
          cancelledAt: subscription.cancelledAt,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
        orders: relatedOrders.map((order) => ({
          id: order.id,
          amount: order.amount,
          status: order.status,
          type: order.type,
          createdAt: order.createdAt,
          paidAt: order.paidAt,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
