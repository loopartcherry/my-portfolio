import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/errors';
import { ApiError } from '@/lib/api/errors';
import { validateUpdateCategory } from '@/lib/api/template-validation';

type RouteContext = { params: Promise<{ id: string }> };

/**
 * PATCH /api/admin/templates/categories/[id]
 * 更新模板分类
 * 仅 Admin
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin(request);
    const { id } = await context.params;
    const body = await request.json();
    const v = validateUpdateCategory(body);

    const category = await prisma.templateCategory.findUnique({ where: { id } });
    if (!category) {
      throw new ApiError(404, '分类不存在', 'CATEGORY_NOT_FOUND');
    }

    // 如果更新 slug，检查是否冲突
    if (v.slug && v.slug !== category.slug) {
      const existing = await prisma.templateCategory.findUnique({
        where: { slug: v.slug },
      });
      if (existing) {
        throw new ApiError(422, '该 slug 已存在', 'SLUG_EXISTS');
      }
    }

    const updated = await prisma.templateCategory.update({
      where: { id },
      data: {
        ...(v.name !== undefined && { name: v.name }),
        ...(v.slug !== undefined && { slug: v.slug }),
        ...(v.description !== undefined && { description: v.description }),
        ...(v.icon !== undefined && { icon: v.icon }),
        ...(v.order !== undefined && { order: v.order }),
        ...(v.active !== undefined && { active: v.active }),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        description: updated.description,
        icon: updated.icon,
        order: updated.order,
        active: updated.active,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
      message: '分类信息已更新',
    });
  } catch (e) {
    return handleApiError(e);
  }
}
