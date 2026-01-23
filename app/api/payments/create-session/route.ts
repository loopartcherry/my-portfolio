import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

const CreatePaymentSessionSchema = z.object({
  orderId: z.string().min(1, '订单ID不能为空'),
  paymentMethod: z.enum(['stripe', 'alipay', 'wechat']).default('alipay'),
});

/**
 * POST /api/payments/create-session
 * 创建支付会话（生成支付链接）
 * 仅限 CLIENT 角色
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);
    const body = await request.json();
    const v = z.object(CreatePaymentSessionSchema.shape).parse(body);

    // 查找订单
    const order = await prisma.order.findUnique({
      where: { id: v.orderId },
      include: {
        template: {
          select: { id: true, name: true },
        },
      },
    });

    if (!order) {
      throw new ApiError(404, '订单不存在', 'ORDER_NOT_FOUND');
    }

    if (order.userId !== userId) {
      throw new ApiError(403, '无权访问此订单', 'FORBIDDEN');
    }

    if (order.status !== 'pending') {
      throw new ApiError(400, '订单状态不正确', 'INVALID_ORDER_STATUS');
    }

    // 模拟支付会话创建
    // 实际环境中，这里应该调用 Stripe/Alipay API
    const paymentSessionId = `ps_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    
    // 生成支付链接（模拟）
    let paymentUrl: string;
    if (v.paymentMethod === 'stripe') {
      // Stripe 支付链接（模拟）
      paymentUrl = `/api/payments/stripe/checkout?session_id=${paymentSessionId}&order_id=${v.orderId}`;
    } else if (v.paymentMethod === 'alipay') {
      // 支付宝支付链接（模拟）
      paymentUrl = `/api/payments/alipay/checkout?session_id=${paymentSessionId}&order_id=${v.orderId}`;
    } else {
      // 微信支付链接（模拟）
      paymentUrl = `/api/payments/wechat/checkout?session_id=${paymentSessionId}&order_id=${v.orderId}`;
    }

    // 更新订单元数据，保存支付会话ID
    await prisma.order.update({
      where: { id: v.orderId },
      data: {
        metadata: {
          ...((order.metadata as Record<string, unknown>) || {}),
          paymentSessionId,
          paymentMethod: v.paymentMethod,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentUrl,
        paymentSessionId,
        orderId: v.orderId,
        amount: order.amount,
      },
      message: '支付会话创建成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
