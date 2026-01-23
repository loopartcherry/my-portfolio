import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import {
  validateContentListQuery,
  validateCreateContent,
} from '@/lib/api/content-validation';
import { Prisma } from '@prisma/client';

function parseListQuery(request: NextRequest): ReturnType<typeof validateContentListQuery> {
  const sp = request.nextUrl.searchParams;
  return validateContentListQuery({
    type: sp.get('type') || undefined,
    status: sp.get('status') || undefined,
    category: sp.get('category') || undefined,
    search: sp.get('search') || undefined,
    sortBy: sp.get('sortBy') || undefined,
    page: sp.get('page') || undefined,
    limit: sp.get('limit') || undefined,
  });
}

/**
 * GET /api/admin/contents
 * 获取文章列表（管理员）
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const q = parseListQuery(request);

    const where: Prisma.ContentWhereInput = {
      deletedAt: null, // 软删除过滤
    };

    if (q.type) {
      where.type = q.type;
    }
    if (q.status) {
      where.status = q.status;
    }
    if (q.category) {
      where.OR = [
        { categoryKeyword: { contains: q.category } },
        { contentCategory: { slug: q.category } },
      ];
    }
    if (q.search) {
      where.OR = [
        { title: { contains: q.search } },
        { subtitle: { contains: q.search } },
        { excerpt: { contains: q.search } },
        { content: { contains: q.search } },
      ];
    }

    const orderBy: Prisma.ContentOrderByWithRelationInput = {};
    if (q.sortBy) {
      orderBy[q.sortBy] = q.sortBy === 'title' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (q.page - 1) * q.limit;
    const take = q.limit;

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          contentCategory: {
            select: { id: true, name: true, slug: true },
          },
          _count: {
            select: {
              revisions: true,
              comments: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.content.count({ where }),
    ]);

    const list = contents.map((c) => ({
      id: c.id,
      slug: c.slug,
      type: c.type,
      title: c.title,
      subtitle: c.subtitle,
      excerpt: c.excerpt,
      featuredImage: c.featuredImage,
      categoryKeyword: c.categoryKeyword,
      tags: c.tags,
      author: c.author,
      category: c.contentCategory
        ? {
            id: c.contentCategory.id,
            name: c.contentCategory.name,
            slug: c.contentCategory.slug,
          }
        : null,
      status: c.status,
      views: c.views,
      isFeatured: c.isFeatured,
      featuredOrder: c.featuredOrder,
      publishedAt: c.publishedAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      stats: {
        revisionsCount: c._count.revisions,
        commentsCount: c._count.comments,
      },
    }));

    return NextResponse.json({
      success: true,
      data: list,
      pagination: {
        page: q.page,
        limit: q.limit,
        total,
        totalPages: Math.ceil(total / q.limit),
      },
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * POST /api/admin/contents
 * 创建新文章
 * 仅 Admin
 */
export async function POST(request: NextRequest) {
  try {
    const adminId = await requireAdmin(request);
    const body = await request.json();
    const v = validateCreateContent(body);

    // 检查 slug 是否已存在
    const existing = await prisma.content.findUnique({
      where: { slug: v.slug },
    });
    if (existing) {
      throw new ApiError(422, '该 slug 已存在', 'SLUG_EXISTS');
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

    const content = await prisma.content.create({
      data: {
        slug: v.slug,
        type: v.type,
        title: v.title,
        subtitle: v.subtitle,
        excerpt: v.excerpt,
        content: v.content,
        contentFormat: v.contentFormat || 'html',
        featuredImage: v.featuredImage || null,
        categoryKeyword: v.categoryKeyword,
        categoryId: v.categoryId,
        tags: v.tags ? (v.tags as Prisma.InputJsonValue) : Prisma.DbNull,
        authorId: adminId,
        status: v.status || 'draft',
        seo: v.seo ? (v.seo as Prisma.InputJsonValue) : Prisma.DbNull,
        isFeatured: v.isFeatured || false,
        featuredOrder: v.featuredOrder || 0,
        publishedAt: v.status === 'published' ? (v.publishedAt || new Date()) : null,
        expiresAt: v.expiresAt || null,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        contentCategory: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: content.id,
        slug: content.slug,
        title: content.title,
        status: content.status,
        createdAt: content.createdAt,
      },
      message: '文章创建成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
