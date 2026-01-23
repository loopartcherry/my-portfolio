import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateReassignProject } from '@/lib/api/designer-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/designers/[id]/reassign-project
 * 重新分配项目（从当前设计师改派到新设计师）
 * 仅 Admin
 * 请求体：projectId, newDesignerId, reason?
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const currentDesignerId = await context.params.then((p) => p.id);
    const body = await request.json();
    const v = validateReassignProject(body);

    const currentDesigner = await prisma.designer.findUnique({
      where: { id: currentDesignerId },
      include: { user: { select: { id: true } } },
    });
    if (!currentDesigner) {
      throw new ApiError(404, '当前设计师不存在', 'DESIGNER_NOT_FOUND');
    }

    const newDesigner = await prisma.designer.findUnique({
      where: { id: v.newDesignerId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!newDesigner) {
      throw new ApiError(404, '新设计师不存在', 'NEW_DESIGNER_NOT_FOUND');
    }

    if (newDesigner.currentLoad >= newDesigner.maxCapacity) {
      throw new ApiError(
        422,
        '新设计师当前负载已满，无法接收改派',
        'DESIGNER_AT_CAPACITY'
      );
    }

    const now = new Date();
    if (newDesigner.status === 'on_leave' && newDesigner.leaveFrom && newDesigner.leaveTo) {
      if (now >= newDesigner.leaveFrom && now <= newDesigner.leaveTo) {
        throw new ApiError(
          422,
          '新设计师处于休假期间，无法接收改派',
          'DESIGNER_ON_LEAVE'
        );
      }
    }

    const project = await prisma.project.findUnique({
      where: { id: v.projectId },
    });
    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    if (project.assignedToUserId !== currentDesigner.userId) {
      throw new ApiError(
        422,
        '该项目未分配给当前设计师，无法从此设计师改派',
        'PROJECT_NOT_ASSIGNED_TO_DESIGNER'
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const lastAssignment = await tx.projectAssignment.findFirst({
        where: { projectId: v.projectId, newDesignerId: currentDesigner.userId, status: 'active' },
        orderBy: { assignedAt: 'desc' },
      });
      if (lastAssignment) {
        await tx.projectAssignment.update({
          where: { id: lastAssignment.id },
          data: { reassignedAt: now, status: 'completed' },
        });
      }

      await tx.projectAssignment.create({
        data: {
          projectId: v.projectId,
          designerId: currentDesigner.userId,
          newDesignerId: newDesigner.userId,
          reason: v.reason ?? null,
          status: 'active',
        },
      });

      await tx.project.update({
        where: { id: v.projectId },
        data: {
          assignedToUserId: newDesigner.userId,
          assignedAt: now,
        },
      });

      await tx.designer.update({
        where: { id: currentDesignerId },
        data: { currentLoad: { decrement: 1 } },
      });

      const updatedNew = await tx.designer.update({
        where: { id: v.newDesignerId },
        data: { currentLoad: { increment: 1 } },
        include: { user: { select: { id: true, email: true, name: true } } },
      });

      return { previousDesignerId: currentDesignerId, newDesigner: updatedNew, project };
    });

    return NextResponse.json({
      success: true,
      data: {
        reassignment: {
          projectId: v.projectId,
          previousDesignerId: result.previousDesignerId,
          newDesignerId: v.newDesignerId,
          reason: v.reason,
          reassignedAt: now,
        },
        newDesigner: {
          id: result.newDesigner.id,
          currentLoad: result.newDesigner.currentLoad,
          maxCapacity: result.newDesigner.maxCapacity,
          email: result.newDesigner.user?.email,
          name: result.newDesigner.user?.name,
        },
      },
      message: '项目已成功改派',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
