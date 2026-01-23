import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string }> };

const UpdateTaskSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'cancelled']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedToUserId: z.string().nullable().optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  completionRate: z.number().min(0).max(100).optional(),
  dueDate: z.string().nullable().optional(),
});

/**
 * GET /api/tasks/[id]
 * 获取任务详情
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const task = await prisma.projectTask.findUnique({
      where: { id },
      include: {
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true, userId: true, assignedToUserId: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!task) {
      throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
    }

    // 检查权限
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      task.assignedToUserId !== userId &&
      task.project.userId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权查看此任务', 'FORBIDDEN');
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/tasks/[id]
 * 更新任务（设计师可以更新状态、进度等）
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = UpdateTaskSchema.parse(body);

    const task = await prisma.projectTask.findUnique({
      where: { id },
      include: {
        project: {
          select: { userId: true, assignedToUserId: true },
        },
      },
    });

    if (!task) {
      throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    // 检查权限：只有任务分配人、项目所有者或管理员可以更新
    if (
      task.assignedToUserId !== userId &&
      task.project.userId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权更新此任务', 'FORBIDDEN');
    }

    // 构建更新数据
    const updateData: any = {};
    if (v.name !== undefined) updateData.name = v.name;
    if (v.description !== undefined) updateData.description = v.description;
    if (v.status !== undefined) {
      updateData.status = v.status;
      // 如果状态变为进行中，记录开始时间
      if (v.status === 'in_progress' && !task.startedAt) {
        updateData.startedAt = new Date();
      }
      // 如果状态变为已完成，记录完成时间
      if (v.status === 'completed' && !task.completedAt) {
        updateData.completedAt = new Date();
        updateData.completionRate = 100;
      }
    }
    if (v.priority !== undefined) updateData.priority = v.priority;
    if (v.assignedToUserId !== undefined) {
      updateData.assignedToUserId = v.assignedToUserId;
      
      // 如果重新分配，创建通知
      if (v.assignedToUserId && v.assignedToUserId !== task.assignedToUserId) {
        await prisma.notification.create({
          data: {
            userId: v.assignedToUserId,
            type: 'task_assigned',
            title: '任务已分配',
            content: `任务"${task.name}"已分配给您`,
            taskId: id,
            projectId: task.projectId,
            actionUrl: `/designer/tasks?task=${id}`,
          },
        });
      }
    }
    if (v.estimatedHours !== undefined) updateData.estimatedHours = v.estimatedHours;
    if (v.actualHours !== undefined) updateData.actualHours = v.actualHours;
    if (v.completionRate !== undefined) updateData.completionRate = v.completionRate;
    if (v.dueDate !== undefined) {
      updateData.dueDate = v.dueDate ? new Date(v.dueDate) : null;
    }

    const updated = await prisma.projectTask.update({
      where: { id },
      data: updateData,
      include: {
        assignedToUser: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
      },
    });

    // 如果任务完成，通知项目所有者
    if (v.status === 'completed' && task.project.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: task.project.userId,
          type: 'task_completed',
          title: '任务已完成',
          content: `任务"${task.name}"已完成`,
          taskId: id,
          projectId: task.projectId,
          actionUrl: `/dashboard/projects/${task.projectId}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: '任务已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/tasks/[id]
 * 删除任务（仅管理员）
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id } = await context.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== 'admin') {
      throw new ApiError(403, '仅管理员可以删除任务', 'FORBIDDEN');
    }

    await prisma.projectTask.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '任务已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
