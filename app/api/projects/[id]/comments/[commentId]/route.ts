import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { z } from 'zod';

type RouteContext = { params: Promise<{ id: string; commentId: string }> };

const UpdateCommentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空'),
});

/**
 * PATCH /api/projects/[id]/comments/[commentId]
 * 更新评论
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: projectId, commentId } = await context.params;
    const body = await request.json();
    const v = UpdateCommentSchema.parse(body);

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      select: { userId: true, projectId: true },
    });

    if (!comment) {
      throw new ApiError(404, '评论不存在', 'COMMENT_NOT_FOUND');
    }

    if (comment.projectId !== projectId) {
      throw new ApiError(400, '评论不属于此项目', 'INVALID_PROJECT');
    }

    // 只有评论者本人或管理员可以修改
    if (comment.userId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== 'admin') {
        throw new ApiError(403, '无权修改此评论', 'FORBIDDEN');
      }
    }

    const updated = await prisma.projectComment.update({
      where: { id: commentId },
      data: { content: v.content },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
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

    return NextResponse.json({
      success: true,
      data: updated,
      message: '评论已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/projects/[id]/comments/[commentId]
 * 删除评论
 */
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const userId = await requireAuth(request);
    const { id: projectId, commentId } = await context.params;

    const comment = await prisma.projectComment.findUnique({
      where: { id: commentId },
      select: { userId: true, projectId: true },
    });

    if (!comment) {
      throw new ApiError(404, '评论不存在', 'COMMENT_NOT_FOUND');
    }

    if (comment.projectId !== projectId) {
      throw new ApiError(400, '评论不属于此项目', 'INVALID_PROJECT');
    }

    // 只有评论者本人或管理员可以删除
    if (comment.userId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== 'admin') {
        throw new ApiError(403, '无权删除此评论', 'FORBIDDEN');
      }
    }

    // 删除评论（级联删除回复）
    await prisma.projectComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: '评论已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
