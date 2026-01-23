import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireClient } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateStatusTransition } from '@/lib/services/project-status';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/projects/[id]/approve
 * 客户验收项目
 * 仅限项目所有者（客户）
 * 状态流转：REVIEW → COMPLETED
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const userId = await requireClient(request);
    const projectId = await context.params.then((p) => p.id);

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

    // 验证项目所有者
    if (project.userId !== userId) {
      throw new ApiError(403, '您无权操作此项目，您不是项目所有者', 'FORBIDDEN');
    }

    // 验证状态转换
    const currentStatus = project.status as any;
    const statusValidation = validateStatusTransition(currentStatus, 'COMPLETED');
    
    if (!statusValidation.valid) {
      throw new ApiError(422, statusValidation.error || '状态转换无效', 'INVALID_STATUS_TRANSITION');
    }

    // 必须是 REVIEW 状态才能验收
    if (currentStatus !== 'REVIEW') {
      throw new ApiError(
        422,
        `项目状态为 "${currentStatus}"，只有待验收（REVIEW）的项目才能验收`,
        'INVALID_PROJECT_STATUS'
      );
    }

    // 检查是否有交付物
    if (!project.deliveryLink) {
      throw new ApiError(422, '项目尚未提交交付物，无法验收', 'NO_DELIVERY');
    }

    // 使用事务更新项目状态和相关数据
    const result = await prisma.$transaction(async (tx) => {
      // 更新项目状态
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: {
          status: 'COMPLETED',
          reviewedAt: new Date(),
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

      // 如果项目已分配给设计师，更新设计师的统计数据
      if (project.assignedToUserId) {
        // 查找设计师档案
        const designer = await tx.designer.findUnique({
          where: { userId: project.assignedToUserId },
        });

        if (designer) {
          // 更新设计师的完成项目数和负载
          await tx.designer.update({
            where: { id: designer.id },
            data: {
              totalProjects: { increment: 1 },
              currentLoad: { decrement: 1 },
            },
          });

          // 计算平均完成时间（如果有实际工时）
          if (project.actualHours) {
            const currentAvgTime = designer.averageCompletionTime || 0;
            const totalProjects = designer.totalProjects + 1;
            const newAvgTime = (currentAvgTime * designer.totalProjects + project.actualHours) / totalProjects;
            
            await tx.designer.update({
              where: { id: designer.id },
              data: {
                averageCompletionTime: newAvgTime,
              },
            });
          }
        }
      }

      return updatedProject;
    });

    // TODO: 发送通知给设计师，告知项目已验收通过

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        status: result.status,
        reviewedAt: result.reviewedAt,
        designer: result.assignedToUser,
      },
      message: '项目验收通过，项目已完成',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
