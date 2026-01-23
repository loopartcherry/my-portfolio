import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { validateRequest, SubscribeRequestSchema } from '@/lib/api/validation';
import type { PrismaTransactionClient } from '@/lib/types/prisma';

/**
 * POST /api/subscriptions/subscribe
 * 订阅套餐
 * 需要认证，仅限客户角色
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 验证请求体
    const body = await request.json();
    const { planId, type } = validateRequest(SubscribeRequestSchema, body);

    // 检查套餐是否存在且活跃
    const plan = await prisma.subscriptionPlan.findFirst({
      where: {
        id: planId,
        isActive: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '套餐不存在或已停用',
            code: 'PLAN_NOT_FOUND',
          },
        },
        { status: 404 }
      );
    }

    // 检查用户是否已有活跃订阅
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing'],
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '您已有活跃的订阅，请先取消或升级现有订阅',
            code: 'ALREADY_SUBSCRIBED',
          },
        },
        { status: 422 }
      );
    }

    // 计算价格和周期
    const price = type === 'yearly' ? plan.yearlyPrice : plan.price;
    
    // 验证价格是否存在
    if (price === null || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: type === 'yearly' 
              ? '该套餐未设置年付价格' 
              : '该套餐未设置月付价格',
            code: 'PRICE_NOT_SET',
          },
        },
        { status: 422 }
      );
    }
    
    // 此时 price 已确保不为 null，使用类型断言
    const subscriptionPrice: number = price;
    
    const startDate = new Date();
    const endDate = new Date();
    
    if (type === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // 使用事务创建订阅和订单
    const result = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      // 创建订阅记录
      const subscription = await tx.subscription.create({
        data: {
          userId,
          planId,
          type,
          status: 'pending', // 待支付
          startDate,
          endDate,
          autoRenew: true,
          price: subscriptionPrice,
        },
        include: {
          plan: true,
        },
      });

      // 创建订单记录
      const order = await tx.order.create({
        data: {
          userId,
          type: 'subscription',
          amount: subscriptionPrice,
          status: 'pending',
          subscriptionId: subscription.id,
          metadata: {
            planId,
            planName: plan.name,
            subscriptionType: type,
          },
        },
      });

      return { subscription, order };
    });

    // 生成支付链接（这里需要集成支付网关，如支付宝、微信支付等）
    // TODO: 集成实际的支付网关
    const paymentLink = `/checkout?orderId=${result.order.id}&type=subscription`;

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: result.subscription.id,
          status: result.subscription.status,
          type: result.subscription.type,
          plan: result.subscription.plan,
          startDate: result.subscription.startDate,
          endDate: result.subscription.endDate,
        },
        order: {
          id: result.order.id,
          amount: result.order.amount,
          status: result.order.status,
        },
        paymentLink,
      },
      message: '订阅创建成功，请完成支付',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
