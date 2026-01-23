import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { validateRequest, UpgradeRequestSchema } from '@/lib/api/validation';

/**
 * POST /api/subscriptions/upgrade
 * 升级套餐
 * 需要认证，仅限客户角色
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 验证请求体
    const body = await request.json();
    const { planId } = validateRequest(UpgradeRequestSchema, body);

    // 检查新套餐是否存在且活跃
    const newPlan = await prisma.subscriptionPlan.findFirst({
      where: {
        id: planId,
        isActive: true,
      },
    });

    if (!newPlan) {
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

    // 获取用户当前订阅
    const currentSubscription = await prisma.subscription.findFirst({
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

    if (!currentSubscription) {
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

    // 检查是否已经是该套餐
    if (currentSubscription.planId === planId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: '您已经是该套餐的用户',
            code: 'SAME_PLAN',
          },
        },
        { status: 422 }
      );
    }

    // 计算剩余时间和需补差价
    const now = new Date();
    const remainingDays = Math.ceil(
      (currentSubscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalDays = Math.ceil(
      (currentSubscription.endDate.getTime() - currentSubscription.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // 计算已使用的价值（按比例）
    const usedValue = (currentSubscription.price * (totalDays - remainingDays)) / totalDays;
    const remainingValue = currentSubscription.price - usedValue;
    
    // 新套餐价格（根据当前订阅类型）
    const newPrice = currentSubscription.type === 'yearly' 
      ? newPlan.yearlyPrice 
      : newPlan.price;
    
    // 验证新套餐价格是否存在
    if (newPrice === null || newPrice === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: currentSubscription.type === 'yearly' 
              ? '新套餐未设置年付价格' 
              : '新套餐未设置月付价格',
            code: 'PRICE_NOT_SET',
          },
        },
        { status: 422 }
      );
    }
    
    // 此时 newPrice 已确保不为 null
    const validNewPrice: number = newPrice;
    
    // 计算需补差价
    const upgradeAmount = Math.max(0, validNewPrice - remainingValue);

    // 使用事务处理升级
    const result = await prisma.$transaction(async (tx) => {
      // 如果新套餐价格更高，需要创建订单
      let order = null;
      if (upgradeAmount > 0) {
        order = await tx.order.create({
          data: {
            userId,
            type: 'upgrade',
            amount: upgradeAmount,
            status: 'pending',
            subscriptionId: currentSubscription.id,
            metadata: {
              oldPlanId: currentSubscription.planId,
              newPlanId: planId,
              oldPlanName: currentSubscription.plan.name,
              newPlanName: newPlan.name,
              remainingDays,
              upgradeAmount,
            },
          },
        });
      }

      // 更新订阅信息
      const updatedSubscription = await tx.subscription.update({
        where: {
          id: currentSubscription.id,
        },
        data: {
          planId,
          price: validNewPrice,
          // 如果立即生效，更新开始时间；否则保持原周期
          // 这里选择立即生效
          startDate: now,
          endDate: new Date(now.getTime() + (remainingDays * 24 * 60 * 60 * 1000)),
          status: upgradeAmount > 0 ? 'pending' : 'active',
        },
        include: {
          plan: true,
        },
      });

      return { subscription: updatedSubscription, order };
    });

    // 生成支付链接（如果需要支付）
    const paymentLink = result.order 
      ? `/checkout?orderId=${result.order.id}&type=upgrade`
      : null;

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: result.subscription.id,
          status: result.subscription.status,
          plan: result.subscription.plan,
          startDate: result.subscription.startDate,
          endDate: result.subscription.endDate,
        },
        upgradeInfo: {
          oldPlan: currentSubscription.plan,
          newPlan: newPlan,
          remainingDays,
          upgradeAmount,
          needsPayment: upgradeAmount > 0,
        },
        order: result.order ? {
          id: result.order.id,
          amount: result.order.amount,
          status: result.order.status,
        } : null,
        paymentLink,
      },
      message: upgradeAmount > 0 
        ? '升级成功，请完成支付以激活新套餐'
        : '升级成功，新套餐已立即生效',
    });
  } catch (error) {
    return handleApiError(error);
  }
}
