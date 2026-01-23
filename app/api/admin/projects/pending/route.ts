import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/admin/projects/pending
 * 获取待处理项目列表（状态为 PENDING）
 * 仅限管理员
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const priority = searchParams.get('priority'); // 可选：按优先级筛选

    const where: Prisma.ProjectWhereInput = {
      status: 'PENDING',
    };

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
        },
        orderBy: [
          { priority: 'desc' }, // 优先级高的在前
          { createdAt: 'asc' }, // 创建时间早的在前
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
