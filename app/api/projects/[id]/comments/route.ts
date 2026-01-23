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
 * POST /api/projects/[id]/comments
 * 创建项目评论
 * 需要登录，需要项目权限
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: projectId } = await context.params;
    const body = await request.json();
    const v = CreateCommentSchema.parse(body);

    // 验证项目存在并检查权限
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, assignedToUserId: true },
    });

    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    // 只有项目所有者、分配的设计师或管理员可以评论
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      project.userId !== userId &&
      project.assignedToUserId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权评论此项目', 'FORBIDDEN');
    }

    // 如果指定了父评论，验证父评论存在
    if (v.parentId) {
      const parent = await prisma.projectComment.findUnique({
        where: { id: v.parentId },
        select: { projectId: true },
      });

      if (!parent || parent.projectId !== projectId) {
        throw new ApiError(404, '父评论不存在', 'PARENT_COMMENT_NOT_FOUND');
      }
    }

    // 创建评论
    const comment = await prisma.projectComment.create({
      data: {
        projectId,
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

    // 创建通知（通知项目相关用户，除了评论者本人）
    const notifyUserIds = new Set<string>();
    if (project.userId !== userId) notifyUserIds.add(project.userId);
    if (project.assignedToUserId && project.assignedToUserId !== userId) {
      notifyUserIds.add(project.assignedToUserId);
    }

    // 如果是对评论的回复，通知原评论者
    if (v.parentId) {
      const parent = await prisma.projectComment.findUnique({
        where: { id: v.parentId },
        select: { userId: true },
      });
      if (parent && parent.userId !== userId) {
        notifyUserIds.add(parent.userId);
      }
    }

    // 批量创建通知
    await Promise.all(
      Array.from(notifyUserIds).map((notifyUserId) =>
        prisma.notification.create({
          data: {
            userId: notifyUserId,
            type: 'project_comment',
            title: '新评论',
            content: `项目有新评论：${v.content.substring(0, 50)}${v.content.length > 50 ? '...' : ''}`,
            projectId,
            actionUrl: `/dashboard/projects/${projectId}`,
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
 * GET /api/projects/[id]/comments
 * 获取项目评论列表
 * 需要登录，需要项目权限
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: projectId } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // 验证项目存在并检查权限
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, assignedToUserId: true },
    });

    if (!project) {
      throw new ApiError(404, '项目不存在', 'PROJECT_NOT_FOUND');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (
      project.userId !== userId &&
      project.assignedToUserId !== userId &&
      user?.role !== 'admin'
    ) {
      throw new ApiError(403, '无权查看此项目的评论', 'FORBIDDEN');
    }

    // 获取评论（只获取顶级评论，回复通过replies关系加载）
    const [comments, total] = await Promise.all([
      prisma.projectComment.findMany({
        where: {
          projectId,
          parentId: null, // 只获取顶级评论
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
      prisma.projectComment.count({
        where: {
          projectId,
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
