import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/orders
 * 获取当前用户的订单列表
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const where: Prisma.OrderWhereInput = { userId };
    if (status && status !== 'all') {
      where.status = status;
    }
    if (type && type !== 'all') {
      where.type = type;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        template: {
          select: {
            id: true,
            name: true,
            preview: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: orders.map((order) => ({
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
      })),
      count: orders.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
