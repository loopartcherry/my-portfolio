import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import type { Prisma } from '@prisma/client';

/**
 * GET /api/templates/[id]
 * 获取模板详情（公开接口，无需认证）
 */
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: templateId } = await context.params;

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: {
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
        uploadedBy: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            reviews: true,
            downloadRecords: true,
          },
        },
      },
    });

    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    // 只返回已发布的模板
    if (template.status !== 'published') {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    // 增加浏览次数
    await prisma.template.update({
      where: { id: templateId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        preview: template.preview,
        price: template.price,
        discount: template.discount,
        finalPrice: template.discount
          ? template.price * template.discount
          : template.price,
        downloads: template.downloads,
        likes: template.likes,
        rating: template.rating,
        tags: template.tags,
        author: template.author,
        views: template.views + 1, // 已增加
        categories: template.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          slug: c.category.slug,
        })),
        uploadedBy: template.uploadedBy,
        createdAt: template.createdAt,
        _count: template._count,
        // 不返回 files，需要购买后才能下载
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
