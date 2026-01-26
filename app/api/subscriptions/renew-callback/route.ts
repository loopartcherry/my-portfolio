import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import type { PrismaTransactionClient } from '@/lib/types/prisma';

/**
 * POST /api/subscriptions/renew-callback
 * 支付回调接口（续费通知）
 * 由支付网关（支付宝/微信）调用
 * 需要验证支付签名以确保安全性
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: 验证支付网关的签名
    // const isValid = verifyPaymentSignature(body);
    // if (!isValid) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       error: {
    //         message: '无效的支付签名',
    //         code: 'INVALID_SIGNATURE',
    //       },
    //     },
    //     { status: 401 }
    //   );
    // }

    const { orderId, paymentStatus, transactionId, paidAmount, paidAt } = body;

    // 验证必要参数
    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '缺少必要参数',
            code: 'MISSING_PARAMS',
          },
        },
        { status: 400 }
      );
    }

    // 查找订单
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '订单不存在',
            code: 'ORDER_NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    // 如果订单已处理，直接返回成功（幂等性）
    if (order.status === 'paid' || order.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: '订单已处理',
        data: {
          orderId: order.id,
          status: order.status,
        },
      });
    }

    // 使用事务处理支付回调
    const result = await prisma.$transaction(async (tx) => {
      // 更新订单状态
      const updatedOrder = await tx.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: paymentStatus === 'success' ? 'paid' : 'failed',
          paidAt: paymentStatus === 'success' ? new Date(paidAt || new Date()) : null,
          transactionId: transactionId || null,
          metadata: {
            ...(order.metadata as object || {}),
            paymentCallback: body,
          },
        },
      });

      // 如果支付成功，更新订阅状态
      if (paymentStatus === 'success' && order.subscriptionId) {
        const subscription = order.subscription;
        
        if (subscription) {
          // 计算新的结束日期
          const currentEndDate = subscription.endDate;
          const now = new Date();
          
          // 如果订阅已过期，从今天开始；否则从原结束日期续期
          const startDate = currentEndDate > now ? currentEndDate : now;
          const endDate = new Date(startDate);
          
          // 根据订阅类型延长周期
          if (subscription.type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
          } else {
            endDate.setMonth(endDate.getMonth() + 1);
          }

          // 更新订阅
          const updatedSubscription = await tx.subscription.update({
            where: {
              id: subscription.id,
            },
            data: {
              status: 'active',
              startDate: startDate,
              endDate: endDate,
              autoRenew: true, // 续费后自动开启自动续费
              price: subscription.price, // 保持原价格
            },
          });

          return { order: updatedOrder, subscription: updatedSubscription };
        }
      }

      return { order: updatedOrder, subscription: null };
    });

    return NextResponse.json({
      success: true,
      message: paymentStatus === 'success' 
        ? '支付成功，订阅已续费' 
        : '支付失败',
      data: {
        order: {
          id: result.order.id,
          status: result.order.status,
          paidAt: result.order.paidAt,
        },
        subscription: result.subscription ? {
          id: result.subscription.id,
          status: result.subscription.status,
          endDate: result.subscription.endDate,
        } : null,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
