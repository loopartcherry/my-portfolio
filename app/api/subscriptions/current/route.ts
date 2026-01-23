import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/subscriptions/current
 * 获取当前用户的订阅信息
 * 需要认证，仅限客户角色
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 查询用户当前活跃的订阅
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['active', 'trialing'], // 活跃或试用中的订阅
        },
      },
      include: {
        plan: {
          select: {
            id: true,
            name: true,
            description: true,
            features: true,
            maxProjects: true,
            maxStorage: true,
            maxTeamMembers: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 获取最新的订阅
      },
    });

    if (!subscription) {
      return NextResponse.json({
        success: true,
        data: null,
        message: '当前没有活跃的订阅',
      });
    }

    // 计算额度使用情况
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // 统计本月已创建的项目数
    const projectsCount = await prisma.project.count({
      where: {
        userId,
        createdAt: {
          gte: currentMonth,
        },
      },
    });

    // 统计已使用的存储空间（假设有文件表）
    // const storageUsed = await prisma.file.aggregate({
    //   where: {
    //     userId,
    //   },
    //   _sum: {
    //     size: true,
    //   },
    // });

    // 计算剩余额度
    const quota = {
      projects: {
        used: projectsCount,
        total: subscription.plan.maxProjects,
        remaining: Math.max(0, subscription.plan.maxProjects - projectsCount),
      },
      storage: {
        used: 0, // TODO: 从文件表计算
        total: subscription.plan.maxStorage,
        remaining: subscription.plan.maxStorage,
      },
      teamMembers: {
        used: 0, // TODO: 从团队表计算
        total: subscription.plan.maxTeamMembers,
        remaining: subscription.plan.maxTeamMembers,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          type: subscription.type,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          autoRenew: subscription.autoRenew,
          createdAt: subscription.createdAt,
          updatedAt: subscription.updatedAt,
        },
        plan: subscription.plan,
        quota,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
