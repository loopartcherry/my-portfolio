import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateAssignProject } from '@/lib/api/designer-validation';
import { validateStatusTransition } from '@/lib/services/project-status';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/admin/designers/[id]/assign-project
 * 给设计师分配项目
 * 仅 Admin
 * 校验：负载已满 422、休假 422、项目不存在 404、无权限 403
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const adminId = await requireAdmin(request);
    const designerId = await context.params.then((p) => p.id);
    const body = await request.json();
    const v = validateAssignProject(body);

    const designer = await prisma.designer.findUnique({
      where: { id: designerId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!designer) {
      throw new ApiError(404, '设计师不存在', 'DESIGNER_NOT_FOUND');
    }

    if (designer.currentLoad >= designer.maxCapacity) {
      throw new ApiError(
        422,
        '设计师当前负载已满，无法分配新项目',
        'DESIGNER_AT_CAPACITY'
      );
    }

    const now = new Date();
    if (designer.status === 'on_leave' && designer.leaveFrom && designer.leaveTo) {
      if (now >= designer.leaveFrom && now <= designer.leaveTo) {
        throw new ApiError(
          422,
          '设计师处于休假期间，无法分配项目',
          'DESIGNER_ON_LEAVE'
        );
      }
    }

    const project = await prisma.project.findUnique({
      where: { id: v.projectId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }
    
    // 检查项目状态，必须是 PENDING 才能分配
    if (project.status !== 'PENDING') {
      throw new ApiError(
        422,
        `项目状态为 "${project.status}"，只有待处理（PENDING）的项目才能分配`,
        'INVALID_PROJECT_STATUS'
      );
    }
    
    if (project.assignedToUserId) {
      throw new ApiError(
        422,
        '项目已分配，请使用改派接口 /api/admin/designers/[id]/reassign-project',
        'PROJECT_ALREADY_ASSIGNED'
      );
    }

    // 检查技能匹配（如果项目有技能要求）
    // 注意：当前 Project 模型中没有 requiredSkills 字段
    // 如果未来添加，可以在这里检查设计师的 specialties 是否包含项目所需技能
    // const projectSkills = project.requiredSkills as string[] | null;
    // if (projectSkills && projectSkills.length > 0) {
    //   const designerSkills = (designer.specialties as string[] | null) || [];
    //   const hasMatchingSkill = projectSkills.some(skill => 
    //     designerSkills.some(ds => ds.toLowerCase().includes(skill.toLowerCase()))
    //   );
    //   if (!hasMatchingSkill) {
    //     throw new ApiError(
    //       422,
    //       '设计师技能不匹配项目要求',
    //       'SKILL_MISMATCH'
    //     );
    //   }
    // }

    const result = await prisma.$transaction(async (tx) => {
      await tx.projectAssignment.create({
        data: {
          projectId: v.projectId,
          designerId: project.assignedToUserId,
          newDesignerId: designer.userId,
          reason: null,
          status: 'active',
        },
      });

      await tx.project.update({
        where: { id: v.projectId },
        data: {
          assignedToUserId: designer.userId,
          assignedAt: now,
          assignedById: adminId,
          estimatedHours: v.estimatedHours ?? project.estimatedHours ?? null,
          status: 'ASSIGNED', // 更新状态为已分配
        },
      });

      const updatedDesigner = await tx.designer.update({
        where: { id: designerId },
        data: { currentLoad: { increment: 1 } },
        include: { user: { select: { id: true, email: true, name: true } } },
      });

      return { designer: updatedDesigner, project };
    });

    return NextResponse.json({
      success: true,
      data: {
        assignment: {
          projectId: v.projectId,
          designerId: result.designer.id,
          userId: result.designer.userId,
          estimatedHours: v.estimatedHours ?? result.project.estimatedHours,
          assignedAt: now,
        },
        designer: {
          id: result.designer.id,
          currentLoad: result.designer.currentLoad,
          maxCapacity: result.designer.maxCapacity,
          email: result.designer.user?.email,
          name: result.designer.user?.name,
        },
      },
      message: '项目已成功分配',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
