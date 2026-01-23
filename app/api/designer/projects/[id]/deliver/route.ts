import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateDeliverProject } from '@/lib/api/project-validation';
import { validateStatusTransition } from '@/lib/services/project-status';
import { getSessionFromRequest } from '@/lib/session';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/designer/projects/[id]/deliver
 * 设计师提交交付物
 * 仅限设计师，只能提交分配给自己的项目
 * 状态流转：IN_PROGRESS 或 ASSIGNED → REVIEW
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = getSessionFromRequest(request);
    if (!session?.userId) {
      throw new ApiError(401, '未登录', 'UNAUTHORIZED');
    }

    // 验证用户是设计师
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, role: true },
    });

    if (!user || user.role !== 'designer') {
      throw new ApiError(403, '仅限设计师访问', 'FORBIDDEN');
    }

    const projectId = await context.params.then((p) => p.id);
    const body = await request.json();
    const v = validateDeliverProject(body);

    // 查找项目
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    // 验证项目是否分配给当前设计师
    if (project.assignedToUserId !== session.userId) {
      throw new ApiError(403, '您无权操作此项目，该项目未分配给您', 'FORBIDDEN');
    }

    // 验证状态转换
    const currentStatus = project.status as any;
    const statusValidation = validateStatusTransition(currentStatus, 'REVIEW');
    
    if (!statusValidation.valid) {
      throw new ApiError(422, statusValidation.error || '状态转换无效', 'INVALID_STATUS_TRANSITION');
    }

    // 允许从 ASSIGNED 或 IN_PROGRESS 转为 REVIEW
    if (currentStatus !== 'ASSIGNED' && currentStatus !== 'IN_PROGRESS') {
      throw new ApiError(
        422,
        `项目状态为 "${currentStatus}"，只有已分配（ASSIGNED）或进行中（IN_PROGRESS）的项目才能提交交付`,
        'INVALID_PROJECT_STATUS'
      );
    }

    // 更新项目状态和交付信息
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'REVIEW',
        deliveryLink: v.deliveryLink,
        deliveredAt: new Date(),
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

    // TODO: 发送通知给客户，告知项目已提交交付

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProject.id,
        name: updatedProject.name,
        status: updatedProject.status,
        deliveryLink: updatedProject.deliveryLink,
        deliveredAt: updatedProject.deliveredAt,
        client: updatedProject.user,
      },
      message: '交付物已提交，等待客户验收',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
