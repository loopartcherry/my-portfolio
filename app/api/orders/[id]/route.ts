import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/orders/[id]
 * 获取订单详情
 * 仅限订单所有者或管理员
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: orderId } = await context.params;

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        template: {
          select: {
            id: true,
            name: true,
            preview: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, '订单不存在', 'ORDER_NOT_FOUND');
    }

    // 检查权限（订单所有者或管理员）
    const session = request.headers.get('cookie');
    // 简单检查：实际应该从 session 获取角色
    if (order.userId !== userId) {
      // TODO: 检查是否为管理员
      throw new ApiError(403, '无权访问此订单', 'FORBIDDEN');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        type: order.type,
        amount: order.amount,
        status: order.status,
        paidAt: order.paidAt,
        transactionId: order.transactionId,
        createdAt: order.createdAt,
        template: order.template,
        templateId: order.templateId,
        metadata: order.metadata,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
