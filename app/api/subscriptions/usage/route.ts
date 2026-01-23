import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/subscriptions/usage
 * 获取额度使用情况
 * 需要认证，仅限客户角色
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await requireClient(request);

    // 获取当前订阅
    const subscription = await prisma.subscription.findFirst({
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

    if (!subscription) {
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

    // 计算当前周期的开始时间（订阅开始日期或本月1日，取较晚的）
    const subscriptionStart = subscription.startDate;
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1);
    currentMonthStart.setHours(0, 0, 0, 0);
    
    const periodStart = subscriptionStart > currentMonthStart 
      ? subscriptionStart 
      : currentMonthStart;

    // 统计项目使用情况
    const projects = await prisma.project.findMany({
      where: {
        userId,
        createdAt: {
          gte: periodStart,
        },
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 统计存储使用情况（假设有文件表）
    // const files = await prisma.file.findMany({
    //   where: {
    //     userId,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     size: true,
    //     uploadedAt: true,
    //   },
    // });
    
    // const totalStorage = files.reduce((sum, file) => sum + (file.size || 0), 0);

    // 统计团队成员（假设有团队表）
    // const teamMembers = await prisma.teamMember.count({
    //   where: {
    //     userId,
    //   },
    // });

    // 计算使用情况
    const usage = {
      projects: {
        used: projects.length,
        total: subscription.plan.maxProjects,
        remaining: Math.max(0, subscription.plan.maxProjects - projects.length),
        percentage: subscription.plan.maxProjects > 0
          ? Math.round((projects.length / subscription.plan.maxProjects) * 100)
          : 0,
        list: projects,
      },
      storage: {
        used: 0, // TODO: 从文件表计算
        total: subscription.plan.maxStorage,
        remaining: subscription.plan.maxStorage,
        percentage: 0,
        unit: 'GB',
      },
      teamMembers: {
        used: 0, // TODO: 从团队表计算
        total: subscription.plan.maxTeamMembers,
        remaining: subscription.plan.maxTeamMembers,
        percentage: 0,
      },
    };

    // 计算周期信息
    const now = new Date();
    const periodEnd = subscription.endDate;
    const periodDays = Math.ceil(
      (periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingDays = Math.ceil(
      (periodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          id: subscription.id,
          plan: subscription.plan,
          periodStart,
          periodEnd,
          periodDays,
          remainingDays,
        },
        usage,
        summary: {
          totalQuota: {
            projects: subscription.plan.maxProjects,
            storage: subscription.plan.maxStorage,
            teamMembers: subscription.plan.maxTeamMembers,
          },
          totalUsed: {
            projects: projects.length,
            storage: 0,
            teamMembers: 0,
          },
          totalRemaining: {
            projects: usage.projects.remaining,
            storage: usage.storage.remaining,
            teamMembers: usage.teamMembers.remaining,
          },
        },
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
