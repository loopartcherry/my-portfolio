import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateDesignerProjectsQuery } from '@/lib/api/designer-validation';

type RouteContext = { params: Promise<{ id: string }> };

function parseQuery(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  return validateDesignerProjectsQuery({
    status: sp.get('status') || undefined,
    sortBy: sp.get('sortBy') || undefined,
  });
}

/**
 * GET /api/admin/designers/[id]/projects
 * 获取设计师的项目列表
 * 仅 Admin
 * 查询参数：status?, sortBy (createdAt | assignedAt | completionRate)
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const designerId = await context.params.then((p) => p.id);
    const q = parseQuery(request);

    const designer = await prisma.designer.findUnique({
      where: { id: designerId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!designer) {
      throw new ApiError(404, '设计师不存在', 'DESIGNER_NOT_FOUND');
    }

    const orderBy =
      q.sortBy === 'assignedAt'
        ? { assignedAt: 'desc' as const }
        : q.sortBy === 'completionRate'
          ? { completionRate: 'desc' as const }
          : { createdAt: 'desc' as const };

    const projects = await prisma.project.findMany({
      where: {
        assignedToUserId: designer.userId,
        ...(q.status && q.status.trim() && { status: q.status.trim() }),
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy,
    });

    const list = projects.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      assignedAt: p.assignedAt,
      estimatedHours: p.estimatedHours,
      actualHours: p.actualHours,
      completionRate: p.completionRate,
      client: p.user,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: list,
      count: list.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
