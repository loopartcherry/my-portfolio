import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import {
  validateCreateContentCategory,
  validateUpdateContentCategory,
} from '@/lib/api/content-validation';

/**
 * GET /api/admin/contents/categories
 * 获取文章分类
 * 仅 Admin
 */
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const categories = await prisma.contentCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            contents: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        order: cat.order,
        contentsCount: cat._count.contents,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      })),
      count: categories.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

/**
 * POST /api/admin/contents/categories
 * 创建分类
 * 仅 Admin
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const body = await request.json();
    const v = validateCreateContentCategory(body);

    // 检查 slug 是否已存在
    const existing = await prisma.contentCategory.findUnique({
      where: { slug: v.slug },
    });
    if (existing) {
      throw new ApiError(422, '该 slug 已存在', 'SLUG_EXISTS');
    }

    const category = await prisma.contentCategory.create({
      data: {
        name: v.name,
        slug: v.slug,
        description: v.description,
        icon: v.icon || null,
        order: v.order ?? 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        order: category.order,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      message: '分类创建成功',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
