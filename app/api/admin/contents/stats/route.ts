import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/contents/stats
 * 获取文章统计
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const [
      totalArticles,
      publishedArticles,
      contents,
      categories,
      totalViews,
    ] = await Promise.all([
      prisma.content.count({ where: { deletedAt: null } }),
      prisma.content.count({
        where: { status: 'published', deletedAt: null },
      }),
      prisma.content.findMany({
        where: { deletedAt: null },
        select: {
          id: true,
          title: true,
          type: true,
          views: true,
          status: true,
          categoryKeyword: true,
          contentCategory: {
            select: { name: true, slug: true },
          },
        },
        orderBy: { views: 'desc' },
        take: 10,
      }),
      prisma.contentCategory.findMany({
        include: {
          _count: {
            select: {
              contents: true,
            },
          },
        },
      }),
      prisma.content.aggregate({
        where: { deletedAt: null },
        _sum: {
          views: true,
        },
      }),
    ]);

    // 按分类统计文章数
    const articlesByCategory: Record<string, number> = {};
    categories.forEach((cat) => {
      articlesByCategory[cat.slug] = cat._count.contents;
    });

    // 最受欢迎的文章
    const mostViewed = contents
      .filter((c) => c.status === 'published')
      .map((c) => ({
        id: c.id,
        title: c.title,
        type: c.type,
        views: c.views,
        category: c.contentCategory
          ? { name: c.contentCategory.name, slug: c.contentCategory.slug }
          : null,
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalArticles,
        publishedArticles,
        draftArticles: totalArticles - publishedArticles,
        totalViews: totalViews._sum.views || 0,
        articlesByCategory,
        mostViewed,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
