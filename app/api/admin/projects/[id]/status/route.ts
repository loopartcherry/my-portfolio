import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

const UpdateProjectStatusSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED']),
  completionRate: z.number().min(0).max(100).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/projects/[id]/status
 * 更新项目状态
 * 仅 Admin
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id: projectId } = await context.params;
    const body = await request.json();
    const v = UpdateProjectStatusSchema.parse(body);

    // 查找项目
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    // 更新项目状态
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: v.status,
        completionRate: v.completionRate ?? project.completionRate,
        // 如果状态变为 COMPLETED，设置完成时间
        ...(v.status === 'COMPLETED' && !project.reviewedAt
          ? { reviewedAt: new Date() }
          : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        status: updated.status,
        completionRate: updated.completionRate,
      },
      message: '项目状态已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
