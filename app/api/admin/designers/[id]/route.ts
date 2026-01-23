import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateDesignerUpdate } from '@/lib/api/designer-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/designers/[id]
 * 获取单个设计师详情（含分配项目、工作历史）
 * 仅 Admin
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const designer = await prisma.designer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!designer) {
      throw new ApiError(404, '设计师不存在', 'DESIGNER_NOT_FOUND');
    }

    const assignedProjects = await prisma.project.findMany({
      where: { assignedToUserId: designer.userId },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    const assignmentHistory = await prisma.projectAssignment.findMany({
      where: {
        OR: [
          { designerId: designer.userId },
          { newDesignerId: designer.userId },
        ],
      },
      include: {
        project: { select: { id: true, name: true, status: true } },
        designer: { select: { id: true, name: true, email: true } },
        newDesigner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { assignedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: designer.id,
        userId: designer.userId,
        email: designer.user?.email,
        name: designer.user?.name,
        specialties: designer.specialties,
        hourlyRate: designer.hourlyRate,
        maxCapacity: designer.maxCapacity,
        currentLoad: designer.currentLoad,
        rating: designer.rating,
        totalProjects: designer.totalProjects,
        averageCompletionTime: designer.averageCompletionTime,
        status: designer.status,
        leaveFrom: designer.leaveFrom,
        leaveTo: designer.leaveTo,
        createdAt: designer.createdAt,
        updatedAt: designer.updatedAt,
        assignedProjects: assignedProjects.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          assignedAt: p.assignedAt,
          estimatedHours: p.estimatedHours,
          actualHours: p.actualHours,
          completionRate: p.completionRate,
          client: p.user,
        })),
        assignmentHistory: assignmentHistory.map((a) => ({
          id: a.id,
          projectId: a.projectId,
          projectName: a.project?.name,
          previousDesignerId: a.designerId,
          previousDesigner: a.designer
            ? { id: a.designer.id, name: a.designer.name, email: a.designer.email }
            : null,
          newDesignerId: a.newDesignerId,
          newDesigner: a.newDesigner
            ? { id: a.newDesigner.id, name: a.newDesigner.name, email: a.newDesigner.email }
            : null,
          reason: a.reason,
          assignedAt: a.assignedAt,
          reassignedAt: a.reassignedAt,
          status: a.status,
        })),
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/admin/designers/[id]
 * 更新设计师信息
 * 仅 Admin
 * 请求体：specialties?, hourlyRate?, maxCapacity?, status?
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateDesignerUpdate(body);

    const designer = await prisma.designer.findUnique({ where: { id } });
    if (!designer) {
      throw new ApiError(404, '设计师不存在', 'DESIGNER_NOT_FOUND');
    }

    const updated = await prisma.designer.update({
      where: { id },
      data: {
        ...(v.specialties !== undefined && { specialties: v.specialties }),
        ...(v.hourlyRate !== undefined && { hourlyRate: v.hourlyRate }),
        ...(v.maxCapacity !== undefined && { maxCapacity: v.maxCapacity }),
        ...(v.status !== undefined && { status: v.status }),
      },
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        userId: updated.userId,
        email: updated.user?.email,
        name: updated.user?.name,
        specialties: updated.specialties,
        hourlyRate: updated.hourlyRate,
        maxCapacity: updated.maxCapacity,
        currentLoad: updated.currentLoad,
        rating: updated.rating,
        totalProjects: updated.totalProjects,
        averageCompletionTime: updated.averageCompletionTime,
        status: updated.status,
        leaveFrom: updated.leaveFrom,
        leaveTo: updated.leaveTo,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
      message: '设计师信息已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
