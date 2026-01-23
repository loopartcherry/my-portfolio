import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';

/**
 * GET /api/admin/templates/stats
 * 获取模板统计信息
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const [
      totalTemplates,
      publishedTemplates,
      totalDownloads,
      templates,
      downloadsByCategory,
    ] = await Promise.all([
      prisma.template.count(),
      prisma.template.count({ where: { status: 'published' } }),
      prisma.templateDownload.count(),
      prisma.template.findMany({
        where: { status: 'published' },
        include: {
          categories: {
            include: {
              category: {
                select: { name: true, slug: true },
              },
            },
          },
        },
        orderBy: { downloads: 'desc' },
        take: 10,
      }),
      prisma.templateCategory.findMany({
        include: {
          templates: {
            include: {
              template: {
                select: { downloads: true },
              },
            },
          },
        },
      }),
    ]);

    // 计算平均评分
    const reviews = await prisma.templateReview.findMany({
      select: { rating: true },
    });
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    // 按分类统计下载数
    const downloadsByCategoryMap: Record<string, number> = {};
    downloadsByCategory.forEach((cat) => {
      const downloads = cat.templates.reduce(
        (sum, t) => sum + (t.template.downloads || 0),
        0
      );
      downloadsByCategoryMap[cat.slug] = downloads;
    });

    // 热门模板
    const popularTemplates = templates.map((t) => ({
      id: t.id,
      name: t.name,
      downloads: t.downloads,
      rating: t.rating,
      views: t.views,
      categories: t.categories.map((c) => ({
        name: c.category.name,
        slug: c.category.slug,
      })),
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalTemplates,
        publishedTemplates,
        draftTemplates: totalTemplates - publishedTemplates,
        totalDownloads,
        averageRating: Math.round(averageRating * 10) / 10,
        downloadsByCategory: downloadsByCategoryMap,
        popularTemplates,
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
