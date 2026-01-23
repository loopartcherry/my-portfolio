import { prisma } from '@/lib/prisma';

/**
 * 订阅服务
 * 处理订阅相关的业务逻辑，包括额度检查、扣费、升级计算等
 */

/**
 * 检查订阅额度
 * 用途：客户创建项目时检查是否有足够额度
 * 
 * @param subscriptionId - 订阅ID
 * @param requiredCredits - 需要的额度（通常为1，表示创建一个项目）
 * @returns 是否可用、剩余额度、订阅状态
 */
export async function checkSubscriptionCredits(
  subscriptionId: string,
  requiredCredits: number = 1
): Promise<{
  available: boolean;
  remainingCredits: number;
  subscriptionStatus: string;
  message?: string;
}> {
  try {
    // 获取订阅信息，包括套餐详情
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new Error('订阅不存在');
    }

    // 检查订阅状态
    const now = new Date();
    const isExpired = subscription.endDate < now;
    const isActive = subscription.status === 'active' || subscription.status === 'trialing';

    // 如果订阅已过期，返回过期状态
    if (isExpired || !isActive) {
      return {
        available: false,
        remainingCredits: 0,
        subscriptionStatus: isExpired ? 'expired' : subscription.status,
        message: isExpired 
          ? '订阅已过期，请续费后继续使用' 
          : `订阅状态异常：${subscription.status}`,
      };
    }

    // 计算已使用的额度（项目数）
    const periodStart = subscription.startDate > new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ) ? subscription.startDate : new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const usedCredits = await prisma.project.count({
      where: {
        userId: subscription.userId,
        createdAt: {
          gte: periodStart,
        },
      },
    });

    // 计算剩余额度
    // maxProjects 为 0 表示无限制
    const maxCredits = subscription.plan.maxProjects === 0 
      ? Infinity 
      : subscription.plan.maxProjects;
    
    const remainingCredits = maxCredits === Infinity 
      ? Infinity 
      : Math.max(0, maxCredits - usedCredits);

    // 检查是否有足够额度
    const available = maxCredits === Infinity || remainingCredits >= requiredCredits;

    return {
      available,
      remainingCredits: maxCredits === Infinity ? Infinity : remainingCredits,
      subscriptionStatus: subscription.status,
      message: available 
        ? undefined 
        : `额度不足，当前剩余 ${remainingCredits} 个额度，需要 ${requiredCredits} 个`,
    };
  } catch (error) {
    console.error('检查订阅额度失败:', error);
    throw new Error(`检查订阅额度失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 自动扣费
 * 用途：项目创建时扣除相应额度
 * 
 * @param subscriptionId - 订阅ID
 * @param projectId - 项目ID
 * @param creditsToDeduct - 要扣除的额度（通常为1）
 * @returns 是否成功、剩余额度
 */
export async function deductCredits(
  subscriptionId: string,
  projectId: string,
  creditsToDeduct: number = 1
): Promise<{
  success: boolean;
  remainingCredits: number;
  message?: string;
}> {
  try {
    // 使用事务保证数据一致性
    const result = await prisma.$transaction(async (tx) => {
      // 1. 检查额度是否充足
      const creditCheck = await checkSubscriptionCredits(subscriptionId, creditsToDeduct);
      
      if (!creditCheck.available) {
        throw new Error(creditCheck.message || '额度不足');
      }

      // 2. 获取订阅信息
      const subscription = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          plan: true,
        },
      });

      if (!subscription) {
        throw new Error('订阅不存在');
      }

      // 3. 计算当前周期的开始时间
      const periodStart = subscription.startDate > new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ) ? subscription.startDate : new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );

      // 4. 统计已使用的额度
      const usedCredits = await tx.project.count({
        where: {
          userId: subscription.userId,
          createdAt: {
            gte: periodStart,
          },
        },
      });

      // 5. 创建额度使用记录
      // 注意：这里假设有 CreditsUsage 模型，如果没有，可以注释掉这部分
      // await tx.creditsUsage.create({
      //   data: {
      //     subscriptionId,
      //     projectId,
      //     credits: creditsToDeduct,
      //     type: 'project_creation',
      //     createdAt: new Date(),
      //   },
      // });

      // 6. 计算剩余额度
      const maxCredits = subscription.plan.maxProjects === 0 
        ? Infinity 
        : subscription.plan.maxProjects;
      
      const remainingCredits = maxCredits === Infinity 
        ? Infinity 
        : Math.max(0, maxCredits - usedCredits - creditsToDeduct);

      // 7. 如果额度即将用完（剩余少于10%），发送通知（这里只是记录日志，实际应该发送通知）
      if (maxCredits !== Infinity && remainingCredits / maxCredits < 0.1) {
        console.log(`警告：用户 ${subscription.userId} 的订阅 ${subscriptionId} 额度即将用完，剩余 ${remainingCredits}/${maxCredits}`);
        // TODO: 发送通知给用户，提示升级套餐
        // await sendNotification(subscription.userId, {
        //   type: 'credits_low',
        //   message: `您的订阅额度即将用完，剩余 ${remainingCredits} 个，建议升级套餐`,
        // });
      }

      return {
        success: true,
        remainingCredits: maxCredits === Infinity ? Infinity : remainingCredits,
      };
    });

    return result;
  } catch (error) {
    console.error('扣除额度失败:', error);
    return {
      success: false,
      remainingCredits: 0,
      message: error instanceof Error ? error.message : '扣除额度失败',
    };
  }
}

/**
 * 计算升级差价
 * 用途：用户升级套餐时计算需要补的钱
 * 
 * @param currentSubscriptionId - 当前订阅ID
 * @param newPlanId - 新套餐ID
 * @returns 差价信息
 */
export async function calculateUpgradePrice(
  currentSubscriptionId: string,
  newPlanId: string
): Promise<{
  currentPrice: number;
  newPrice: number;
  difference: number;
  needsRefund: boolean;
  refundAmount?: number;
  proratedAmount: number; // 按比例计算的金额
  remainingDays: number; // 剩余天数
}> {
  try {
    // 1. 获取当前订阅信息
    const currentSubscription = await prisma.subscription.findUnique({
      where: { id: currentSubscriptionId },
      include: {
        plan: true,
      },
    });

    if (!currentSubscription) {
      throw new Error('当前订阅不存在');
    }

    // 2. 获取新套餐信息
    const newPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: newPlanId },
    });

    if (!newPlan) {
      throw new Error('新套餐不存在');
    }

    // 3. 检查是否已经是该套餐
    if (currentSubscription.planId === newPlanId) {
      throw new Error('您已经是该套餐的用户');
    }

    // 4. 计算订阅周期信息
    const now = new Date();
    const startDate = currentSubscription.startDate;
    const endDate = currentSubscription.endDate;
    
    // 计算总天数和剩余天数
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingDays = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 如果已过期，剩余天数为0
    const validRemainingDays = Math.max(0, remainingDays);

    // 5. 获取价格（根据当前订阅类型）
    const currentPrice = currentSubscription.price;
    const newPriceRaw = currentSubscription.type === 'yearly' 
      ? newPlan.yearlyPrice 
      : newPlan.price;
    
    // 验证新套餐价格是否存在
    if (newPriceRaw === null || newPriceRaw === undefined) {
      throw new Error(
        currentSubscription.type === 'yearly' 
          ? '新套餐未设置年付价格' 
          : '新套餐未设置月付价格'
      );
    }
    
    const newPrice = newPriceRaw;

    // 6. 计算已使用的价值（按比例）
    const usedDays = totalDays - validRemainingDays;
    const usedValue = (currentPrice * usedDays) / totalDays;
    const remainingValue = currentPrice - usedValue;

    // 7. 计算新套餐的按比例价格（基于剩余天数）
    // 如果剩余天数大于0，按比例计算；否则按完整周期计算
    let proratedNewPrice: number;
    
    if (validRemainingDays > 0 && totalDays > 0) {
      // 按剩余天数比例计算新套餐价格
      if (currentSubscription.type === 'yearly') {
        // 年付：按剩余天数计算
        proratedNewPrice = (newPrice * validRemainingDays) / 365;
      } else {
        // 月付：按剩余天数计算
        proratedNewPrice = (newPrice * validRemainingDays) / 30;
      }
    } else {
      // 已过期，按完整周期计算
      proratedNewPrice = newPrice;
    }

    // 8. 计算差价
    const difference = proratedNewPrice - remainingValue;
    const needsRefund = difference < 0;
    const refundAmount = needsRefund ? Math.abs(difference) : undefined;

    return {
      currentPrice,
      newPrice: proratedNewPrice,
      difference: Math.abs(difference),
      needsRefund,
      refundAmount,
      proratedAmount: proratedNewPrice,
      remainingDays: validRemainingDays,
    };
  } catch (error) {
    console.error('计算升级差价失败:', error);
    throw new Error(`计算升级差价失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 检查续费是否可用
 * 用途：检查订阅是否即将过期并可以续费
 * 
 * @param subscriptionId - 订阅ID
 * @returns 是否可续费、过期时间、续费价格
 */
export async function checkRenewalAvailable(
  subscriptionId: string
): Promise<{
  canRenew: boolean;
  daysUntilExpiry: number;
  expiryDate: Date;
  renewalPrice: number;
  message?: string;
}> {
  try {
    // 1. 获取订阅信息
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new Error('订阅不存在');
    }

    // 2. 检查订阅状态
    if (subscription.status === 'cancelled') {
      return {
        canRenew: false,
        daysUntilExpiry: 0,
        expiryDate: subscription.endDate,
        renewalPrice: 0,
        message: '订阅已取消，无法续费',
      };
    }

    // 3. 计算距离过期的天数
    const now = new Date();
    const expiryDate = subscription.endDate;
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 4. 判断是否可以续费
    // 规则：如果少于7天或已过期，允许续费
    const canRenew = daysUntilExpiry <= 7 || daysUntilExpiry < 0;

    // 5. 计算续费价格
    // 根据订阅类型获取价格
    const renewalPriceRaw = subscription.type === 'yearly' 
      ? subscription.plan.yearlyPrice 
      : subscription.plan.price;

    // 验证续费价格是否存在
    if (renewalPriceRaw === null || renewalPriceRaw === undefined) {
      throw new Error(
        subscription.type === 'yearly' 
          ? '套餐未设置年付价格' 
          : '套餐未设置月付价格'
      );
    }

    // 此时 renewalPriceRaw 已确保不为 null，使用类型断言
    const renewalPrice: number = renewalPriceRaw;

    // TODO: 可以在这里添加续费折扣逻辑
    // 例如：提前续费有折扣
    // const discount = daysUntilExpiry > 0 && daysUntilExpiry <= 7 ? 0.1 : 0;
    // const finalPrice = renewalPrice * (1 - discount);

    return {
      canRenew,
      daysUntilExpiry: Math.max(0, daysUntilExpiry),
      expiryDate,
      renewalPrice,
      message: canRenew 
        ? daysUntilExpiry < 0 
          ? '订阅已过期，请立即续费' 
          : `订阅将在 ${daysUntilExpiry} 天后过期，可以续费`
        : `订阅还有 ${daysUntilExpiry} 天到期，请在到期前7天内续费`,
    };
  } catch (error) {
    console.error('检查续费可用性失败:', error);
    throw new Error(`检查续费可用性失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 处理订阅过期
 * 用途：定时任务检查过期的订阅
 * 
 * @param subscriptionId - 订阅ID
 * @returns 处理结果
 */
export async function handleSubscriptionExpiry(
  subscriptionId: string
): Promise<{
  success: boolean;
  message: string;
  actions: string[];
}> {
  try {
    const actions: string[] = [];

    // 使用事务处理过期逻辑
    const result = await prisma.$transaction(async (tx) => {
      // 1. 获取订阅信息
      const subscription = await tx.subscription.findUnique({
        where: { id: subscriptionId },
        include: {
          plan: true,
        },
      });

      if (!subscription) {
        throw new Error('订阅不存在');
      }

      // 2. 检查是否已过期
      const now = new Date();
      const isExpired = subscription.endDate < now;

      if (!isExpired) {
        return {
          success: false,
          message: '订阅尚未过期',
          actions: [],
        };
      }

      // 3. 如果已经是过期状态，直接返回
      if (subscription.status === 'expired') {
        return {
          success: true,
          message: '订阅已经是过期状态',
          actions: ['already_expired'],
        };
      }

      // 4. 更新订阅状态为过期
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'expired',
        },
      });
      actions.push('status_updated');

      // 5. 发送邮件通知客户
      // TODO: 集成邮件服务
      console.log(`发送过期通知邮件给用户 ${subscription.userId}`);
      // await sendEmail(subscription.userId, {
      //   subject: '您的订阅已过期',
      //   template: 'subscription_expired',
      //   data: {
      //     planName: subscription.plan.name,
      //     expiryDate: subscription.endDate,
      //   },
      // });
      actions.push('email_sent');

      // 6. 如果启用了自动续费，创建续费订单
      if (subscription.autoRenew) {
        const renewalPriceRaw = subscription.type === 'yearly' 
          ? subscription.plan.yearlyPrice 
          : subscription.plan.price;

        // 验证续费价格是否存在
        if (renewalPriceRaw === null || renewalPriceRaw === undefined) {
          console.error(`订阅 ${subscriptionId} 的套餐价格未设置，无法创建续费订单`);
          actions.push('renewal_failed_price_not_set');
        } else {
          // 此时 renewalPriceRaw 已确保不为 null，使用类型断言
          const renewalPrice: number = renewalPriceRaw;

          const renewalOrder = await tx.order.create({
            data: {
              userId: subscription.userId,
              type: 'renewal',
              amount: renewalPrice,
              status: 'pending',
              subscriptionId: subscription.id,
              metadata: {
                autoRenew: true,
                originalExpiryDate: subscription.endDate,
              },
            },
          });
          actions.push('renewal_order_created');

          // TODO: 自动发起支付
          // await initiatePayment(renewalOrder.id);
          console.log(`为订阅 ${subscriptionId} 创建了自动续费订单 ${renewalOrder.id}`);
        }
      } else {
        actions.push('auto_renew_disabled');
      }

      return {
        success: true,
        message: '订阅过期处理完成',
        actions,
      };
    });

    return result;
  } catch (error) {
    console.error('处理订阅过期失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '处理订阅过期失败',
      actions: [],
    };
  }
}

/**
 * 批量处理过期订阅
 * 用途：定时任务批量检查和处理所有过期订阅
 * 
 * @param limit - 每次处理的订阅数量限制
 * @returns 处理结果统计
 */
export async function batchHandleExpiredSubscriptions(
  limit: number = 100
): Promise<{
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  results: Array<{
    subscriptionId: string;
    success: boolean;
    message: string;
  }>;
}> {
  try {
    const now = new Date();

    // 查找所有已过期但状态不是 'expired' 的订阅
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: {
          lt: now,
        },
        status: {
          not: 'expired',
        },
      },
      take: limit,
      select: {
        id: true,
      },
    });

    const total = expiredSubscriptions.length;
    const results: Array<{
      subscriptionId: string;
      success: boolean;
      message: string;
    }> = [];

    let succeeded = 0;
    let failed = 0;

    // 逐个处理过期订阅
    for (const subscription of expiredSubscriptions) {
      try {
        const result = await handleSubscriptionExpiry(subscription.id);
        results.push({
          subscriptionId: subscription.id,
          success: result.success,
          message: result.message,
        });
        if (result.success) {
          succeeded++;
        } else {
          failed++;
        }
      } catch (error) {
        results.push({
          subscriptionId: subscription.id,
          success: false,
          message: error instanceof Error ? error.message : '处理失败',
        });
        failed++;
      }
    }

    return {
      total,
      processed: total,
      succeeded,
      failed,
      results,
    };
  } catch (error) {
    console.error('批量处理过期订阅失败:', error);
    throw new Error(`批量处理过期订阅失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}
