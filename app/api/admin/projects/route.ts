import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/projects
 * 获取所有项目列表（管理员）
 * 仅限管理员
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const priority = searchParams.get('priority');

    const where: any = {};

    if (status && status !== 'all') {
      // 处理状态筛选
      if (status === 'in-progress') {
        where.status = { in: ['ASSIGNED', 'IN_PROGRESS', 'REVIEW'] };
      } else if (status === 'completed') {
        where.status = 'COMPLETED';
      } else if (status === 'paused') {
        where.status = 'CANCELLED';
      } else {
        where.status = status;
      }
    }

    if (priority) {
      where.priority = priority;
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
          assignedToUser: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: [
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
