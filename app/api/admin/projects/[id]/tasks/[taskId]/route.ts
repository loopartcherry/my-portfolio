import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

const UpdateTaskSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'completed', 'cancelled']).optional(),
  assignedToUserId: z.string().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  completionRate: z.number().min(0).max(100).optional(),
  dueDate: z.string().nullable().optional(),
});

type RouteContext = { params: Promise<{ id: string; taskId: string }> };

/**
 * PATCH /api/admin/projects/[id]/tasks/[taskId]
 * 更新子任务
 * 仅 Admin
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id: projectId, taskId } = await context.params;
    const body = await request.json();
    const v = UpdateTaskSchema.parse(body);

    // TODO: 更新子任务功能需要 ProjectTask 模型
    // 验证任务是否存在
    // const task = await prisma.projectTask.findUnique({
    //   where: { id: taskId },
    // });

    // if (!task || task.projectId !== projectId) {
    //   throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
    // }

    // // 更新任务
    // const updated = await prisma.projectTask.update({
    //   where: { id: taskId },
    //   data: {
    //     name: v.name,
    //     description: v.description,
    //     status: v.status,
    //     assignedToUserId: v.assignedToUserId === null ? null : v.assignedToUserId,
    //     priority: v.priority,
    //     estimatedHours: v.estimatedHours,
    //     actualHours: v.actualHours,
    //     completionRate: v.completionRate,
    //     dueDate: v.dueDate === null ? null : (v.dueDate ? new Date(v.dueDate) : undefined),
    //     completedAt: v.status === 'completed' && !task.completedAt ? new Date() : undefined,
    //   },
    //   include: {
    //     assignedToUser: {
    //       select: { id: true, name: true, email: true },
    //     },
    //   },
    // });

    return NextResponse.json({
      success: false,
      error: '子任务功能暂未实现，需要 ProjectTask 模型',
      code: 'FEATURE_NOT_IMPLEMENTED',
    }, { status: 501 });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/admin/projects/[id]/tasks/[taskId]
 * 删除子任务
 * 仅 Admin
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await requireAdmin(request);
    const { id: projectId, taskId } = await context.params;

    // 验证任务是否存在
    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
    });

    if (!task || task.projectId !== projectId) {
      throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
    }

    await prisma.projectTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: '任务已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
