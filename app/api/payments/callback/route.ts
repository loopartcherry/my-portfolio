import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validatePaymentCallback } from '@/lib/api/order-validation';

/**
 * POST /api/payments/callback
 * 支付回调（支付平台回调此接口）
 * 公开接口，但需要验证签名
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const v = validatePaymentCallback(body);

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

    // 验证金额（防止篡改）
    if (Math.abs(order.amount - v.amount) > 0.01) {
      throw new ApiError(400, '支付金额不匹配', 'AMOUNT_MISMATCH');
    }

    // TODO: 验证支付平台签名（实际环境中必须实现）
    // if (v.signature && !verifyPaymentSignature(v)) {
    //   throw new ApiError(400, '签名验证失败', 'INVALID_SIGNATURE');
    // }

    // 使用事务更新订单状态
    await prisma.$transaction(async (tx) => {
      // 更新订单状态
      await tx.order.update({
        where: { id: v.orderId },
        data: {
          status: v.status === 'success' ? 'paid' : 'failed',
          paidAt: v.status === 'success' ? new Date() : null,
          transactionId: v.transactionId,
          metadata: {
            ...((order.metadata as any) || {}),
            paymentMethod: v.paymentMethod,
            callbackReceivedAt: new Date().toISOString(),
          },
        },
      });

      // 如果支付成功，增加模板下载次数
      if (v.status === 'success' && order.templateId) {
        await tx.template.update({
          where: { id: order.templateId },
          data: {
            downloads: {
              increment: 1,
            },
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: '支付回调处理成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
