import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validatePublishContent } from '@/lib/api/content-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/contents/[id]/publish
 * 发布/下架文章
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validatePublishContent(body);

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    const updated = await prisma.content.update({
      where: { id },
      data: {
        status: v.status,
        publishedAt:
          v.status === 'published'
            ? v.publishedAt || content.publishedAt || new Date()
            : v.status === 'draft'
              ? null
              : content.publishedAt,
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
        updatedAt: true,
      },
    });

    const statusMessages: Record<string, string> = {
      published: '文章已发布',
      draft: '文章已保存为草稿',
      archived: '文章已下架',
    };

    revalidatePath('/insights');
    if (content.slug) revalidatePath(`/insights/${content.slug}`);

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        status: updated.status,
        publishedAt: updated.publishedAt,
        updatedAt: updated.updatedAt,
      },
      message: statusMessages[v.status] || '状态已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
