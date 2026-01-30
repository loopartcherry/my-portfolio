import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateUpdateTemplate } from '@/lib/api/template-validation';
import type { Prisma } from '@prisma/client';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/templates/[id]
 * 获取单个模板详情
 * 仅 Admin
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const template = await prisma.template.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true, icon: true },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        downloadRecords: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { downloadedAt: 'desc' },
          take: 50,
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

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        categories: template.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          slug: c.category.slug,
          icon: c.category.icon,
        })),
        preview: template.preview,
        files: template.files,
        price: template.price,
        discount: template.discount,
        downloads: template.downloads,
        likes: template.likes,
        rating: template.rating,
        tags: template.tags,
        author: template.author,
        status: template.status,
        views: template.views,
        isFeatured: template.isFeatured,
        featuredUntil: template.featuredUntil,
        uploadedBy: template.uploadedBy,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        publishedAt: template.publishedAt,
        reviews: template.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          helpful: r.helpful,
          user: r.user,
          createdAt: r.createdAt,
        })),
        recentDownloads: template.downloadRecords.map((d) => ({
          id: d.id,
          user: d.user,
          downloadedAt: d.downloadedAt,
        })),
        stats: {
          totalReviews: template._count.reviews,
          totalDownloads: template._count.downloadRecords,
        },
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/admin/templates/[id]
 * 更新模板信息
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateUpdateTemplate(body);

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    // 更新模板基本信息
    const updated = await prisma.template.update({
      where: { id },
      data: {
        ...(v.name !== undefined && { name: v.name }),
        ...(v.description !== undefined && { description: v.description }),
        ...(v.categoryIds !== undefined && { categoryIds: v.categoryIds }),
        ...(v.price !== undefined && { price: v.price }),
        ...(v.discount !== undefined && { discount: v.discount }),
        ...(v.tags !== undefined && { tags: v.tags }),
        ...(v.author !== undefined && { author: v.author }),
        ...(v.status !== undefined && {
          status: v.status,
          publishedAt: v.status === 'published' && !template.publishedAt ? new Date() : template.publishedAt,
        }),
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    });

    // 更新分类关联
    if (v.categoryIds !== undefined) {
      // 验证分类是否存在
      if (v.categoryIds.length > 0) {
        const categories = await prisma.templateCategory.findMany({
          where: { id: { in: v.categoryIds } },
          select: { id: true },
        });
        
        if (categories.length !== v.categoryIds.length) {
          throw new ApiError(404, '部分分类不存在', 'SOME_CATEGORIES_NOT_FOUND');
        }
      }

      // 删除旧关联
      await prisma.templateCategoryTemplate.deleteMany({
        where: { templateId: id },
      });
      // 创建新关联
      if (v.categoryIds.length > 0) {
        await prisma.templateCategoryTemplate.createMany({
          data: v.categoryIds.map((catId) => ({
            templateId: id,
            categoryId: catId,
          })),
          skipDuplicates: true,
        });
      }
    }

    revalidatePath('/shop');
    revalidatePath(`/templates/${id}`);
    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        description: updated.description,
        categories: updated.categories.map((c) => ({
          id: c.category.id,
          name: c.category.name,
          slug: c.category.slug,
        })),
        price: updated.price,
        discount: updated.discount,
        tags: updated.tags,
        author: updated.author,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
      message: '模板信息已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/admin/templates/[id]
 * 删除模板
 * 仅 Admin
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const template = await prisma.template.findUnique({ where: { id } });
    if (!template) {
      throw new ApiError(404, '模板不存在', 'TEMPLATE_NOT_FOUND');
    }

    await prisma.template.delete({
      where: { id },
    });

    revalidatePath('/shop');
    revalidatePath(`/templates/${id}`);
    return NextResponse.json({
      success: true,
      message: '模板已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
