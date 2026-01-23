import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/subscriptions/plans
 * 获取所有可用的订阅套餐列表
 * 公开端点，无需认证
 */
export async function GET(request: NextRequest) {
  try {
    // 查询所有活跃的套餐
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc', // 按价格升序排列
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        yearlyPrice: true,
        features: true,
        maxProjects: true,
        maxStorage: true,
        maxTeamMembers: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: plans,
      count: plans.length,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
