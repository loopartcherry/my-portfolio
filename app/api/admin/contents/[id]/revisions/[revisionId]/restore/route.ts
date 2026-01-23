import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';

type RouteContext = {
  params: Promise<{ id: string; revisionId: string }>;
};

/**
 * POST /api/admin/contents/[id]/revisions/[revisionId]/restore
 * 恢复到历史版本
 * 仅 Admin
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const adminId = await requireAdmin(request);
    const { id, revisionId } = await context.params;

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    const revision = await prisma.contentRevision.findUnique({
      where: { id: revisionId },
    });

    if (!revision || revision.contentId !== id) {
      throw new ApiError(404, '版本不存在', 'REVISION_NOT_FOUND');
    }

    // 使用事务：恢复内容 + 创建新的版本历史
    const result = await prisma.$transaction(async (tx) => {
      // 创建新的版本历史（记录恢复操作）
      await tx.contentRevision.create({
        data: {
          contentId: id,
          title: revision.title || content.title,
          revisionContent: revision.revisionContent,
          revisedById: adminId,
          changeNote: `恢复到版本 ${revision.revisedAt.toLocaleString()}`,
        },
      });

      // 恢复内容
      const restored = await tx.content.update({
        where: { id },
        data: {
          title: revision.title || content.title,
          content: revision.revisionContent,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return restored;
    });

    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        title: result.title,
        content: result.content,
        updatedAt: result.updatedAt,
      },
      message: '已恢复到指定版本',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
