import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateFeaturedContent } from '@/lib/api/content-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/contents/[id]/featured
 * 设置文章为推荐/取消推荐
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateFeaturedContent(body);

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    const updated = await prisma.content.update({
      where: { id },
      data: {
        isFeatured: v.isFeatured,
        featuredOrder: v.featuredOrder !== undefined ? v.featuredOrder : content.featuredOrder,
      },
      select: {
        id: true,
        title: true,
        isFeatured: true,
        featuredOrder: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        title: updated.title,
        isFeatured: updated.isFeatured,
        featuredOrder: updated.featuredOrder,
        updatedAt: updated.updatedAt,
      },
      message: v.isFeatured ? '文章已设置为推荐' : '文章已取消推荐',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
