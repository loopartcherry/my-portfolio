import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateUpdateContent } from '@/lib/api/content-validation';
import type { PrismaTransactionClient } from '@/lib/types/prisma';
import { Prisma } from '@prisma/client';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/admin/contents/[id]
 * 获取单篇文章
 * 仅 Admin
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        contentCategory: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        revisions: {
          include: {
            revisedBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { revisedAt: 'desc' },
          take: 10,
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: {
          select: {
            revisions: true,
            comments: true,
          },
        },
      },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    return NextResponse.json({
      success: true,
      data: {
        id: content.id,
        slug: content.slug,
        type: content.type,
        title: content.title,
        subtitle: content.subtitle,
        excerpt: content.excerpt,
        content: content.content,
        contentFormat: content.contentFormat,
        featuredImage: content.featuredImage,
        categoryKeyword: content.categoryKeyword,
        tags: content.tags,
        author: content.author,
        category: content.contentCategory
          ? {
              id: content.contentCategory.id,
              name: content.contentCategory.name,
              slug: content.contentCategory.slug,
              icon: content.contentCategory.icon,
            }
          : null,
        status: content.status,
        views: content.views,
        seo: content.seo,
        isFeatured: content.isFeatured,
        featuredOrder: content.featuredOrder,
        publishedAt: content.publishedAt,
        expiresAt: content.expiresAt,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt,
        revisions: content.revisions.map((r) => ({
          id: r.id,
          title: r.title,
          revisionContent: r.revisionContent,
          revisedBy: r.revisedBy,
          changeNote: r.changeNote,
          revisedAt: r.revisedAt,
        })),
        recentComments: content.comments.map((c) => ({
          id: c.id,
          comment: c.comment,
          rating: c.rating,
          approved: c.approved,
          user: c.user,
          createdAt: c.createdAt,
        })),
        stats: {
          totalRevisions: content._count.revisions,
          totalComments: content._count.comments,
        },
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * PATCH /api/admin/contents/[id]
 * 更新文章
 * 仅 Admin
 * 自动保存版本历史
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const adminId = await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateUpdateContent(body);

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    // 如果更新了 slug，检查是否冲突
    if (v.slug && v.slug !== content.slug) {
      const existing = await prisma.content.findUnique({
        where: { slug: v.slug },
      });
      if (existing) {
        throw new ApiError(422, '该 slug 已存在', 'SLUG_EXISTS');
      }
    }

    // 验证分类是否存在
    if (v.categoryId) {
      const category = await prisma.contentCategory.findUnique({
        where: { id: v.categoryId },
      });
      if (!category) {
        throw new ApiError(404, '分类不存在', 'CATEGORY_NOT_FOUND');
      }
    }

    // 使用事务：更新内容 + 创建版本历史
    const result = await prisma.$transaction(async (tx: PrismaTransactionClient) => {
      // 创建版本历史（如果内容或标题有变化）
      if (v.content || v.title) {
        await tx.contentRevision.create({
          data: {
            contentId: id,
            title: v.title || content.title,
            revisionContent: v.content || content.content,
            revisedById: adminId,
            changeNote: v.changeNote || '更新内容',
          },
        });
      }

      // 更新内容
      const updateData: Prisma.ContentUpdateInput = {};
      if (v.slug !== undefined) updateData.slug = v.slug;
      if (v.type !== undefined) updateData.type = v.type;
      if (v.title !== undefined) updateData.title = v.title;
      if (v.subtitle !== undefined) updateData.subtitle = v.subtitle;
      if (v.excerpt !== undefined) updateData.excerpt = v.excerpt;
      if (v.content !== undefined) updateData.content = v.content;
      if (v.contentFormat !== undefined) updateData.contentFormat = v.contentFormat;
      if (v.featuredImage !== undefined) updateData.featuredImage = v.featuredImage || null;
      if (v.categoryKeyword !== undefined) updateData.categoryKeyword = v.categoryKeyword;
      if (v.categoryId !== undefined) {
        updateData.contentCategory = v.categoryId 
          ? { connect: { id: v.categoryId } }
          : { disconnect: true };
      }
      if (v.tags !== undefined) updateData.tags = v.tags ? (v.tags as Prisma.InputJsonValue) : Prisma.DbNull;
      if (v.seo !== undefined) updateData.seo = v.seo ? (v.seo as Prisma.InputJsonValue) : Prisma.DbNull;
      if (v.status !== undefined) {
        updateData.status = v.status;
        updateData.publishedAt =
          v.status === 'published' && !content.publishedAt
            ? v.publishedAt || new Date()
            : content.publishedAt;
      }
      if (v.isFeatured !== undefined) updateData.isFeatured = v.isFeatured;
      if (v.featuredOrder !== undefined) updateData.featuredOrder = v.featuredOrder;
      if (v.publishedAt !== undefined) updateData.publishedAt = v.publishedAt;
      if (v.expiresAt !== undefined) updateData.expiresAt = v.expiresAt;

      const updated = await tx.content.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          contentCategory: {
            select: { id: true, name: true, slug: true },
          },
        },
      });

      return updated;
    });

    revalidatePath('/insights');
    revalidatePath(`/insights/${result.slug}`);
    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        slug: result.slug,
        title: result.title,
        status: result.status,
        updatedAt: result.updatedAt,
      },
      message: '文章更新成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * DELETE /api/admin/contents/[id]
 * 删除文章（软删除）
 * 仅 Admin
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;

    const content = await prisma.content.findUnique({
      where: { id, deletedAt: null },
    });

    if (!content) {
      throw new ApiError(404, '文章不存在', 'CONTENT_NOT_FOUND');
    }

    // 软删除：设置 deletedAt
    await prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/insights');
    if (content.slug) revalidatePath(`/insights/${content.slug}`);
    return NextResponse.json({
      success: true,
      message: '文章已删除',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
