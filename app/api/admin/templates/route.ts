import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import {
  validateTemplateListQuery,
  validateCreateTemplate,
} from '@/lib/api/template-validation';
import type { Prisma } from '@prisma/client';

function parseListQuery(request: NextRequest): ReturnType<typeof validateTemplateListQuery> {
  const sp = request.nextUrl.searchParams;
  return validateTemplateListQuery({
    status: sp.get('status') || undefined,
    category: sp.get('category') || undefined,
    search: sp.get('search') || undefined,
    sortBy: sp.get('sortBy') || undefined,
    page: sp.get('page') || undefined,
    limit: sp.get('limit') || undefined,
  });
}

/**
 * GET /api/admin/templates
 * 获取所有模板（管理员视图）
 * 仅 Admin
 * 查询参数：status, category, search, sortBy, page, limit
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const q = parseListQuery(request);

    const where: Prisma.TemplateWhereInput = {};
    if (q.status) {
      where.status = q.status;
    }
    if (q.search) {
      // PostgreSQL 使用 ilike 进行不区分大小写搜索
      where.OR = [
        { name: { contains: q.search } },
        { description: { contains: q.search } },
        { author: { contains: q.search } },
      ];
    }

    const orderBy: Prisma.TemplateOrderByWithRelationInput = {};
    if (q.sortBy) {
      orderBy[q.sortBy] = q.sortBy === 'price' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (q.page - 1) * q.limit;
    const take = q.limit;

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
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
          _count: {
            select: {
              reviews: true,
              downloadRecords: true,
            },
          },
        },
        orderBy,
        skip,
        take,
      }),
      prisma.template.count({ where }),
    ]);

    // Filter by category if provided
    let filteredTemplates = templates;
    if (q.category) {
      filteredTemplates = templates.filter((t) =>
        t.categories.some((c) => c.category.slug === q.category || c.category.id === q.category)
      );
    }

    const list = filteredTemplates.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      categories: t.categories.map((c) => ({
        id: c.category.id,
        name: c.category.name,
        slug: c.category.slug,
      })),
      preview: t.preview,
      price: t.price,
      discount: t.discount,
      downloads: t.downloads,
      likes: t.likes,
      rating: t.rating,
      tags: t.tags,
      author: t.author,
      status: t.status,
      views: t.views,
      isFeatured: t.isFeatured,
      featuredUntil: t.featuredUntil,
      uploadedBy: t.uploadedBy,
      reviewsCount: t._count.reviews,
      downloadsCount: t._count.downloadRecords,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      publishedAt: t.publishedAt,
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
 * POST /api/admin/templates
 * 上传新模板
 * 仅 Admin
 * 请求体：multipart/form-data 或 JSON（文件上传需单独处理）
 * 注意：实际文件上传应使用专门的 upload API，这里接收文件 URL
 */
export async function POST(request: NextRequest) {
  try {
    const adminId = await requireAdmin(request);

    // 尝试解析 JSON（如果 Content-Type 是 application/json）
    let body: {
      fileUrls?: Array<{ format?: string; url: string; size?: number }>;
      previewUrls?: string[];
      [key: string]: unknown;
    };
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('multipart/form-data')) {
      // 处理 multipart/form-data
      const formData = await request.formData();
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        categoryIds: formData.get('categoryIds') ? JSON.parse(formData.get('categoryIds') as string) : undefined,
        price: formData.get('price') ? parseFloat(formData.get('price') as string) : undefined,
        discount: formData.get('discount') ? parseFloat(formData.get('discount') as string) : undefined,
        tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : undefined,
        author: formData.get('author'),
        status: formData.get('status') || 'draft',
        // 文件 URL（实际应从文件上传 API 获取）
        previewUrls: formData.get('previewUrls') ? JSON.parse(formData.get('previewUrls') as string) : [],
        fileUrls: formData.get('fileUrls') ? JSON.parse(formData.get('fileUrls') as string) : [],
      };
    } else {
      throw new ApiError(400, '不支持的 Content-Type', 'UNSUPPORTED_CONTENT_TYPE');
    }

    const v = validateCreateTemplate(body);

    // 创建模板
    const template = await prisma.template.create({
      data: {
        name: v.name,
        description: v.description,
        categoryIds: v.categoryIds,
        preview: (body.previewUrls || []) as string[],
        files: body.fileUrls
          ? (body.fileUrls as Array<{ format?: string; url: string; size?: number }>).map((f) => ({
              format: f.format || 'UNKNOWN',
              url: f.url,
              size: f.size || 0,
            }))
          : undefined,
        price: v.price ?? 0,
        discount: v.discount,
        tags: v.tags,
        author: v.author,
        status: v.status || 'draft',
        uploadedById: adminId,
        publishedAt: v.status === 'published' ? new Date() : null,
      },
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // 关联分类（如果提供了 categoryIds）
    if (v.categoryIds && v.categoryIds.length > 0) {
      // 验证分类是否存在
      const categories = await prisma.templateCategory.findMany({
        where: { id: { in: v.categoryIds } },
        select: { id: true },
      });
      
      if (categories.length !== v.categoryIds.length) {
        throw new ApiError(404, '部分分类不存在', 'SOME_CATEGORIES_NOT_FOUND');
      }

      await prisma.templateCategoryTemplate.createMany({
        data: v.categoryIds.map((catId) => ({
          templateId: template.id,
          categoryId: catId,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        status: template.status,
        createdAt: template.createdAt,
      },
      message: '模板创建成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
