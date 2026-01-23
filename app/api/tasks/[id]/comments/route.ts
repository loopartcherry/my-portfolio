import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

type RouteContext = { params: Promise<{ id: string }> };

const CreateCommentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
  parentId: z.string().optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    size: z.number(),
  })).optional(),
});

/**
 * POST /api/tasks/[id]/comments
 * 创建任务评论
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: taskId } = await context.params;
    const body = await request.json();
    const v = CreateCommentSchema.parse(body);

    // 验证任务存在并检查权限
    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      include: {
        project: {
          select: { userId: true, assignedToUserId: true },
        },
      },
    });

    if (!task) {
      throw new ApiError(404, '任务不存在', 'TASK_NOT_FOUND');
    }

    // 只有任务分配人、项目所有者或管理员可以评论
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      task.assignedToUserId !== userId &&
      task.project.userId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权评论此任务', 'FORBIDDEN');
    }

    // 如果指定了父评论，验证父评论存在
    if (v.parentId) {
      const parent = await prisma.taskComment.findUnique({
        where: { id: v.parentId },
        select: { taskId: true },
      });

      if (!parent || parent.taskId !== taskId) {
        throw new ApiError(404, '父评论不存在', 'PARENT_COMMENT_NOT_FOUND');
      }
    }

    // 创建评论
    const comment = await prisma.taskComment.create({
      data: {
        taskId,
        userId,
        content: v.content,
        parentId: v.parentId || null,
        attachments: v.attachments ? (v.attachments as Prisma.InputJsonValue) : Prisma.DbNull,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        parent: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    // 创建通知
    const notifyUserIds = new Set<string>();
    if (task.assignedToUserId && task.assignedToUserId !== userId) {
      notifyUserIds.add(task.assignedToUserId);
    }
    if (task.project.userId !== userId) {
      notifyUserIds.add(task.project.userId);
    }
    if (task.project.assignedToUserId && task.project.assignedToUserId !== userId) {
      notifyUserIds.add(task.project.assignedToUserId);
    }

    if (v.parentId) {
      const parent = await prisma.taskComment.findUnique({
        where: { id: v.parentId },
        select: { userId: true },
      });
      if (parent && parent.userId !== userId) {
        notifyUserIds.add(parent.userId);
      }
    }

    await Promise.all(
      Array.from(notifyUserIds).map((notifyUserId) =>
        prisma.notification.create({
          data: {
            userId: notifyUserId,
            type: 'project_comment',
            title: '新评论',
            content: `任务有新评论：${v.content.substring(0, 50)}${v.content.length > 50 ? '...' : ''}`,
            taskId,
            projectId: task.projectId,
            actionUrl: `/designer/tasks?task=${taskId}`,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: comment,
      message: '评论已发布',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * GET /api/tasks/[id]/comments
 * 获取任务评论列表
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: taskId } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 验证任务存在并检查权限
    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
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

    if (
      task.assignedToUserId !== userId &&
      task.project.userId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权查看此任务的评论', 'FORBIDDEN');
    }

    const [comments, total] = await Promise.all([
      prisma.taskComment.findMany({
        where: {
          taskId,
          parentId: null,
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, name: true, email: true, role: true },
              },
              replies: {
                include: {
                  user: {
                    select: { id: true, name: true, email: true, role: true },
                  },
                },
                orderBy: { createdAt: 'asc' },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.taskComment.count({
        where: {
          taskId,
          parentId: null,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: comments,
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
