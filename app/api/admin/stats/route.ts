import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/stats
 * 获取管理员控制台统计数据
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 今日订单总额（已支付）
    const todayOrders = await prisma.order.findMany({
      where: {
        status: 'paid',
        paidAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        amount: true,
      },
    });
    const todayOrderAmount = todayOrders.reduce((sum, order) => sum + order.amount, 0);

    // 新增用户数（今日）
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // 进行中的项目数
    const activeProjectsCount = await prisma.project.count({
      where: {
        status: {
          in: ['ASSIGNED', 'IN_PROGRESS', 'REVIEW'],
        },
      },
    });

    // 总用户数
    const totalUsers = await prisma.user.count();

    // 活跃用户数（最近30天有活动）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            projects: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
          {
            orders: {
              some: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
        ],
      },
    });

    // 总项目数
    const totalProjects = await prisma.project.count();

    // 总订单数
    const totalOrders = await prisma.order.count();

    // 待处理订单数
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'pending',
      },
    });

    // 本月营收（已支付订单）
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    const lastMonthStart = new Date(thisMonthStart);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    const thisMonthOrders = await prisma.order.findMany({
      where: {
        status: 'paid',
        paidAt: {
          gte: thisMonthStart,
        },
      },
      select: {
        amount: true,
      },
    });
    const monthlyRevenue = thisMonthOrders.reduce((sum, order) => sum + order.amount, 0);

    const lastMonthOrders = await prisma.order.findMany({
      where: {
        status: 'paid',
        paidAt: {
          gte: lastMonthStart,
          lt: thisMonthStart,
        },
      },
      select: {
        amount: true,
      },
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.amount, 0);

    const revenueGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        todayOrderAmount,
        newUsersToday,
        activeProjectsCount,
        totalUsers,
        activeUsers,
        totalProjects,
        totalOrders,
        pendingOrders,
        monthlyRevenue,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
