import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/designers/workload
 * 获取所有设计师工作负载统计
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const designers = await prisma.designer.findMany({
      where: {},
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { currentLoad: 'desc' },
    });

    const workload = designers.map((d) => {
      const load = d.currentLoad;
      const cap = d.maxCapacity;
      const avgHours = d.averageCompletionTime ?? 0;
      const estimatedHours = load > 0 && avgHours > 0 ? load * avgHours : 0;
      return {
        designerId: d.id,
        userId: d.userId,
        email: d.user.email,
        name: d.user.name,
        currentLoad: load,
        maxCapacity: cap,
        utilization: cap > 0 ? Math.round((load / cap) * 100) : 0,
        averageCompletionTimeHours: avgHours,
        estimatedTotalHoursToComplete: Math.round(estimatedHours * 100) / 100,
        status: d.status,
        leaveFrom: d.leaveFrom,
        leaveTo: d.leaveTo,
      };
    });

    return NextResponse.json({
      success: true,
      data: workload,
      count: workload.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
